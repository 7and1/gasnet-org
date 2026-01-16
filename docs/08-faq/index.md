---
title: Frequently Asked Questions
description: Common questions about GASNet-style runtimes, setup, and performance.
slug: /faq
tags: [faq, getting-started]
---

# Frequently Asked Questions

## Installation

<details>
<summary>How do I install GASNet on macOS?</summary>

```bash
brew install gasnet
```

If you need a specific transport, compile from source with `GASNET_CONDUIT` set
and verify your compiler toolchain with `cc --version`.

</details>

<details>
<summary>What are the minimum system requirements?</summary>

- Linux kernel 4.x+ or macOS 12+
- GCC 9+ or Clang 11+
- 4 GB RAM minimum (16 GB recommended for development)
- InfiniBand or Ethernet fabric for benchmarking

</details>

## Performance

<details>
<summary>Why is my latency higher than published benchmarks?</summary>

Double-check the following variables:

1. CPU pinning and NUMA binding
2. Firmware versions for NICs and switches
3. MPI job launcher oversubscription
4. Interrupt moderation and offload settings

Run the microbenchmark suite with a single variable changed at a time.

</details>

<details>
<summary>How should I report benchmark results?</summary>

Include topology, node count, fabric, and software versions. Share p50 and p95
latency along with bandwidth curves. See the reporting checklist in the
Microbenchmarks page.

</details>

## Troubleshooting

<details>
<summary>Where should I look when active messages stall?</summary>

Check handler queue depth, confirm progress engine configuration, and verify
that the network interrupt model matches your runtime expectations. In many
clusters, switching from polling to interrupts is the fastest win.

</details>
