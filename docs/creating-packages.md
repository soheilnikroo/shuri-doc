---
sidebar_position: 4
title: Creating Packages
description: Learn how to create your first Shuriken CLI package
---

# 🏗️ Creating Packages

Learn how to create powerful, reusable CLI packages that integrate seamlessly with Shuriken CLI.

## Quick Start

The fastest way to create a new package is using the built-in scaffolding tool:

```bash
# Generate a new package
pnpm run prepare-package

# Follow the interactive prompts
? Package name: my-awesome-tools
? Display name: My Awesome Tools
? Description: A collection of awesome development tools
? Initial version: 1.0.0
```

This creates a complete package structure ready for customization.

## Package Structure

Every Shuriken package follows this structure:

```
packages/my-awesome-tools/
├── commands/              # Command implementations
│   ├── setup.ts          # Setup command (optional)
│   ├── build.ts          # Custom commands
│   └── deploy.ts
├── migrations/            # Version migration scripts
│   ├── 1.0.0.ts
│   ├── 1.1.0.ts
│   └── index.ts          # Migration exports
├── templates/             # Code templates
│   ├── component.ts
│   └── service.ts
├── core/                  # Shared utilities
│   ├── logger.ts
│   ├── file.ts
│   └── process.ts
└── index.ts              # Package definition (required)
```

## Package Definition

The `index.ts` file is the heart of your package:

```typescript
import type { IPackageDefinition } from '@/types';

// Import your commands
import setupCommand from './commands.md/setup';
import buildCommand from './commands.md/build';
import deployCommand from './commands.md/deploy';

// Import migrations
import { migrations } from './commands.md';

const packageDefinition: IPackageDefinition = {
  metadata: {
    name: 'my-awesome-tools', // CLI package name
    version: '1.2.0', // Current version
    description: 'Awesome development tools for modern projects',
  },
  commands: [
    setupCommand, // Built-in setup command
    buildCommand, // Custom commands
    deployCommand,
  ],
  migrations, // Version migrations
};

export default packageDefinition;
```

### Metadata Properties

| Property      | Type   | Required | Description                       |
| ------------- | ------ | -------- | --------------------------------- |
| `name`        | string | ✅       | Package identifier (used in CLI)  |
| `version`     | string | ✅       | Current package version (semver)  |
| `description` | string | ✅       | Package description for help text |

## Creating Commands

Commands are the building blocks of your package functionality.

### Basic Command Structure

```typescript
import type { ICommandDefinition } from '@/types';
import { injectable, inject } from 'inversify';
import { Logger } from '@/core/logger';

@injectable()
export class BuildCommand {
  constructor(@inject('Logger') private logger: Logger) {}

  async execute(options: any, context: any): Promise<void> {
    this.logger.info('🔨 Starting build process...');

    // Your command logic here

    this.logger.success('✅ Build completed successfully!');
  }
}

const buildCommand: ICommandDefinition = {
  name: 'build',
  description: 'Build the project for production',
  options: [
    {
      name: 'env',
      alias: 'e',
      type: 'string',
      description: 'Build environment',
      default: 'production',
    },
    {
      name: 'watch',
      alias: 'w',
      type: 'boolean',
      description: 'Watch for file changes',
      default: false,
    },
  ],
  handler: BuildCommand,
};

export default buildCommand;
```

### Command Options

Commands can accept various types of options:

```typescript
interface ICommandOption {
  name: string; // Option name (--env)
  alias?: string; // Short alias (-e)
  type: 'string' | 'boolean' | 'number';
  description: string; // Help text
  required?: boolean; // Is this option required?
  default?: any; // Default value
  choices?: string[]; // Valid choices
}
```

### Interactive Commands

Create commands that prompt users for input:

