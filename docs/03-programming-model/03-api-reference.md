---
title: API Reference
description: Core GASNet functions, data types, error codes, and usage examples.
slug: /programming-model/api-reference
tags: [programming-model, api]
related:
  - /docs/programming-model/communication-primitives
  - /docs/interop/language-bindings
sidebar_position: 3
---

import APIReference from '@site/src/components/APIReference';

This reference covers the core GASNet-EX API functions used in PGAS runtime development.
Use it as a quick lookup for signatures, parameters, and expected behavior.

## Initialization and termination

<APIReference
name="gasnet_init"
signature="int gasnet_init(int \*argc, char \*\*\*argv);"
description="Initialize the GASNet library. Must be called before any other GASNet functions."
params={[
{name: 'argc', description: 'Pointer to argument count (typically from main).'},
{name: 'argv', description: 'Pointer to argument vector (typically from main).'},
]}
returns="GASNET_OK on success, error code on failure."
/>

<APIReference
name="gasnet_attach"
signature="int gasnet_attach(gasnet_handlerentry_t \*table, int nentries, size_t segsize, uintptr_t minaddr);"
description="Attach to the GASNet network and allocate the shared segment."
params={[
{name: 'table', description: 'Handler entry table (can be NULL if nentries == 0).'},
{name: 'nentries', description: 'Number of handlers in table.'},
{name: 'segsize', description: 'Requested shared segment size (0 for default).'},
{name: 'minaddr', description: 'Minimum address for segment placement.'},
]}
returns="GASNET_OK on success."
/>

<APIReference
name="gasnet_exit"
signature="void gasnet_exit(int exitcode) **attribute** ((noreturn));"
description="Terminate the GASNet application and exit all nodes."
params={[{name: 'exitcode', description: 'Process exit code to broadcast.'}]}
returns="Does not return."
/>

## Node information

<APIReference
  name="gasnet_mynode"
  signature="int gasnet_mynode(void);"
  description="Return the calling node's ID."
  returns="Node ID in the range [0, gasnet_nodes() - 1]."
/>

<APIReference
  name="gasnet_nodes"
  signature="int gasnet_nodes(void);"
  description="Return the total number of nodes in the job."
  returns="Total node count."
/>

## Remote memory access (RMA)

<APIReference
name="gasnet_put"
signature="void gasnet_put(gasnet_node_t node, void *dst, void *src, size_t nbytes);"
description="One-sided put operation. Copies nbytes from local src to remote dst on node."
params={[
{name: 'node', description: 'Target node ID.'},
{name: 'dst', description: 'Destination address on remote node.'},
{name: 'src', description: 'Source address on local node.'},
{name: 'nbytes', description: 'Number of bytes to transfer.'},
]}
returns="Non-blocking initiation with local completion on return."
/>

<APIReference
name="gasnet_get"
signature="void gasnet_get(void *dst, gasnet_node_t node, void *src, size_t nbytes);"
description="One-sided get operation. Copies nbytes from remote src on node to local dst."
params={[
{name: 'dst', description: 'Destination address on local node.'},
{name: 'node', description: 'Target node ID.'},
{name: 'src', description: 'Source address on remote node.'},
{name: 'nbytes', description: 'Number of bytes to transfer.'},
]}
returns="Blocks until the requested data arrives at dst."
/>

## Error handling

Most GASNet-EX calls return `GASNET_OK` on success. Capture and log error codes alongside
job metadata so failures can be correlated with topology and runtime configuration.
