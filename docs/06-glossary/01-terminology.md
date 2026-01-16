---
title: Terminology
description: Comprehensive glossary of HPC networking, GASNet, and PGAS terminology.
slug: /glossary/terminology
tags: [glossary]
related:
  - /docs/getting-started/intro
sidebar_position: 1
---

Use this glossary to keep documentation consistent across the Gasnet.org knowledge base.

## A

### Active message

A packet that triggers a handler function on the receiving node. Active messages combine data transfer with computation, enabling control-plane operations without separate acknowledgment messages.

### Address translation

The process of mapping local pointers to global addresses in PGAS systems. GASNet provides segments that expose remote memory through a unified address space.

### Aggregate network

A high-level network topology that combines multiple physical networks (e.g., Ethernet for management, InfiniBand for compute) into a single logical fabric.

### Atomic operation

A read-modify-write operation that completes indivisibly. Common atomics include fetch-and-add, compare-and-swap, and atomic increment. GASNet provides atomic operations through its extended API.

### Attached transport

A GASNet conduit that uses an external communication library such as MPI, UCX, or libfabric/OFI rather than implementing the wire protocol directly.

### Asynchronous progress

The ability for communication to advance while application code performs computation. This requires dedicated progress threads or interrupt-driven completion.

## B

### Barrier

A collective synchronization operation where all processes wait until every participant has arrived. GASNet provides both active and passive barrier implementations.

### Bootstrap

The initialization process where nodes discover each other and establish communication endpoints. GASNet supports multiple bootstrap methods including MPI, PMI, and static node lists.

### Broadcast

A collective operation where one node sends data to all other nodes. Efficient broadcast algorithms use tree-based topologies to minimize latency.

### Bulk transfer

Large data movement operations that benefit from pipelined transmission and RDMA. Put and get operations are optimized for bulk transfer.

## C

### Collectives

Communication patterns involving all processes in a job, including barriers, broadcasts, reductions, and all-to-all operations.

### Completion queue (CQ)

A queue that reports completed operations to the host. Completion queues are fundamental to RDMA operations and must be polled to make progress.

### Conduit

The GASNet implementation of a particular transport layer. Examples include `mpi-conduit`, `ucx-conduit`, `ofi-conduit`, and `ibv-conduit`.

### Contributor node

In GASNet Extended API, a node that contributes memory to the shared global address space. Each contributor exposes a segment accessible by all other nodes.

## D

### DCT (Dynamic Connected Transport)

A UCX transport mode that establishes on-demand connections between endpoints, reducing resource usage for sparse communication patterns.

### Dissemination barrier

A barrier algorithm where nodes exchange messages in a logarithmic pattern, reducing contention at the cost of additional message rounds.

### Doorbell

A mechanism for notifying the NIC of new work. In RDMA, posting a work request to a queue pair rings a doorbell.

## E

### Eager protocol

A communication strategy where data is sent immediately without waiting for a request. Used for small messages where the overhead of RDMA setup exceeds the data transfer cost.

### Endpoint

A communication handle that represents a single node's connection to the network fabric. Endpoints encapsulate queues, completion handlers, and transport state.

### Explicit vs. implicit progress

Explicit progress requires the application to call progress functions; implicit progress happens automatically via threads or interrupts.

## F

### Fabric

The physical and logical network interconnect. Common fabrics include InfiniBand, Omni-Path, RoCE, and Slingshot.

### Fan-in / Fan-out

Communication patterns where data flows from many nodes to one (fan-in) or from one node to many (fan-out). These patterns are common in reduction and broadcast operations.

### FIFO (First In, First Out)

A queue ordering guarantee. Some GASNet operations preserve FIFO ordering for messages between the same source-destination pair.

## G

### GASNet (Global Address Space Networking)

A language-independent, low-level networking layer designed for PGAS languages and runtime systems.

### GASNet-EX

The extended API version of GASNet that includes additional features like dynamic memory registration, extended references, and advanced atomics.

### Gather

A collective operation where data from multiple nodes is collected onto a single node.

### Global address space

A memory model where any node can directly address memory on any other node using pointers, abstracting away explicit send/receive operations.

## H

### Handler

A callback function executed when an active message arrives. Handlers must be non-blocking and typically perform minimal work before deferring to worker threads.

### Host channel adapter (HCA)

The hardware component that connects a host system to an InfiniBand fabric. Modern HCAs are often called RDMA NICs (RNICs).

### Hybrid transport

A configuration using multiple transports simultaneously, such as shared-memory for intra-node communication and RDMA for inter-node.

## I

### Immediate data

Small amounts of data sent alongside the request message without requiring a separate RDMA operation. Most fabrics support 0-32 bytes of immediate data.

### InfiniBand

A high-performance, low-latency interconnect standard supporting RDMA. Common implementations include Mellanox ConnectX and HDR adapters.

### Initiator

The node that originates a communication operation. In one-sided operations, only the initiator needs to issue explicit calls.

### Inter-node vs. intra-node

Inter-node refers to communication between different physical nodes; intra-node refers to communication between processes on the same node, typically using shared memory.

## L

### LCI (Livermore Communications Interface)

A lightweight communication library designed for HPC workloads, used as an alternative transport in some GASNet configurations.

### Local vs. remote completion

Local completion means the source buffer can be reused; remote completion means the data has been delivered to the destination. RMA operations typically guarantee only local completion.

### Lock coupling

A synchronization technique where locks are acquired and released in a structured sequence to avoid deadlock.

### Loopback

A communication path where a node sends messages to itself, typically handled via optimized shared-memory paths.

## M

### Memory registration

