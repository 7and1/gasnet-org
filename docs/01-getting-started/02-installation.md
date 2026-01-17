---
title: Environment Baseline
description: Align hardware, OS, and tooling before benchmarking HPC interconnects.
slug: /getting-started/environment-baseline
tags: [getting-started, installation, environment]
related:
  - /docs/getting-started/troubleshooting
  - /docs/benchmarks/microbenchmarks
sidebar_position: 2
---

import { HowToSchema, SEOHead } from '@site/src/components/SEOHead';

<SEOHead
ogType="article"
articleSection="Getting Started"
articlePublishedTime="2026-01-01"
articleModifiedTime="2026-01-16"
articleAuthor="GASNet Team"
keywords={['installation', 'environment setup', 'GASNet installation', 'HPC setup', 'RDMA setup', 'OFED', 'libfabric', 'UCX']}
/>

<HowToSchema howTo={{
  name: 'GASNet Environment Setup Guide',
  description: 'Align hardware, OS, and tooling before benchmarking HPC interconnects. Stabilize the environment so performance data stays reproducible.',
  estimatedTime: '30 minutes',
  steps: [
    {
      name: 'Verify hardware configuration',
      text: 'Check CPU model, NUMA layout, and SMT configuration. Verify NIC model, firmware revision, and PCIe slot topology. Document switch fabric details including topology, oversubscription, and routing.'
    },
    {
      name: 'Check software versions',
      text: 'Record kernel and OFED/driver version. Note compiler and MPI/PGAS runtime versions. Verify frequency governor and turbo/boost policies.'
    },
    {
      name: 'Establish baseline workflow',
      text: 'Lock CPU frequency where possible. Pin processes and threads to explicit cores. Record NIC firmware and driver settings in the lab notebook.'
    },
    {
      name: 'Install on Linux Ubuntu/Debian',
      text: 'Run sudo apt-get install -y build-essential cmake pkg-config libibverbs-dev librdmacm-dev libfabric-dev. Configure GASNet with ./configure --prefix=$HOME/gasnet-install --with-ofi --with-ucx'
    },
    {
      name: 'Install on macOS',
      text: 'Use Homebrew with brew install gasnet. For reproducible benchmarks, disable App Nap and ensure the system is on AC power to avoid frequency throttling.'
    }
  ]
}} />

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

## Linux (Ubuntu/Debian)

Install build essentials and common transports:

```bash
sudo apt-get update
sudo apt-get install -y build-essential cmake pkg-config \
  libibverbs-dev librdmacm-dev libfabric-dev
```

Then configure GASNet with the transport you intend to test:

```bash
./configure --prefix=$HOME/gasnet-install \
  --with-ofi --with-ucx
make -j
make install
```

## Linux (RHEL/Rocky/CentOS)

```bash
sudo dnf groupinstall -y \"Development Tools\"
sudo dnf install -y rdma-core-devel libfabric-devel
```

If your cluster provides vendor OFED, record the exact driver version so you
can reproduce the environment later.

## macOS

```bash
brew install gasnet
```

For reproducible benchmarks, disable App Nap and ensure the system is on AC
power to avoid frequency throttling.

## HPC clusters (modules)

Most centers deliver GASNet and transports as modules:

```bash
module purge
module load gcc/12 openmpi/4.1 ucx/1.15
module load gasnet
```

Capture the module list in your notes:

```bash
module list > gasnet-module-snapshot.txt
```

## Containers

For containerized workflows, prefer Apptainer or Podman with host networking
enabled. Bind-mount device files for RDMA:

```bash
apptainer exec --bind /dev/infiniband gasnet.sif ./microbenchmarks
```

Be explicit about CPU pinning inside the container to avoid noisy results.
