---
title: Collectives and Synchronization
description: Strategies for barriers, broadcasts, and reductions.
slug: /programming-model/collectives
sidebar_position: 2
---

Collectives are often the throughput bottleneck at scale. Document both the
algorithm and the topology it targets.

## Common patterns

- Tree-based broadcast
- Ring-based allreduce
- Dissemination barriers

## Scaling questions

- How does performance change with placement across racks?
- Where does congestion or oversubscription appear?
- Which topology assumptions are baked into the algorithm?
