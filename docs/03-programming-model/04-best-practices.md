---
title: Best Practices
description: Performance optimization, common patterns, and production deployment tips.
slug: /programming-model/best-practices
tags: [programming-model, best-practices]
related:
  - /docs/benchmarks/microbenchmarks
  - /docs/architecture/overview
sidebar_position: 4
---

This guide covers proven patterns for building high-performance GASNet applications.

## Performance optimization

### Overlap computation with communication

Use non-blocking operations to maximize overlap:

```c
// Anti-pattern: blocking operations waste CPU cycles
for (int i = 0; i < n; i++) {
    gasnet_put(nodes[i], dst[i], src[i], size);
    gasnet_barrier_wait(0, 0);  // Unnecessary wait
}

// Better: pipeline non-blocking operations
gasnet_handle_t *handles = malloc(n * sizeof(gasnet_handle_t));

for (int i = 0; i < n; i++) {
    handles[i] = gasnet_put_nb(nodes[i], dst[i], src[i], size);
}

// Do local work while transfers complete
local_computation();

for (int i = 0; i < n; i++) {
    gasnet_wait_sync(handles[i]);
}
```

### Aggregate small messages

Small messages suffer from fixed per-message overhead:

```c
// Poor: many tiny messages
for (int i = 0; i < 1000; i++) {
    gasnet_put(target, remote_buf + i*8, local_buf + i*8, 8);
}

// Better: single bulk transfer
gasnet_put(target, remote_buf, local_buf, 8000);
```

**Guideline**: Messages smaller than 1KB should be aggregated when possible.

### Use appropriate synchronization

Choose the right primitive for the situation:

| Pattern                      | Use case                    | Alternative                    |
| ---------------------------- | --------------------------- | ------------------------------ |
| `gasnet_barrier_notify/wait` | Global synchronization      | N/A                            |
| `gasnet_wait_sync`           | Wait for specific operation | `gasnet_try_sync` with polling |
| Atomic operations            | Fine-grained coordination   | Active messages                |

### Pin threads to cores

Prevent migration and cache pollution:

```c
#include <pthread.h>
#include <sched.h>

void pin_thread_to_core(int core_id) {
    cpu_set_t cpuset;
    CPU_ZERO(&cpuset);
    CPU_SET(core_id, &cpuset);
    pthread_setaffinity_np(pthread_self(), sizeof(cpuset), &cpuset);
}

// Pin progress threads away from compute cores
pin_thread_to_core(gasnet_mynode() % num_cores);
```

### Align data structures

Proper alignment prevents expensive unaligned accesses:

```c
// Use aligned allocation for RMA buffers
void *aligned_buffer;
posix_memalign(&aligned_buffer, 64, buffer_size);  // Cache-line aligned

// Or use GASNet's segment allocation
gasnet_seginfo_t seginfo;
gasnet_get_seginfo(&seginfo, 1);
void *segment_base = seginfo[0].addr;  // Already properly aligned
```

## Common patterns

### Producer-consumer pipeline

```c
// Shared queue structure in GASNet segment
typedef struct {
    int head;
    int tail;
    gasnet_node_t owner;
    lock_t lock;
    task_t tasks[MAX_TASKS];
} queue_t;

void enqueue_task(queue_t *q, task_t t) {
    gasnet_atomic_acquire_lock(&q->lock);
    q->tasks[q->head % MAX_TASKS] = t;
    gasnet_atomic_fence();  // Ensure write visibility
    q->head++;
    gasnet_atomic_release_lock(&q->lock);
}
```

### Halo exchange pattern

Common in stencil computations:

```c
void exchange_halo(void *grid, int width, int height) {
    int left = (gasnet_mynode() - 1 + gasnet_nodes()) % gasnet_nodes();
    int right = (gasnet_mynode() + 1) % gasnet_nodes();

    gasnet_handle_t handles[2];

    // Non-blocking sends
    handles[0] = gasnet_put_nb(left, remote_left, local_right, halo_size);
    handles[1] = gasnet_put_nb(right, remote_right, local_left, halo_size);

    // Simultaneous receives can use gets or AM handlers
    // ...

    for (int i = 0; i < 2; i++) {
        gasnet_wait_sync(handles[i]);
    }
}
```

### Broadcast via tree

```c
void tree_broadcast(void *data, size_t size, gasnet_node_t root) {
    int level = 0;
    int stride = 1;

    while (stride < gasnet_nodes()) {
        int recv_from = (gasnet_mynode() - stride + gasnet_nodes()) % gasnet_nodes();
        int send_to = (gasnet_mynode() + stride) % gasnet_nodes();

        if (gasnet_mynode() < stride) {
            // Senders at this level
            gasnet_put(send_to, remote_addr, data, size);
        } else {
            // Receivers at this level
            gasnet_wait_sync(gasnet_get_nb(data, recv_from, remote_addr, size));
        }

        gasnet_barrier_notify(0, 0);
        gasnet_barrier_wait(0, 0);

        stride *= 2;
        level++;
    }
}
```

