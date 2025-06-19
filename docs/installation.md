---
sidebar_position: 2
title: Installation
description: Get started with Shuriken CLI in minutes
---

# 📦 Installation

Get Shuriken CLI up and running in minutes with this step-by-step guide.

## Prerequisites

Before installing Shuriken CLI, make sure you have:

- **Node.js v16+** (we recommend the latest LTS version)
- **Package Manager**: npm, yarn, or pnpm
- **Git** for version control

### Check Your Environment

```bash
# Check Node.js version
node --version
# Should output v16.0.0 or higher

# Check npm version
npm --version

# Check git version
git --version
```

## Installation Methods

### Method 1: Clone and Build

This is the recommended approach for organizations wanting to customize Shuriken.

```bash
# Clone the repository
git clone https://github.com/your-org/shuriken-cli.git
cd shuriken-cli

# Install dependencies
pnpm install
# or: npm install / yarn install

# Build the project
pnpm build
# or: npm run build / yarn build

# Link globally for development
pnpm link --global
# or: npm link / yarn link

# Verify installation
shuriken --version
```

### Method 2: NPM Package (If Published)

```bash
# Install globally
npm install -g @your-org/shuriken-cli

# Or install locally in your project
npm install --save-dev @your-org/shuriken-cli
```

### Method 3: Development Setup

For contributors and advanced users:

```bash
# Clone with development dependencies
git clone https://github.com/your-org/shuriken-cli.git
cd shuriken-cli

# Install all dependencies
pnpm install

# Start in development mode
pnpm dev

# Run tests
pnpm test

# Run linter
pnpm lint
```

## Verification

After installation, verify everything works:

```bash
# Check version
shuriken --version

# List available packages
shuriken help

# Test a basic command
shuriken help
```

Expected output:

```
🥷 SHURIKEN CLI — Available Packages

── UI-KIT ─────────────────────
  setup       Install and configure UI components
  update      Migrate UI components to newer versions

── JARVIS ─────────────────────
  setup       Install and configure AI tools
  component   Generate a React component template

Type 'shuriken <package> <command>' to run a command
```

## Configuration

Shuriken CLI uses a configuration file located at `~/.shuriken/config.json`:

```json
{
  "packagesPath": "./packages",
  "registryPath": "~/.shuriken/registry.json",
  "logLevel": "info",
  "loggerOptions": {
    "useColors": true,
    "useFunPrefixes": true,
    "timestamps": true
  }
}
```

### Configuration Options

| Option                         | Type    | Default                       | Description                                      |
| ------------------------------ | ------- | ----------------------------- | ------------------------------------------------ |
| `packagesPath`                 | string  | `"./packages"`                | Path to packages directory                       |
| `registryPath`                 | string  | `"~/.shuriken/registry.json"` | Path to package registry                         |
| `logLevel`                     | string  | `"info"`                      | Logging level (`debug`, `info`, `warn`, `error`) |
| `loggerOptions.useColors`      | boolean | `true`                        | Enable colored output                            |
| `loggerOptions.useFunPrefixes` | boolean | `true`                        | Enable ninja-themed prefixes                     |
| `loggerOptions.timestamps`     | boolean | `true`                        | Show timestamps in logs                          |

## Directory Structure After Installation

After installation, your project structure should look like:

```
your-project/
├── packages/                 # Auto-created packages directory
│   └── .gitkeep
├── node_modules/
├── package.json
└── .shuriken/               # Configuration directory
    ├── config.json
    └── registry.json
```

## Environment Variables

Shuriken CLI respects these environment variables:

```bash
# Override default packages path
export SHURIKEN_PACKAGES_PATH="/custom/path/to/packages"

# Set log level
export SHURIKEN_LOG_LEVEL="debug"

# Disable colors
export SHURIKEN_NO_COLOR="true"

# Custom registry path
export SHURIKEN_REGISTRY_PATH="/custom/registry.json"
```

## Troubleshooting Installation

### Common Issues

#### Permission Errors

```bash
# If you get permission errors with npm link
sudo npm link

# Or use a Node version manager like nvm
nvm use node
npm link
```

#### Path Issues

```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
export PATH="$PATH:$(npm bin -g)"

# Reload your shell
source ~/.bashrc  # or ~/.zshrc
```

#### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Or with pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm store prune
pnpm install
```

### Getting Help

If you encounter issues:

1. Check the [troubleshooting guide](./commands.md)
2. Search existing [GitHub issues](https://github.com/your-org/shuriken-cli/issues)
3. Join our community discussions
4. Open a new issue with detailed information

## Next Steps

Now that Shuriken CLI is installed:

1. 📚 **[Learn Core Concepts](./concepts)** - Understand how Shuriken works
2. 🏗️ **[Create Your First Package](./creating-packages)** - Build a custom CLI package
3. 💡 **[Browse Examples](./commands.md)** - See real-world implementations

---

Ready to become a CLI ninja? Let's dive into the core concepts! 🥷