```typescript
import { PromptService } from '@/services/prompt';

@injectable()
export class InteractiveCommand {
  constructor(
    @inject('PromptService') private prompt: PromptService,
    @inject('Logger') private logger: Logger
  ) {}

  async execute(options: any, context: any): Promise<void> {
    // Gather user input
    const answers = await this.prompt.ask([
      {
        type: 'input',
        name: 'componentName',
        message: 'What is the component name?',
        validate: (input: string) => {
          if (!input.trim()) return 'Component name is required';
          return true;
        },
      },
      {
        type: 'list',
        name: 'framework',
        message: 'Choose a framework:',
        choices: ['React', 'Vue', 'Angular'],
      },
      {
        type: 'confirm',
        name: 'includeTests',
        message: 'Include test files?',
        default: true,
      },
    ]);

    // Use the answers
    this.logger.info(
      `Creating ${answers.framework} component: ${answers.componentName}`
    );

    if (answers.includeTests) {
      this.logger.info('📝 Including test files');
    }
  }
}
```

## Setup Commands

Every package should have a setup command that initializes the package configuration:

```typescript
import type { ICommandDefinition } from '@/types';
import { injectable, inject } from 'inversify';
import { Logger } from '@/core/logger';
import { FileService } from '@/core/file';

@injectable()
export class SetupCommand {
  constructor(
    @inject('Logger') private logger: Logger,
    @inject('FileService') private fileService: FileService
  ) {}

  async execute(options: any, context: any): Promise<void> {
    this.logger.info('🎯 Setting up my-awesome-tools...');

    // Create configuration file
    const config = {
      version: '1.0.0',
      preferences: {
        theme: options.theme || 'dark',
        verbose: options.verbose || false,
      },
      tools: {
        buildTool: options.buildTool || 'vite',
        testFramework: options.testFramework || 'jest',
      },
    };

    // Write .shuriken.json to project root
    const registryPath = path.join(context.workingDirectory, '.shuriken.json');
    await this.fileService.writeJson(registryPath, {
      packages: {
        'my-awesome-tools': config,
      },
    });

    this.logger.success('✅ Setup completed successfully!');
    this.logger.info('📁 Configuration saved to .shuriken.json');
  }
}

const setupCommand: ICommandDefinition = {
  name: 'setup',
  description: 'Initialize my-awesome-tools configuration',
  options: [
    {
      name: 'theme',
      type: 'string',
      description: 'UI theme preference',
      choices: ['light', 'dark'],
      default: 'dark',
    },
    {
      name: 'build-tool',
      type: 'string',
      description: 'Preferred build tool',
      choices: ['vite', 'webpack', 'rollup'],
      default: 'vite',
    },
  ],
  handler: SetupCommand,
};

export default setupCommand;
```

## File Templates

Create reusable code templates for scaffolding:

```typescript
// templates/component.ts
export interface ComponentTemplateOptions {
  name: string;
  framework: 'react' | 'vue' | 'angular';
  typescript: boolean;
  includeStyles: boolean;
}

export const componentTemplate = (
  options: ComponentTemplateOptions
): string => {
  const { name, framework, typescript, includeStyles } = options;

  if (framework === 'react') {
    return `${typescript ? "import React from 'react';" : ''}
${includeStyles ? `import styles from './${name}.module.css';` : ''}

${
  typescript
    ? `interface ${name}Props {
  // Add your props here
}

const ${name}: React.FC<${name}Props> = (props) => {`
    : `const ${name} = (props) => {`
}
  return (
    <div${includeStyles ? ` className={styles.container}` : ''}>
      <h1>${name} Component</h1>
      {/* Component content */}
    </div>
  );
};

export default ${name};
`;
  }

  // Add other framework templates...
  return '';
};
```

## Core Utilities

Create shared utilities for your package:

```typescript
// core/logger.ts
import { Logger as BaseLogger } from '@/core/logger';

export class MyPackageLogger extends BaseLogger {
  constructor() {
    super();
    this.setPrefix('🛠️  MY-TOOLS');
  }

  build(message: string): void {
    this.log('info', `🔨 [BUILD] ${message}`, 'yellow');
  }

  deploy(message: string): void {
    this.log('info', `🚀 [DEPLOY] ${message}`, 'cyan');
  }

  test(message: string): void {
    this.log('info', `🧪 [TEST] ${message}`, 'green');
  }
}
```