## Anti-patterns to avoid

### Excessive barriers

Barriers introduce synchronization overhead and hide parallelism:

```c
// Bad: barrier in inner loop
for (int iter = 0; iter < 10000; iter++) {
    compute_local(data);
    gasnet_barrier_notify(0, 0);
    gasnet_barrier_wait(0, 0);  // Too frequent!
}

// Good: asynchronous communication with periodic sync
for (int iter = 0; iter < 10000; iter++) {
    compute_local(data);
    if (iter % 100 == 0) {
        exchange_boundaries_async();
    }
}
gasnet_barrier_wait(0, 0);
```

### Unregistered memory RMA

Always use registered memory regions for RMA:

```c
// Bad: unregistered pointer
char *buf = malloc(SIZE);
gasnet_put(target, remote_buf, buf, SIZE);  // May crash or be slow

// Good: registered segment
gasnet_seginfo_t seginfo;
gasnet_get_seginfo(&seginfo, gasnet_nodes());
void *buf = seginfo[gasnet_mynode()].addr;
gasnet_put(target, seginfo[target].addr + offset, buf, SIZE);
```

### Ignoring NUMA topology

Place memory near the CPU that uses it:

```c
// Allocate on local NUMA node
#include <numa.h>

void *numa_local_alloc(size_t size) {
    int node = numa_node_of_cpu(sched_getcpu());
    void *ptr = numa_alloc_onnode(size, node);
    return ptr;
}
```

### Handler starvation

Long-running handlers block progress:

```c
// Bad: long computation in handler
void bad_handler(gasnet_token_t token, void *buf, size_t len,
                 gasnet_handlerarg_t arg0, gasnet_handlerarg_t arg1) {
    expensive_computation();  // Blocks other AMs!
}

// Good: defer to worker thread
void good_handler(gasnet_token_t token, void *buf, size_t len,
                  gasnet_handlerarg_t arg0, gasnet_handlerarg_t arg1) {
    enqueue_work(buf, len, arg0);
}
```

## Production deployment

### Environment configuration

Set these variables in production job scripts:

```bash
# Performance tuning
export GASNET_SLEEPY_POLL=1          # Save power when idle
export GASNET_MASTER_IPC=1           # Optimize intra-node communication

# Debugging (disable in production!)
# export GASNET_BACKTRACE=1
# export GASNET_VERBOSE=0

# Transport-specific
export GASNET_UCX_NETDEVICES=mlx5_0:1
export GASNET_CQ_DEPTH=4096
```

### Resource allocation

Request appropriate resources for your transport:

```bash
# MPI transport - match processes to cores
#SBATCH --ntasks-per-node=8
#SBATCH --cpus-per-task=1

# UCX transport - may need dedicated cores
#SBATCH --ntasks-per-node=8
#SBATCH --cpus-per-task=2  # 1 for compute, 1 for progress
```

### Monitoring and telemetry

Instrument your application for production monitoring:

```c
typedef struct {
    uint64_t puts_issued;
    uint64_t gets_issued;
    uint64_t ams_sent;
    uint64_t bytes_transferred;
    double total_rma_time;
} stats_t;

void print_stats(stats_t *s) {
    int node = gasnet_mynode();
    printf("Node %d: Puts=%lu Gets=%lu AMs=%lu Bytes=%lu RMA_time=%.2f us\n",
           node, s->puts_issued, s->gets_issued, s->ams_sent,
           s->bytes_transferred, s->total_rma_time);
}
```

### Error handling

Implement graceful degradation:

```c
int robust_put(gasnet_node_t node, void *dst, void *src, size_t size) {
    int retries = 3;
    int result;

    do {
        result = gasnet_put_nb(node, dst, src, size);
        if (result != GASNET_OK) {
            usleep(1000);  // Back off before retry
        }
    } while (result != GASNET_OK && retries-- > 0);

    if (result != GASNET_OK) {
        fprintf(stderr, "Put to node %d failed after retries\n", node);
        return ERROR_PUT_FAILED;
    }

    return GASNET_OK;
}
```

### Testing checklist

Before production deployment:

- [ ] Verify correct transport selection
- [ ] Test at target scale (node count)
- [ ] Run with memory sanitizers if available
- [ ] Validate under fault injection (if supported)
- [ ] Measure tail latency (p95, p99), not just mean
- [ ] Confirm no memory leaks over long runs
- [ ] Check for handler queue overflow
