---
title: Environment Baseline
description: Align hardware, OS, and tooling before benchmarking HPC interconnects.
slug: /getting-started/environment-baseline
sidebar_position: 2
---

Before you evaluate a GASNet-compatible system, stabilize the environment so
performance data stays reproducible.

## Hardware checklist

- CPU model, NUMA layout, and SMT configuration.
- NIC model, firmware revision, and PCIe slot topology.
- Switch fabric details (topology, oversubscription, routing).

## Software checklist

- Kernel and OFED/driver version.
- Compiler and MPI/PGAS runtime versions.
- Frequency governor and turbo/boost policies.

## Baseline workflow

1. Lock CPU frequency where possible.
2. Pin processes and threads to explicit cores.
3. Record NIC firmware and driver settings in the lab notebook.

When you later compare microbenchmarks, this baseline becomes the “control”.