```typescript
// core/file.ts
import { FileService as BaseFileService } from '@/core/file';
import path from 'path';

export class MyPackageFileService extends BaseFileService {
  /**
   * Create a standard project structure
   */
  async createProjectStructure(projectPath: string): Promise<void> {
    const directories = [
      'src/components',
      'src/utils',
      'src/hooks',
      'tests',
      'docs',
    ];

    for (const dir of directories) {
      await this.ensureDir(path.join(projectPath, dir));
    }
  }

  /**
   * Find all TypeScript files in the project
   */
  async findTypeScriptFiles(projectPath: string): Promise<string[]> {
    return this.glob('**/*.{ts,tsx}', {
      cwd: projectPath,
      ignore: ['node_modules/**', 'dist/**'],
    });
  }
}
```

## Testing Your Package

Create tests for your commands:

```typescript
// commands/__tests__/build.test.ts
import { Container } from 'inversify';
import { BuildCommand } from '../build';
import { Logger } from '@/core/logger';

describe('BuildCommand', () => {
  let command: BuildCommand;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
    } as any;

    command = new BuildCommand(mockLogger);
  });

  it('should execute build successfully', async () => {
    const options = { env: 'production' };
    const context = { workingDirectory: '/test/project' };

    await command.execute(options, context);

    expect(mockLogger.info).toHaveBeenCalledWith(
      '🔨 Starting build process...'
    );
    expect(mockLogger.success).toHaveBeenCalledWith(
      '✅ Build completed successfully!'
    );
  });
});
```

## Package Validation

Ensure your package follows best practices:

```typescript
// scripts/validate-package.ts
import { validatePackageStructure } from '@/utils/package-validator';

async function validateMyPackage() {
  const packagePath = './packages/my-awesome-tools';

  const validation = await validatePackageStructure(packagePath);

  if (validation.isValid) {
    console.log('✅ Package structure is valid');
  } else {
    console.error('❌ Package validation failed:');
    validation.errors.forEach((error) => {
      console.error(`  - ${error}`);
    });
  }
}
```

## Publishing Your Package

### Internal Distribution

For internal company use:

```bash
# Build the package
pnpm build

# Create a tarball
npm pack

# Install in another project
npm install ./my-awesome-tools-1.0.0.tgz
```

### NPM Registry

For public or private NPM registry:

```json
// package.json
{
  "name": "@your-org/shuriken-my-awesome-tools",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "templates", "README.md"]
}
```

```bash
# Publish to NPM
npm publish --access public

# Or to private registry
npm publish --registry https://npm.your-company.com
```

## Best Practices

### 1. Naming Conventions

- **Package names**: Use kebab-case (`my-awesome-tools`)
- **Command names**: Use kebab-case (`build-app`)
- **Option names**: Use kebab-case (`--build-tool`)

### 2. Error Handling

```typescript
async execute(options: any, context: any): Promise<void> {
  try {
    await this.performOperation();
  } catch (error) {
    if (error instanceof ValidationError) {
      this.logger.error(`❌ ${error.message}`);
      this.showSuggestions(error.suggestions);
    } else {
      this.logger.error(`❌ Unexpected error: ${error.message}`);
      throw error;
    }
  }
}
```

### 3. User Experience

- Provide clear, actionable error messages
- Use consistent emoji and color coding
- Show progress for long-running operations
- Offer helpful suggestions for common mistakes

### 4. Documentation

- Include comprehensive README.md
- Document all command options
- Provide usage examples
- Create migration guides for breaking changes

## Next Steps

Now that you can create packages:

1. ⚡ **[Master Command Definitions](./commands.md)** - Build sophisticated commands
2. 🔄 **[Learn Migration System](./commands.md)** - Handle version upgrades
3. 💡 **[Explore Examples](./commands.md)** - See real-world implementations
4. 🌟 **[Follow Best Practices](./commands.md)** - Build maintainable packages

---

Ready to create powerful CLI commands? Let's dive deeper! 🥷
