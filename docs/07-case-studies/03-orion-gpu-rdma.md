---
title: Orion-1024 GPU Direct RDMA Enablement
description: Removing staging overhead to improve bandwidth for accelerator workflows.
slug: /case-studies/orion-gpu-rdma
tags: [case-study, gpu, rdma]
related:
  - /docs/benchmarks/microbenchmarks
  - /docs/programming-model/communication-primitives
  - /docs/interop/language-bindings
sidebar_position: 3
---

import CaseStudyCharts from '@site/src/components/charts/CaseStudyCharts';

Orion-1024 runs accelerator-heavy workloads where GPU buffers dominate the data
path. The initial configuration relied on host staging, creating extra copies
and limiting bandwidth.

## Baseline context

- **Cluster**: Orion-1024
- **Fabric**: Slingshot, fat-tree topology
- **Runtime**: GASNet-style RDMA path with GPU-aware support disabled
- **Pain point**: large-message bandwidth plateau below target

## Observed behavior

- CPU utilization spiked during large transfers due to staging copies.
- Bandwidth plateaued earlier than expected in the 64 KB–1 MB range.
- GPU kernel overlap stalled because RMA operations waited on host buffers.

## Interventions

1. Enabled GPU Direct RDMA support in the transport stack.
2. Introduced pinned staging buffers for control-plane messages only.
3. Registered GPU buffers during job initialization to avoid on-demand costs.

## Results (dataset-backed)

<CaseStudyCharts dataPath="/benchmarks/orion-1024.json" />

Bandwidth improved for large message sizes once GPU buffers were registered
up-front and host staging was avoided.

## Decision log

- **Accepted**: Persistent GPU buffer registration.
- **Accepted**: Separate control-plane staging pool.
- **Deferred**: GPU memory oversubscription tests.

## Next measurement

Validate mixed CPU/GPU traffic to ensure the progress engine does not starve GPU
kernels under heavy load.
