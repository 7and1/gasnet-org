---
title: Microbenchmarks
description: A repeatable latency and bandwidth measurement suite.
slug: /benchmarks/microbenchmarks
sidebar_position: 1
---

Microbenchmarks should isolate a single variable at a time.

## Recommended tests

- **Ping-pong latency** across message sizes
- **Bandwidth sweep** with fixed concurrency
- **Active message throughput** with handler instrumentation

## Reporting template

- Topology: node count, fabric, oversubscription
- Configuration: CPU pinning, interrupt moderation
- Results: median, p95, and p99 latency
