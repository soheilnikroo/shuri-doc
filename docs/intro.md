---
sidebar_position: 1
slug: /
title: Introduction
description: Shuriken CLI - A ninja-inspired, modular CLI framework for organizations
---

# 🥷 Shuriken CLI

> A ninja-inspired, modular CLI framework for organizations to manage and extend their own custom tooling with minimal overhead.

## What is Shuriken CLI?

Shuriken CLI is a **TypeScript-built**, **Inversify-powered**, modular command-line framework designed to help teams build, maintain, and share internal developer tools. Inspired by the precision of ninja tactics, it:

- **Discovers** commands dynamically from your `packages/` folder
- **Loads** only what you invoke (lazy-loading) for lightning-fast startup
- **Scaffolds** new packages via a single helper script
- **Manages** version migrations out of the box
- **Logs** with colorful, fun, timestamped prefixes

## The Problem Every Growing Company Faces

### 🤕 Onboarding Overwhelm

New developers face a maze of:

- **Naming conventions**: kebab-case, PascalCase, or snake_case?
- **Project structure**: Which folders must exist? Where do tests live?
- **Deployment rituals**: Internal CLI? CI/CD pipeline? Terraform script?

### 📚 Documentation Drift

As teams grow, documentation ages:

- Guides reference decommissioned CI steps
- Outdated lint rules cause confusion
- Each project drifts into its own style

### 🔄 Migration Mayhem

Updating shared packages requires:

- Writing migration guides
- Scheduling demo meetings
- Following up on Slack threads
- Hopes and prayers that everyone updates correctly

## How Shuriken Solves This

Shuriken CLI offers a **single source of truth** for:

| Feature               | Description                                      |
| --------------------- | ------------------------------------------------ |
| 🚀 **Setup**          | Quickly scaffold new projects or packages        |
| 🔄 **Update/Migrate** | Automatically apply versioned migrations         |
| 🛠️ **Custom Actions** | Script any repeated task with type-safe commands |

### Single Interface

```bash
# Run any package command
shuriken <package-name> <command> [--options]

# List all packages and commands
shuriken help

# Examples
shuriken ui-kit setup
shuriken jarvis component Button
shuriken backend-tools migrate --version 2.1.0
```

## Key Benefits

✅ **Modular Architecture** - Place any number of packages under `packages/`—Shuriken auto-discovers them  
✅ **Lazy Command Loading** - Only the commands you call are loaded into memory  
✅ **Built‑in Setup & Update** - Core `setup` and `update` commands for installing and migrating  
✅ **Scaffolding Helper** - `prepare-package` script bootstraps new package templates  
✅ **Custom Commands** - Define additional commands per package  
✅ **Configurable Logging** - Ninja‑themed logs with color, timestamps, and fun prefixes  
✅ **Pluggable Migrations** - Author migration scripts for version upgrades

## Architecture Overview

```
shuriken
├── packages/           # Your custom packages
│   ├── ui-kit/
│   ├── jarvis/
│   └── backend-tools/
├── src/               # Core CLI engine
├── scripts/           # Helper scripts
└── docs/             # Documentation
```

## Next Steps

Ready to get started? Choose your path:

- 📦 **[Installation](./installation)** - Set up Shuriken CLI
- 🎯 **[Core Concepts](./concepts)** - Understand the architecture
- 🛠️ **[Creating Packages](./creating-packages)** - Build your first package
- 💡 **[Examples](./examples)** - See real-world implementations
