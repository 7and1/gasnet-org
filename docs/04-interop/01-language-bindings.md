---
title: Language Bindings
description: How GASNet-style APIs integrate with PGAS and system languages.
slug: /interop/language-bindings
sidebar_position: 1
---

Bindings should surface low-level primitives without hiding critical latency
costs.

## Typical targets

- C/C++ for runtime integration
- Fortran for legacy HPC codes
- Python for orchestration and testing

## Binding design checklist

- Explicit memory registration lifecycle
- Clear separation between blocking and non-blocking calls
- Consistent error and timeout reporting
