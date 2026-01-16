---
title: Language Bindings
description: How GASNet-style APIs integrate with PGAS and system languages.
slug: /interop/language-bindings
tags: [interop, bindings]
related:
  - /docs/programming-model/api-reference
  - /docs/interop/runtime-integration
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

## C and C++

The C surface is the ground truth for most runtimes. Keep the API minimal and
avoid hidden allocation:

- Expose segment registration and teardown explicitly.
- Return handles for non-blocking operations so callers can control overlap.
- Provide structured error codes instead of exceptions for fast paths.

For C++, wrap the C handles with RAII types but keep the underlying calls
transparent so latency expectations remain clear.

## Fortran

Use `iso_c_binding` for interoperability and ensure array descriptors are
translated into contiguous buffers before invoking one-sided operations.

Checklist:

- Provide helper wrappers for common column-major layouts.
- Document alignment requirements and padding rules.

## Python

Python bindings are best suited for orchestration and validation.

- Use CFFI or CPython extensions to avoid double copies.
- Expose asynchronous handles so users can interleave compute.
- Guard against the GIL when invoking callbacks for active messages.

## Rust

Rust wrappers should model unsafe regions explicitly:

- Represent registered buffers with lifetime-bound types.
- Mark non-blocking operations as `unsafe` if they outlive borrowed data.
- Mirror error enums so failures map cleanly into logs and telemetry.

## Testing matrix

| Language | Validate                     | Recommended tools   |
| -------- | ---------------------------- | ------------------- |
| C/C++    | ABI stability, error codes   | ctest, sanitizers   |
| Fortran  | Array layout, alignment      | ifx/ifort tests     |
| Python   | GIL safety, buffer ownership | pytest + mypy       |
| Rust     | Lifetime safety, FFI layout  | cargo test + clippy |
