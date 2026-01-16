---
title: Transport Layers
description: Compare interconnect transports and their runtime implications.
slug: /architecture/transport-layers
tags: [architecture, transport]
related:
  - /docs/architecture/overview
  - /docs/programming-model/communication-primitives
sidebar_position: 2
---

Transport layers dictate latency, throughput, and CPU involvement. Document the
trade-offs explicitly.

## Common transport families

- RDMA-based fabrics (InfiniBand, RoCE)
- Proprietary interconnects (Slingshot, Omni-Path)
- Shared-memory transports within a node

```mermaid
flowchart TB
  App[Application] --> PGAS[PGAS Runtime]
  PGAS --> GASNet[GASNet Layer]
  GASNet --> Transport[Transport Plugin]
  Transport --> RDMA[RDMA / UCX]
  Transport --> OFI[OFI / libfabric]
  Transport --> SHM[Shared Memory]
  RDMA --> NIC[Network Interface]
  OFI --> NIC
  SHM --> CPU[Shared Cache/NUMA]
```

## Evaluation questions

- What is the latency floor for small messages?
- Where does bandwidth saturate?
- How much CPU time does progress require?

## Integration considerations

Map the transport capabilities to runtime features like atomics, collectives,
and active messages to avoid “fast path” surprises.
