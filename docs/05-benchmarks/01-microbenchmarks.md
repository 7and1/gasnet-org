---
title: Microbenchmarks
description: A repeatable latency and bandwidth measurement suite.
slug: /benchmarks/microbenchmarks
tags: [benchmarks, latency]
related:
  - /docs/benchmarks/topology-notes
  - /docs/case-studies/atlas-fabric-tuning
sidebar_position: 1
---

import BenchmarkCompare from '@site/src/components/charts/BenchmarkCompare';

Microbenchmarks should isolate a single variable at a time.

## Recommended tests

- **Ping-pong latency** across message sizes
- **Bandwidth sweep** with fixed concurrency
- **Active message throughput** with handler instrumentation

## Reporting template

- Topology: node count, fabric, oversubscription
- Configuration: CPU pinning, interrupt moderation
- Results: median, p95, and p99 latency

## Interactive comparison

Use the comparison tool to overlay multiple benchmark datasets and switch between
latency percentiles and bandwidth.

<BenchmarkCompare />
