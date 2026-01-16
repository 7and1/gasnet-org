---
title: What is GASNet?
description: Understand the GASNet ecosystem and how this knowledge base is organized.
slug: /getting-started/intro
tags: [getting-started, overview]
related:
  - /docs/getting-started/quickstart
  - /docs/architecture/overview
sidebar_position: 1
---

GASNet (Global Address Space Networking) is a language-agnostic networking layer
used by PGAS languages and runtime systems to deliver low-latency, high-throughput
communication on modern supercomputers. Gasnet.org turns the practical and
research context around GASNet-style systems into a structured, search-friendly
knowledge base.

## Why this site exists

High-performance networking knowledge tends to be fragmented across papers,
vendor manuals, and lab wikis. Gasnet.org brings those insights together so you
can:

- Compare transport stacks and their trade-offs.
- Document runtime decisions that impact latency and scalability.
- Share reproducible microbenchmarks and tuning workflows.

## How to navigate

- **Getting Started** explains terminology and the workflow to evaluate a system.
- **Architecture** maps the datapath and control flow in HPC interconnects.
- **Programming Model** covers PGAS semantics and communication primitives.
- **Interop** focuses on language bindings, runtime integration, and tooling.
- **Benchmarks** collects reproducible tests and topology notes.

## Contribute research notes

When you have new findings, capture them with:

- Context: platform, interconnect, topology, compiler/runtime versions.
- Measurement: methodology, warm-up, sampling, and variance.
- Outcome: raw numbers plus the decision you made from them.

This keeps the knowledge base actionable for both practitioners and researchers.
