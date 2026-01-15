---
title: Architecture Overview
description: Understand the control-plane and data-plane of GASNet-style runtimes.
slug: /architecture/overview
sidebar_position: 1
---

A GASNet-style runtime decomposes into control and data paths that span both
software and hardware.

## Data plane

- Remote memory access (put/get) operations
- Bulk transfer pipeline (staging, zero-copy, RDMA)
- Completion queues and progress engine

## Control plane

- Endpoint discovery and bootstrap
- Active message dispatch
- Collectives setup and teardown

## Performance risk areas

- NUMA placement mismatches
- Interrupt moderation and CQ polling cadence
- Message coalescing vs. head-of-line blocking