The process of pinning physical memory and creating translation tables so the NIC can access it without CPU intervention. Registration has overhead and should be amortized over multiple operations.

### Message coalescing

Combining multiple small messages into a single larger message to reduce per-message overhead.

### MPI (Message Passing Interface)

A standard for parallel communication. GASNet can use MPI as a transport, though native transports typically offer lower latency.

### Multirail

A configuration using multiple physical network connections per node to increase bandwidth and redundancy.

## N

### NUMA (Non-Uniform Memory Access)

A memory architecture where access latency depends on the relative location of the accessing CPU and the memory. Proper NUMA placement is critical for performance.

### Node

A compute resource in a parallel job, typically corresponding to a single OS process. GASNet jobs consist of multiple nodes.

### Non-blocking

An operation that initiates communication and returns immediately, requiring a separate wait or test for completion.

### Notification

A signal that an operation has completed. Notifications can be delivered via polling, interrupts, or explicit completion checks.

## O

### OFI (libfabric)

A networking API that provides a uniform interface to various RDMA fabrics. Used by GASNet's `ofi-conduit`.

### One-sided communication

Operations where only the initiating node is involved in the call. Put and get operations are one-sided; the target node does not need to execute matching code.

### One-way vs. two-way latency

One-way latency measures the time for data to travel from source to destination. Two-way (ping-pong) latency includes the round-trip time and is easier to measure.

### Oversubscription

When more processes or traffic are contending for network resources than the fabric can support, leading to congestion and performance degradation.

## P

### PGAS (Partitioned Global Address Space)

A parallel programming model that combines the convenience of shared memory with the performance of message passing. Examples include UPC, Coarray Fortran, and Chapel.

### PMI (Process Management Interface)

A standard for parallel job startup and environment queries. Used by GASNet for bootstrapping on systems like Slurm and Cray.

### Polling vs. interrupts

Polling repeatedly checks for completion in a tight loop; interrupts allow the CPU to sleep until notified. Polling has lower latency at higher CPU cost.

### Progress engine

The runtime component responsible for advancing communication. The progress engine may run in dedicated threads or be embedded in application calls.

### PSN (Packet Sequence Number)

A counter used to track and order packets, essential for reliable delivery over unreliable transports.

## Q

### Queue pair (QP)

In RDMA, a pair of work queues (send and receive) that form a logical connection between two endpoints.

### QP (Queue Pair) state

RDMA queue pairs transition through states (RESET, INIT, RTR, RTS) during connection establishment.

## R

### RDMA (Remote Direct Memory Access)

Network hardware that allows a node to read or write another node's memory without involving the remote CPU.

### Rendezvous protocol

A communication strategy for large messages where the receiver first sends a request for data, then the sender transfers directly to the destination buffer via RDMA.

### RMA (Remote Memory Access)

Operations that access memory on a remote node, including put, get, and atomic operations.

### ROCE (RDMA over Converged Ethernet)

RDMA implemented over standard Ethernet networks rather than specialized InfiniBand fabric.

### RPC (Remote Procedure Call)

A pattern where a function is executed on a remote node, with active messages often used to implement RPCs in GASNet applications.

## S

### Scatter

A collective operation where data from a single node is distributed to multiple nodes.

### Segment

A contiguous region of memory exposed by a node for remote access. GASNet segments form the basis of the global address space.

### Serialization

Converting data structures into a byte stream for transmission. GASNet typically avoids serialization for simple types but may require it for complex structures.

### Shared memory transport

An optimized communication path for processes on the same node, bypassing the NIC entirely.

### Shared vs. exclusive access

Access modes where multiple nodes (shared) or only one node (exclusive) may modify a region.

### Slingshot

A high-performance interconnect developed by HPE/Cray, featuring adaptive routing and congestion control.

### SPMD (Single Program, Multiple Data)

A parallel programming model where all nodes execute the same program but operate on different data.

### Synchronization

Operations that coordinate execution across nodes, including locks, barriers, and fences.

## T

### Tail latency

The worst-case (e.g., p95, p99) latency, often more important than mean latency for interactive or tightly-coupled applications.

### Target

The node receiving a one-sided operation. In GASNet put/get, the target is not involved in the operation call.

### Transport

The underlying communication layer, which may be hardware-specific (like ibv) or a portable library (like MPI or UCX).

### Tree-based algorithm

A communication pattern that uses a tree topology for collectives, reducing the number of rounds from O(n) to O(log n).

## U

### UCX (Unified Communication X)

A high-performance communication framework from Mellanox that provides a unified API to various transports. Used by GASNet's `ucx-conduit`.

### Unexpected message

A message that arrives before its matching receive operation has been posted. Some GASNet configurations buffer unexpected messages.

### Unexpended handler

A registered handler that has not yet been invoked. Handler tables are registered during gasnet_attach().

## V

### Victim

In GASNet auxiliary API, the target of a passive put operation (different from standard one-sided puts).

### Virtual address (VA)

The memory address as seen by the application. RDMA operations can work with either physical or virtual addresses, depending on configuration.

## W

### Work queue (WQ)

A queue where the host posts work requests to the NIC. Send and receive queues are types of work queues.

### Work request (WR)

A descriptor for a single operation to be performed by the NIC, including pointers, sizes, and completion flags.

### Wire protocol

The actual on-the-wire format of messages. Different GASNet conduits may use different wire protocols over the same physical fabric.

## Z

### Zero-copy

Data transfer without intermediate CPU-side buffering, achieved through RDMA or shared memory. Zero-copy operations are essential for high throughput.

### Zero-length message

A message with no payload, used solely for synchronization or signaling.
