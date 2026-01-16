---
title: Troubleshooting Guide
description: Common GASNet errors, installation issues, and performance debugging.
slug: /getting-started/troubleshooting
tags: [getting-started, troubleshooting]
related:
  - /docs/getting-started/environment-baseline
  - /docs/interop/runtime-integration
sidebar_position: 4
---

This guide helps you diagnose and resolve common GASNet-related issues.

## Installation errors

### MPI transport not found

**Symptom**: `configure: error: MPI transport requested but MPI compiler wrappers not found`

**Solutions**:

1. Load the MPI module before configuring:

   ```bash
   module load mpi/openmpi-x86_64
   ```

2. Explicitly set MPI compilers:

   ```bash
   export MPICC=mpicc
   export MPICXX=mpicxx
   ```

3. Verify MPI installation:
   ```bash
   which mpicc && mpicc --showme:version
   ```

### UCX transport failures

**Symptom**: `GASNet-EX: Unable to initialize UCX transport`

**Common causes**:

| Issue                    | Check         | Fix                                                  |
| ------------------------ | ------------- | ---------------------------------------------------- | --------------------------------- |
| UCX not installed        | `ucx_info -v` | Install UCX via package manager or build from source |
| Incompatible UCX version | `ucx_info -v  | grep Ver`                                            | Ensure UCX >= 1.9.x for GASNet-EX |
| Missing IB devices       | `ibstat`      | Verify InfiniBand drivers are loaded                 |

### OFI/libfabric binding errors

**Symptom**: `libfabric: fi_getinfo() failed`

**Debug steps**:

```bash
# Check available providers
fi_info -p <provider>

# Test fabric connectivity
fi_pingpong -p <provider> -s <server_addr>
```

Common provider issues:

- **verbs**: Requires `rdmav2` library and working RDMA devices
- **psm2**: Only available on Intel Omni-Path fabrics
- **tcp**: Falls back to TCP but loses RDMA benefits

## Runtime failures

### GASNet initialization failed

**Symptom**: `gasnet_init() returned error GASNET_ERR_RESOURCE`

**Diagnostics**:

1. Check node count matches allocation:

   ```bash
   echo $GASNET_PSHM_NODES
   echo $SLURM_JOB_NUM_NODES
   ```

2. Verify shared memory segment limits:

   ```bash
   # Check current limits
   ulimit -a | grep -i shm

   # Increase if needed (Linux)
   sysctl kernel.shmmax=2147483648
   ```

3. Validate transport selection:
   ```bash
   export GASNET_BACKTRACE=1
   export GASNET_VERBOSE=1
   ```

### Endpoint discovery timeout

**Symptom**: Process hangs during `gasnet_attach()`

**Checks**:

```bash
# Verify firewall rules aren't blocking communication
sudo iptables -L -n | grep -i reject

# Check if ports in range are available
netstat -tuln | grep <port_range>
```

Set explicit timeout for debugging:

```bash
export GASNET_BOOTSTRAP_TIMEOUT=300
```

### Segmentation faults on put/get

**Symptom**: Crash during `gasnet_put()` or `gasnet_get()`

**Common causes**:

1. **Unregistered memory**: Always register regions before RMA operations:

   ```c
   gasnet_register_local_region(ptr, size, &handle);
   ```

2. **Alignment violations**: Ensure pointers are properly aligned:

   ```c
   // Bad: unaligned pointer
   char *ptr = malloc(1024) + 1;

   // Good: aligned allocation
   gasnet_seginfo_t seginfo;
   gasnet_get_seginfo(&seginfo, gasnet_nodes());
   void *ptr = seginfo[mynode].addr;
   ```

3. **Bounds checking**: Enable bounds checking in debug builds:
   ```bash
   configure --enable-debug --enable-boundchecks
   ```

## Performance debugging

### Unexpectedly high latency

**Measurement approach**:

```c
#include <gasnetex.h>

double t_start = gasnett_gettime_ns();
gasnet_get(dst, node, src, nbytes);
gasnet_wait_sync(geth);
double t_end = gasnett_gettime_ns();

printf("Latency: %.2f us\n", (t_end - t_start) / 1000.0);
```

**Potential causes**:

| Symptom                    | Likely cause          | Diagnostic                   |
| -------------------------- | --------------------- | ---------------------------- |
| >2us small-msg latency     | Wrong transport       | Check `GASNET_SPMD_NODEINFO` |
| Latency degrades with size | Path MTU issue        | Verify `ibv_devinfo -v`      |
| High variance              | CPU frequency scaling | Disable turbo boost          |

### Low bandwidth saturation

**Check NIC settings**:

```bash
# InfiniBand port state
ibstat | grep -A 7 "Port .* state"

# PCIe negotiation width
lspci -vvv | grep -A 10 "Infiniband"
```

**Common fixes**:

1. Disable interrupt moderation for latency-sensitive workloads:

   ```bash
   ethtool -C <iface> rx-usecs 0 rx-frames 0
   ```

2. Increase completion queue depth:

   ```bash
   export IBV_CQ_DEPTH=4096
   ```

## Capture a debug bundle

When issues persist, capture a minimal bundle for analysis:

```bash
export GASNET_VERBOSE=1
export GASNET_BACKTRACE=1
env | grep GASNET > gasnet-env.txt
ibstat > ibstat.txt
```

Include the exact command line and job launcher output alongside these files.

3. Verify MTU matches fabric:
   ```bash
   # Set to 2048 or 4096 for HDR
   ip link set dev <iface> mtu 2048
   ```

### Progress thread starvation

**Symptom**: Communication stalls under high CPU load

**Solutions**:

1. Pin progress threads to dedicated cores:

   ```c
   #include <gasnetex.h>
   gasnet_set_progress_thread_affinity(core_id);
   ```

2. Use automatic progress:

   ```bash
   export GASNET_AUTOPROGRESS=1
   ```

3. Increase progress polling frequency:
   ```bash
   export GASNET_POLLFreq=1000
   ```

## Environment-specific issues

### Cray XC systems

**Symptom**: `GASNet_ERR_PMI` on Cray

**Solution**:

```bash
# Use Cray's PMI
module load cray-pmi
export GASNET_BOOTSTRAP=pmi
```

### Slurm clusters

**Symptom**: Inconsistent node counts

**Validation script**:

```bash
#!/bin/bash
echo "SLURM nodes: $SLURM_JOB_NUM_NODES"
echo "GASNet nodes: ${GASNET_PSHM_NODES:-unset}"
srun -n $SLURM_JOB_NUM_NODES hostname | sort
```

### Container environments

**Symptom**: `RDMA device not found` in containers

**Fixes**:

1. Pass through RDMA devices:

   ```bash
   docker run --device=/dev/infiniband/uverbs0 ...
   ```

2. Mount required sysfs:

   ```bash
   docker run -v /sys/class/infiniband:/sys/class/infiniband ...
   ```

3. Use RDMA-aware orchestrator (Singularity, Apptainer):
   ```bash
   singularity exec --rocm container.sif ./app
   ```

## Getting help

When reporting issues, include:

1. **Environment**: OS, kernel, compiler versions
2. **Transport**: Which GASNet conduit and version
3. **Reproducer**: Minimal test case showing the failure
4. **Logs**: Output with `GASNET_VERBOSE=1` and `GASNET_BACKTRACE=1`

Useful debugging commands:

```bash
# Full environment dump
env | grep -i gasnet > gasnet_env.log

# Capture configuration
./config.log > gasnet_config.log 2>&1

# Trace library calls
LD_DEBUG=libs,symbols ./app 2>&1 | tee gasnet_trace.log
```
