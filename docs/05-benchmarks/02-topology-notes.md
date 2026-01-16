---
title: Topology Notes
description: Understand how network layout changes benchmark behavior.
slug: /benchmarks/topology-notes
tags: [benchmarks, topology]
related:
  - /docs/architecture/transport-layers
  - /docs/benchmarks/microbenchmarks
sidebar_position: 2
---

Topology dictates congestion behavior. Record how your fabric is wired.

## Example topology factors

- Fat-tree vs. dragonfly
- Shared rails or multi-rail routing
- Rack-level oversubscription ratios

## Diagnostic hints

- Compare intra-rack vs. inter-rack latency deltas.
- Check whether collective performance aligns with topology expectations.
- Note any hop-count or routing asymmetry.

## Compare datasets

When multiple fabrics are available, overlay their latency and bandwidth curves
in the benchmark comparison to highlight topology-driven shifts.
