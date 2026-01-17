---
title: Zephyr-512 OFI TCP Fallback Stabilization
description: Trading bandwidth for reliability when RDMA fabrics are unstable.
slug: /case-studies/zephyr-tcp-fallback
tags: [case-study, reliability, ofi]
related:
  - /docs/interop/runtime-integration
  - /docs/getting-started/troubleshooting
  - /docs/benchmarks/microbenchmarks
sidebar_position: 4
---

import CaseStudyCharts from '@site/src/components/charts/CaseStudyCharts';
import { CaseStudySchema, SEOHead } from '@site/src/components/SEOHead';

<SEOHead
ogType="article"
articleSection="Case Studies"
articlePublishedTime="2026-01-01"
articleModifiedTime="2026-01-16"
articleAuthor="GASNet Team"
keywords={['case study', 'OFI', 'Libfabric', 'TCP fallback', 'reliability', 'transport failure', 'RDMA', 'Ethernet']}
/>

<CaseStudySchema caseStudy={{
  name: 'Zephyr-512 OFI TCP Fallback Stabilization',
  description: 'Trading bandwidth for reliability when RDMA fabrics are unstable. Zephyr-512 faced intermittent RDMA transport failures during peak usage. The team opted to validate a TCP fallback path to keep workflows running while hardware diagnostics were underway.',
  about: 'HPC Transport Reliability',
  datePublished: '2026-01-01',
  dateModified: '2026-01-16'
}} />

Zephyr-512 faced intermittent RDMA transport failures during peak usage. The
team opted to validate a TCP fallback path to keep workflows running while
hardware diagnostics were underway.

## Baseline context

- **Cluster**: Zephyr-512
- **Fabric**: OFI TCP over leaf-spine Ethernet
- **Runtime**: GASNet-style OFI transport in TCP mode
- **Pain point**: RDMA transport instability during queue bursts

## Observed behavior

- RDMA queue overruns triggered job failures.
- TCP fallback kept jobs alive but reduced bandwidth.
- Latency tails widened under concurrent flows.

## Interventions

1. Forced OFI provider selection to TCP for stability.
2. Lowered message injection rate to avoid queue bursts.
3. Added runtime health checks to detect RDMA recovery.

## Results (dataset-backed)

<CaseStudyCharts dataPath="/benchmarks/zephyr-512.json" />

TCP throughput was lower, but the runtime avoided critical transport failures
and stabilized job completion.

## Decision log

- **Accepted**: Temporary TCP fallback with explicit bandwidth expectations.
- **Accepted**: Health checks before re-enabling RDMA.
- **Deferred**: Switch firmware upgrades pending maintenance window.

## Follow-up work

Re-test RDMA once firmware updates are applied and compare against the TCP
baseline to quantify the recovery.
