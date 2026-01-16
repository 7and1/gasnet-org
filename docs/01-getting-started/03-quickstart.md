---
title: Quickstart Workflow
description: A short checklist to launch an HPC networking investigation.
slug: /getting-started/quickstart
tags: [getting-started, workflow]
related:
  - /docs/benchmarks/microbenchmarks
  - /docs/programming-model/communication-primitives
sidebar_position: 3
---

This workflow helps you get actionable results within the first day.

## 1. Identify the critical path

Pick a communication pattern that is gating your application:

- Put/get latency
- Collective fan-out time
- GPU direct access or staging overhead

## 2. Instrument the runtime

Capture:

- Message size distribution
- Queue depth or credit usage
- Completion latency and tail percentiles

## 3. Run a microbenchmark suite

Start with a low-noise test harness, then scale:

- Single node, then single rack
- Homogeneous nodes, then mixed CPU/GPU pools

## 4. Summarize the first findings

Write down the system decision you can make immediately. If you cannot decide
anything yet, identify the next measurement that will unblock you.
