---
title: Collectives and Synchronization
description: Strategies for barriers, broadcasts, and reductions.
slug: /programming-model/collectives
tags: [programming-model, collectives]
related:
  - /docs/benchmarks/topology-notes
  - /docs/architecture/overview
sidebar_position: 2
---

import CodeTabs from '@site/src/components/CodeTabs';

Collectives are often the throughput bottleneck at scale. Document both the
algorithm and the topology it targets.

## Common patterns

- Tree-based broadcast
- Ring-based allreduce
- Dissemination barriers

### Broadcast examples

<CodeTabs
title="Broadcast across bindings"
c={`gasnet_coll_broadcast(team, dest, root, src, nbytes, flags);`}
python={`gasnet.collectives.broadcast(team, dest, root, src, nbytes)`}
rust={`gasnet::collectives::broadcast(team, dest, root, src, nbytes);`}
/>

## Scaling questions

- How does performance change with placement across racks?
- Where does congestion or oversubscription appear?
- Which topology assumptions are baked into the algorithm?
