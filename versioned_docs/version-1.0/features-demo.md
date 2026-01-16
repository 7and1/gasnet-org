---
title: Features Demo
description: Validate Mermaid, KaTeX, Chart.js, Search, and Giscus.
slug: /features-demo
sidebar_position: 99
---

import BenchmarkChart from '@site/src/components/charts/BenchmarkChart';

This page validates every interactive feature shipped with the Gasnet.org
ultimate edition.

## 1. Topology Diagram (Mermaid)

```mermaid
graph TD
  A[Compute Node] -->|Active Message| B((Switch))
  B --> C[GPU Node]
  B --> D[Storage Node]
```

## 2. Mathematical Models (KaTeX)

The cost of a broadcast operation in a mesh topology is:

$$T_{bcast} = (\sqrt{P} - 1) \cdot (2L + 2o + mB)$$

Where:

- $P$ is the number of processors
- $L$ is latency
- $B$ is inverse bandwidth

## 3. Interactive Benchmarks (Chart.js)

Hover over the bars to see exact microsecond latency.

<div style={{maxWidth: '600px', margin: '2rem auto'}}>
  <BenchmarkChart />
</div>

## 4. Search & Comments

- **Search:** Use the top-right search box and try typing "Latency".
- **Comments:** Scroll to the bottom of this page to see the Giscus widget.
