---
title: 什么是 GASNet？
description: 了解 GASNet 生态以及本知识库的组织方式。
slug: /getting-started/intro
tags: [getting-started, overview]
sidebar_position: 1
---

GASNet（Global Address Space Networking）是一个语言无关的网络层，被 PGAS 语言和
运行时系统用于在现代超级计算机上提供低延迟与高吞吐的通信能力。Gasnet.org 将
围绕 GASNet 风格系统的实践经验和研究成果整理为结构化、易检索的知识库。

## 为什么要有这个站点

高性能网络相关知识常常分散在论文、厂商手册和实验室 Wiki 中。Gasnet.org 将这些
内容聚合起来，帮助你：

- 对比不同传输栈及其权衡。
- 记录影响延迟与可扩展性的运行时决策。
- 共享可复现实验的微基准和调优流程。

## 如何导航

- **Getting Started**：术语与评估流程。
- **Architecture**：HPC 互连的数据路径与控制流。
- **Programming Model**：PGAS 语义与通信原语。
- **Interop**：语言绑定、运行时集成与工具链。
- **Benchmarks**：可复现测试与拓扑笔记。

## 贡献研究笔记

当你获得新的结论时，建议记录：

- 背景：平台、互连、拓扑、编译器/运行时版本。
- 测量：方法、预热、采样与方差。
- 结论：原始数据与基于数据做出的决策。

这样可以让知识库同时对实践者和研究者保持可操作性。
