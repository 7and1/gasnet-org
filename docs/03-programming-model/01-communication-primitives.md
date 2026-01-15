---
title: Communication Primitives
description: Core GASNet primitives and how they map to latency budgets.
slug: /programming-model/communication-primitives
sidebar_position: 1
---

GASNet-style runtimes generally expose two classes of primitives: remote memory
access and active messages.

## Remote memory access

- **Put**: one-sided write into a remote address space
- **Get**: one-sided read from a remote address space

Focus on these metrics:

- Initiation cost vs. completion latency
- Ordering guarantees
- Alignment and registration penalties

## Active messages

Active messages combine data movement with a handler invocation on the target
node. They are valuable for control-plane and fine-grained coordination.

Key observations to document:

- Handler queue depth
- Handler execution time
- Progress mode (polling vs. interrupts)
