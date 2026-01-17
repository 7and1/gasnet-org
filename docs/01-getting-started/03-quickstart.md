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

import { HowToSchema, SEOHead } from '@site/src/components/SEOHead';

<SEOHead
ogType="article"
articleSection="Getting Started"
articlePublishedTime="2026-01-01"
articleModifiedTime="2026-01-16"
articleAuthor="GASNet Team"
keywords={['quickstart', 'HPC workflow', 'performance tuning', 'GASNet tutorial', 'PGAS', 'networking setup']}
/>

<HowToSchema howTo={{
  name: 'HPC Networking Investigation Quickstart',
  description: 'A short checklist to launch an HPC networking investigation and get actionable results within the first day.',
  estimatedTime: '1 day',
  steps: [
    {
      name: 'Identify the critical path',
      text: 'Pick a communication pattern that is gating your application: put/get latency, collective fan-out time, or GPU direct access or staging overhead.'
    },
    {
      name: 'Instrument the runtime',
      text: 'Capture message size distribution, queue depth or credit usage, and completion latency and tail percentiles.'
    },
    {
      name: 'Run a microbenchmark suite',
      text: 'Start with a low-noise test harness, then scale from single node to single rack, and homogeneous nodes to mixed CPU/GPU pools.'
    },
    {
      name: 'Summarize the first findings',
      text: 'Write down the system decision you can make immediately. If you cannot decide anything yet, identify the next measurement that will unblock you.'
    }
  ]
}} />

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
