---
title: API Reference
description: Core GASNet functions, data types, error codes, and usage examples.
slug: /programming-model/api-reference
sidebar_position: 3
---

This reference covers the core GASNet-EX API functions used in PGAS runtime development.

## Initialization and termination

### gasnet_init

```c
int gasnet_init(int *argc, char ***argv);
```

Initialize the GASNet library. Must be called before any other GASNet functions.

**Parameters**:

- `argc`: Pointer to argument count (typically from `main()`)
- `argv`: Pointer to argument vector (typically from `main()`)

**Return**: `GASNET_OK` on success, error code on failure

**Example**:

```c
int main(int argc, char **argv) {
    if (gasnet_init(&argc, &argv) != GASNET_OK) {
        fprintf(stderr, "GASNet initialization failed\n");
        return 1;
    }
    // ... rest of application
    gasnet_exit(0);
}
```

### gasnet_attach

```c
int gasnet_attach(gasnet_handlerentry_t *table, int nentries,
                  size_t segsize, uintptr_t minaddr);
```

Attach to the GASNet network and allocate the shared segment.

**Parameters**:

- `table`: Array of handler entries (can be `NULL` if `nentries == 0`)
- `nentries`: Number of handlers in `table`
- `segsize`: Requested size of shared segment (0 for default)
- `minaddr`: Minimum address for segment placement

**Returns**: `GASNET_OK` on success

### gasnet_exit

```c
void gasnet_exit(int exitcode) __attribute__ ((noreturn));
```

Terminate the GASNet application and exit.

## Node information

### gasnet_mynode

```c
int gasnet_mynode(void);
```

**Returns**: The calling node's ID (0 to `gasnet_nodes() - 1`)

### gasnet_nodes

```c
int gasnet_nodes(void);
```

**Returns**: Total number of nodes in the job

**Example**:

```c
int mynode = gasnet_mynode();
int numnodes = gasnet_nodes();

printf("Node %d of %d\n", mynode, numnodes);
```

## Remote memory access (RMA)

### gasnet_put

```c
void gasnet_put(gasnet_node_t node, void *dst, void *src, size_t nbytes);
```

One-sided put operation. Copies `nbytes` from local `src` to remote `dst` on `node`.

**Parameters**:

- `node`: Target node ID
- `dst`: Destination address on remote node
- `src`: Source address on local node
- `nbytes`: Number of bytes to transfer

**Behavior**: Non-blocking initiation, local completion guaranteed on return

### gasnet_get

```c
void gasnet_get(void *dst, gasnet_node_t node, void *src, size_t nbytes);
```

One-sided get operation. Copies `nbytes` from remote `src` on `node` to local `dst`.

**Parameters**:

- `dst`: Destination address on local node
- `node`: Source node ID
- `src`: Source address on remote node
- `nbytes`: Number of bytes to transfer

### gasnet_put_nb

```c
gasnet_handle_t gasnet_put_nb(gasnet_node_t node, void *dst, void *src, size_t nbytes);
```

Non-blocking put with explicit handle.

**Returns**: Handle for subsequent `gasnet_wait_sync()` or `gasnet_try_sync()`

### gasnet_get_nb

```c
gasnet_handle_t gasnet_get_nb(void *dst, gasnet_node_t node, void *src, size_t nbytes);
```

Non-blocking get with explicit handle.

**Example**:

```c
// Non-blocking RMA pattern
gasnet_handle_t handles[4];

// Issue multiple operations
handles[0] = gasnet_put_nb(node1, dst1, src1, size1);
handles[1] = gasnet_get_nb(dst2, node2, src2, size2);
handles[2] = gasnet_put_nb(node3, dst3, src3, size3);
handles[3] = gasnet_get_nb(dst4, node4, src4, size4);

// Wait for all to complete
for (int i = 0; i < 4; i++) {
    gasnet_wait_sync(handles[i]);
}
```

## Synchronization

### gasnet_wait_sync

```c
void gasnet_wait_sync(gasnet_handle_t handle);
```

Block until the operation associated with `handle` completes.

### gasnet_try_sync

```c
int gasnet_try_sync(gasnet_handle_t handle);
```

Test if operation has completed without blocking.

**Returns**: Non-zero if completed, zero otherwise

### gasnet_barrier_notify

```c
void gasnet_barrier_notify(int barrier, int phase);
```

Notify arrival at a barrier.

**Parameters**:

- `barrier`: Barrier identifier (typically 0)
- `phase`: Phase identifier for split-phase barriers

