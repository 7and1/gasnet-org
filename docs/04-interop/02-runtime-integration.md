---
title: Runtime Integration
description: Stitching GASNet layers into schedulers and job launchers.
slug: /interop/runtime-integration
tags: [interop, runtime]
related:
  - /docs/architecture/overview
  - /docs/benchmarks/microbenchmarks
sidebar_position: 2
---

Runtime integration is where production environments diverge from lab
benchmarks. Capture operational reality.

## Integration points

- Job launchers and resource managers
- Container or bare-metal provisioning
- Performance counters and telemetry

## Risk mitigation

- Validate endpoint discovery across multi-rail networks
- Record failure modes under large-scale job starts
- Track fallback paths when preferred transports are unavailable

## Resource managers and bootstrapping

Common schedulers (Slurm, PBS, LSF) provide environment variables you can map
to GASNet bootstrap parameters. Capture:

- Node list and allocation size
- Per-node core counts and NUMA layout
- PMI/PMIx versions if the launcher relies on them

If your launcher uses PMI, ensure the GASNet bootstrap path is compatible with
the PMI API version exposed by the system.

## MPI and PGAS coexistence

When GASNet is embedded inside an MPI application:

- Decide whether MPI or GASNet owns process spawning.
- Avoid double-initializing network transports (UCX/OFI).
- Coordinate progress engines to prevent oversubscription.

For OpenMP or hybrid runtimes, pin GASNet progress threads away from compute
threads to avoid contention.

## Observability

Integrate performance counters early:

- Export latency histograms and queue depth metrics.
- Capture NIC counters (drops, retransmits, CQ overruns).
- Emit structured logs for transport negotiation failures.

Tie telemetry to the same dataset metadata used in benchmarks so results stay
comparable.
