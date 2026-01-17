---
title: Architecture Overview
description: Understand the control-plane and data-plane of GASNet-style runtimes.
slug: /architecture/overview
tags: [architecture, overview]
related:
  - /docs/architecture/transport-layers
  - /docs/benchmarks/topology-notes
sidebar_position: 1
---

import { BreadcrumbSchema, SEOHead } from '@site/src/components/SEOHead';

<SEOHead
ogType="article"
articleSection="Architecture"
articlePublishedTime="2026-01-01"
articleModifiedTime="2026-01-16"
articleAuthor="GASNet Team"
keywords={['GASNet architecture', 'HPC architecture', 'data plane', 'control plane', 'RDMA', 'active messages', 'PGAS runtime', 'network architecture', 'InfiniBand']}
/>

<BreadcrumbSchema breadcrumbs={[
{ name: 'Home', url: '/' },
{ name: 'Docs', url: '/docs/' },
{ name: 'Architecture', url: '/docs/architecture/' },
{ name: 'Architecture Overview', url: '/docs/architecture/overview' }
]} />

A GASNet-style runtime decomposes into control and data paths that span both
software and hardware.

```mermaid
flowchart LR
  App[Application] --> Runtime[GASNet Runtime]
  subgraph Control Plane
    Boot[Bootstrap & Discovery] --> AM[Active Message Dispatch]
    AM --> Coll[Collectives Setup]
  end
  subgraph Data Plane
    PutGet[Put/Get RMA] --> RDMA[RDMA/NIC]
    Bulk[Bulk Transfer] --> RDMA
  end
  Runtime --> PutGet
  Runtime --> Bulk
  Runtime --> AM
```

## Data plane

- Remote memory access (put/get) operations
- Bulk transfer pipeline (staging, zero-copy, RDMA)
- Completion queues and progress engine

## Control plane

- Endpoint discovery and bootstrap
- Active message dispatch
- Collectives setup and teardown

## Performance risk areas

- NUMA placement mismatches
- Interrupt moderation and CQ polling cadence
- Message coalescing vs. head-of-line blocking
