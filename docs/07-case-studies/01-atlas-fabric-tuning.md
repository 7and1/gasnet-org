---
title: Atlas-4096 Fabric Tuning
description: Reducing active message tail latency on a 4K-node HDR fabric.
slug: /case-studies/atlas-fabric-tuning
tags: [case-study, benchmarks, tuning]
related:
  - /docs/benchmarks/microbenchmarks
  - /docs/benchmarks/topology-notes
sidebar_position: 1
---

import CaseStudyCharts from '@site/src/components/charts/CaseStudyCharts';

This case study documents a tuning cycle for an HDR 200 fabric connecting 4,096
nodes. The objective was to reduce active message tail latency while preserving
bandwidth at larger message sizes.

## Baseline context

- **Cluster**: Atlas-4096
- **Fabric**: HDR 200, fat-tree topology
- **Runtime**: GASNet-style active message layer with RDMA transport
- **Pain point**: p95 latency spikes on small messages during mixed workloads

## Observed behavior

- p50 latency stayed within budget but p95 exceeded the SLA.
- Bandwidth hit a plateau later than expected, indicating coalescing pressure.
- CPU utilization on progress threads peaked at 78% under fan-out collectives.

## Interventions

1. Adjusted CQ polling cadence to reduce bursty completion processing.
2. Tuned active message coalescing thresholds to reduce head-of-line blocking.
3. Pinned progress threads to a dedicated NUMA region.

## Results (dataset-backed)

<CaseStudyCharts />

The dataset above is stored under `static/data/benchmarks/atlas-4096.json` and
can be updated as new runs are produced.

## Decision log

- **Accepted**: Dedicated progress cores (reduced p95 jitter).
- **Accepted**: Smaller coalescing window for latency-sensitive queues.
- **Deferred**: NIC firmware tuning (needs vendor support).

## Next measurement

Validate mixed GPU workloads to confirm the p95 gains persist under accelerator
traffic.