### gasnet_barrier_wait

```c
int gasnet_barrier_wait(int barrier, int phase);
```

Wait for all nodes to arrive at barrier.

**Returns**: Non-zero if this is the "sense" phase

**Example**:

```c
void barrier_example(void) {
    gasnet_barrier_notify(0, 0);
    // Do useful work while other nodes arrive
    gasnet_barrier_wait(0, 0);
}
```

## Active messages

### gasnet_AMRequestShort

```c
int gasnet_AMRequestShort(gasnet_node_t node, gasnet_handler_t handler,
                          int numargs, ...);
```

Send a short active message (data in arguments only).

**Parameters**:

- `node`: Target node
- `handler`: Handler function ID
- `numargs`: Number of 32-bit arguments (0-16)
- `...`: Variable arguments (must be 32-bit values)

**Returns**: `GASNET_OK` on success

### gasnet_AMRequestMedium

```c
int gasnet_AMRequestMedium(gasnet_node_t node, gasnet_handler_t handler,
                           void *src, size_t nbytes,
                           int numargs, ...);
```

Send an active message with a payload buffer.

**Parameters**:

- `node`: Target node
- `handler`: Handler function ID
- `src`: Local source buffer
- `nbytes`: Payload size (implementation-specific limit)
- `numargs`: Number of 32-bit arguments (0-16)

### gasnet_AMReplyShort

```c
int gasnet_AMReplyShort(gasnet_token_t token, gasnet_handler_t handler,
                        int numargs, ...);
```

Send a short reply message from within a handler.

### Handler registration

```c
void my_handler(gasnet_token_t token, void *buf, size_t nbytes,
                gasnet_handlerarg_t arg0, gasnet_handlerarg_t arg1);

// Registration during attach
gasnet_handlerentry_t handlers[] = {
    {HANDLER_MY_REQUEST, my_handler},
    {HANDLER_MY_REPLY, my_reply_handler}
};

gasnet_attach(handlers, sizeof(handlers)/sizeof(handlers[0]),
              segsize, minaddr);
```

## Memory management

### gasnet_seginfo_t

```c
typedef struct {
    void *addr;
    size_t size;
} gasnet_seginfo_t;
```

Structure describing a node's shared segment.

### gasnet_get_seginfo

```c
int gasnet_get_seginfo(gasnet_seginfo_t *seginfo_table, int numnodes);
```

Retrieve segment information for all nodes.

**Example**:

```c
gasnet_seginfo_t *seginfo = malloc(gasnet_nodes() * sizeof(gasnet_seginfo_t));
gasnet_get_seginfo(seginfo, gasnet_nodes());

for (int i = 0; i < gasnet_nodes(); i++) {
    printf("Node %d segment: %p (size %zu)\n",
           i, seginfo[i].addr, seginfo[i].size);
}
```

## Atomic operations

### gasnet_get

```c
void gasnet_get(gasnet_node_t node, void *dst, void *src, size_t nbytes);
```

Atomic get operations are provided through extended API:

```c
// Atomic fetch-and-add
gasnet_atomic_fetch_and_add(node, dst, inc);

// Atomic swap
gasnet_atomic_swap(node, dst, value);
```

## Data types

| Type                  | Description                             |
| --------------------- | --------------------------------------- |
| `gasnet_node_t`       | Node identifier (integer type)          |
| `gasnet_handler_t`    | Handler function identifier             |
| `gasnet_handle_t`     | Operation handle for non-blocking calls |
| `gasnet_token_t`      | Token representing AM context           |
| `gasnet_handlerarg_t` | 32-bit argument type for AM handlers    |

## Error codes

| Code                  | Description                       |
| --------------------- | --------------------------------- |
| `GASNET_OK`           | Operation succeeded               |
| `GASNET_ERR_RESOURCE` | Resource allocation failed        |
| `GASNET_ERR_BAD_ARG`  | Invalid argument                  |
| `GASNET_ERR_NOT_INIT` | GASNet not initialized            |
| `GASNET_ERR_PMI`      | Process manager interface failure |
| `GASNET_ERR_MISC`     | Miscellaneous error               |

## Best practices

1. **Always check return values** on initialization functions
2. **Use non-blocking operations** for overlapping computation and communication
3. **Pin memory regions** before RMA operations when possible
4. **Match handler signatures** exactly to the expected callback type
5. **Avoid large AM payloads**; use RMA for bulk data transfer
