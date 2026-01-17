---
title: Helios-2048 Adaptive Routing Cutover
description: Stabilizing tail latency on a dragonfly fabric through routing and congestion tuning.
slug: /case-studies/helios-routing-cutover
tags: [case-study, routing, congestion]
related:
  - /docs/benchmarks/topology-notes
  - /docs/architecture/transport-layers
  - /docs/programming-model/collectives
sidebar_position: 2
---

import CaseStudyCharts from '@site/src/components/charts/CaseStudyCharts';
import { CaseStudySchema, SEOHead } from '@site/src/components/SEOHead';

<SEOHead
ogType="article"
articleSection="Case Studies"
articlePublishedTime="2026-01-01"
articleModifiedTime="2026-01-16"
articleAuthor="GASNet Team"
keywords={['case study', 'adaptive routing', 'dragonfly', 'congestion control', 'ECN', 'HDR fabric', 'latency tuning', 'collectives']}
/>

<CaseStudySchema caseStudy={{
  name: 'Helios-2048 Adaptive Routing Cutover',
  description: 'Stabilizing tail latency on a 2,048-node HDR 200 dragonfly fabric through routing and congestion tuning. The runtime experienced intermittent p95 latency spikes during all-to-all collectives when multiple teams shared the same global links.',
  about: 'HPC Network Routing',
  datePublished: '2026-01-01',
  dateModified: '2026-01-16'
}} />

Helios-2048 is a 2,048-node system on an HDR 200 dragonfly fabric. The runtime
experienced intermittent p95 latency spikes during all-to-all collectives when
multiple teams shared the same global links.

## Baseline context

- **Cluster**: Helios-2048
- **Fabric**: HDR 200, dragonfly topology
- **Runtime**: GASNet-style collectives with adaptive routing enabled
- **Pain point**: tail latency spikes during synchronized collectives

## Observed behavior

- Queue depth oscillations coincided with global link congestion.
- p95 latency spikes appeared at 64 KB and above under mixed workloads.
- Adaptive routing was enabled but not tuned for congestion epochs.

## Interventions

1. Enabled congestion control telemetry to capture ECN marks per rail.
2. Adjusted adaptive routing thresholds to prefer local groups under pressure.
3. Increased the message coalescing window for large collective payloads.

## Results (dataset-backed)

<CaseStudyCharts dataPath="/benchmarks/helios-2048.json" />

The dataset above is stored under `static/data/benchmarks/helios-2048.json`.
Latency tails tightened once routing bias stayed within each local group while
congestion was detected.

## Decision log

- **Accepted**: Adaptive routing bias toward local groups.
- **Accepted**: Larger collective chunk size to reduce global link pressure.
- **Deferred**: Firmware upgrade pending vendor validation.

## Follow-up work

- Validate improvements with multi-tenant workloads.
- Compare ECN thresholds across rails to confirm stability.
