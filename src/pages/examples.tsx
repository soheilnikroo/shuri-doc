import Link from '@docusaurus/Link';
import React, { useState } from 'react';

interface CodeExample {
  title: string;
  description: string;
  language: string;
  code: string;
  filename?: string;
}

interface ExampleSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  examples: CodeExample[];
}

const EXAMPLE_SECTIONS: ExampleSection[] = [
  {
    id: 'package-structure',
    title: 'Package Structure',
    description: 'Learn how to organize your package files and directories',
    icon: '📁',
    examples: [
      {
        title: 'Basic Package Structure',
        description: 'The recommended directory structure for a new package',
        language: 'bash',
        code: `packages/
└── my-package/
    ├── commands/           # Command implementations
    │   ├── setup.ts
    │   ├── build.ts
    │   └── deploy.ts
    ├── core/              # Shared utilities
    │   ├── file.ts
    │   ├── logger.ts
    │   └── process.ts
    ├── migrations/        # Version migrations
    │   ├── 1.0.0.ts
    │   └── 1.1.0.ts
    ├── templates/         # Code templates
    │   ├── component.ts
    │   └── service.ts
    └── index.ts          # Package definition`,
      },
      {
        title: 'Package Definition (index.ts)',
        description: 'How to define your package metadata and export commands',
        language: 'typescript',
        filename: 'packages/my-package/index.ts',
        code: `import type { IPackageDefinition } from '@/types';

import setupCommand from './commands/setup';
import buildCommand from './commands/build';
import deployCommand from './commands/deploy';
import { migrations } from './migrations';

const packageDefinition: IPackageDefinition = {
  metadata: {
    name: 'my-package',
    version: '1.2.0',
    description: 'A powerful development toolkit for modern applications',
  },
  commands: [
    setupCommand,
    buildCommand,
    deployCommand,
  ],
  migrations,
};

export default packageDefinition;`,
      },
    ],
  },
  {
    id: 'creating-commands',
    title: 'Creating Commands',
    description:
      'Build powerful CLI commands with options, arguments, and validation',
    icon: '⚡',
    examples: [
      {
        title: 'Basic Command Structure',
        description: 'Template for creating a new command',
        language: 'typescript',
        filename: 'packages/my-package/commands/build.ts',
        code: `import type { ICommandDefinition } from '@/types';
import { injectable } from 'inversify';

@injectable()
export class BuildCommand {
  async execute(options: any, context: any): Promise<void> {
    // Command implementation here
    console.log('Building project...');
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
      description: 'Environment to build for',
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

export default buildCommand;`,
      },
      {
        title: 'Interactive Command with Prompts',
        description: 'Command that uses prompts to gather user input',
        language: 'typescript',
        filename: 'packages/jarvis/commands/component.ts',
        code: `import type { ICommandDefinition } from '@/types';
import { injectable, inject } from 'inversify';
import { PromptService } from '@/services/prompt';
import { Logger } from '@/core/logger';

@injectable()
export class ComponentCommand {
  constructor(
    @inject('PromptService') private prompt: PromptService,
    @inject('Logger') private logger: Logger
  ) {}

  async execute(options: any, context: any): Promise<void> {
    // Get component details from user
    const answers = await this.prompt.ask([
      {
        type: 'input',
        name: 'componentName',
        message: 'What is the component name?',
        validate: (input: string) => {
          if (!input.trim()) return 'Component name is required';
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
            return 'Component name must be PascalCase';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'componentType',
        message: 'What type of component?',
        choices: ['Functional', 'Class', 'Hook'],
        default: 'Functional',
      },
      {
        type: 'confirm',
        name: 'includeTests',
        message: 'Include test files?',
        default: true,
      },
    ]);

    this.logger.info(\`🚀 Generating \${answers.componentType} component: \${answers.componentName}\`);
    
    // Generate component files
    await this.generateComponent(answers);
    
    this.logger.success(\`✅ Component '\${answers.componentName}' created successfully!\`);
  }

  private async generateComponent(config: any): Promise<void> {
    // Component generation logic here
  }
}

const componentCommand: ICommandDefinition = {
  name: 'component',
  description: 'Generate a React component with templates',
  arguments: [
    {
      name: 'name',
      description: 'Component name (optional if using interactive mode)',
      required: false,
    },
  ],
  options: [
    {
      name: 'type',
      alias: 't',
      type: 'string',
      description: 'Component type (functional, class, hook)',
      choices: ['functional', 'class', 'hook'],
    },
    {
      name: 'no-tests',
      type: 'boolean',
      description: 'Skip generating test files',
      default: false,
    },
  ],
  handler: ComponentCommand,
};

export default componentCommand;`,
      },
      {
        title: 'File Processing Command',
        description: 'Command that processes files and directories',
        language: 'typescript',
        filename: 'packages/my-package/commands/migrate.ts',
        code: `import type { ICommandDefinition } from '@/types';
import { injectable, inject } from 'inversify';
import { FileService } from '@/core/file';
import { Logger } from '@/core/logger';
import path from 'path';

@injectable()
export class MigrateCommand {
  constructor(
    @inject('FileService') private fileService: FileService,
    @inject('Logger') private logger: Logger
  ) {}

  async execute(options: any, context: any): Promise<void> {
    const { version, force } = options;
    
    this.logger.info('🔄 Starting migration process...');
    
    // Find migration files
    const migrationsDir = path.join(context.packagePath, 'migrations');
    const migrationFiles = await this.fileService.readDir(migrationsDir);
    
    // Filter and sort migrations
    const applicableMigrations = migrationFiles
      .filter(file => file.endsWith('.ts'))
      .filter(file => !version || this.shouldApplyMigration(file, version))
      .sort();

    if (applicableMigrations.length === 0) {
      this.logger.info('✅ No migrations to apply');
      return;
    }

    // Apply migrations
    for (const migrationFile of applicableMigrations) {
      await this.applyMigration(migrationFile, migrationsDir, force);
    }
    
    this.logger.success(\`🎉 Applied \${applicableMigrations.length} migrations\`);
  }

  private shouldApplyMigration(file: string, targetVersion: string): boolean {
    const fileVersion = file.replace('.ts', '');
    return this.compareVersions(fileVersion, targetVersion) <= 0;
  }

  private async applyMigration(file: string, dir: string, force: boolean): Promise<void> {
    const migrationPath = path.join(dir, file);
    this.logger.info(\`📝 Applying migration: \${file}\`);
    
    try {
      const migration = await import(migrationPath);
      await migration.default.up();
      this.logger.success(\`✅ Migration \${file} completed\`);
    } catch (error) {
      this.logger.error(\`❌ Migration \${file} failed: \${error.message}\`);
      if (!force) throw error;
    }
  }

  private compareVersions(a: string, b: string): number {
    // Simple semantic version comparison
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0;
      const bPart = bParts[i] || 0;
      if (aPart < bPart) return -1;
      if (aPart > bPart) return 1;
    }
    return 0;
  }
}

const migrateCommand: ICommandDefinition = {
  name: 'migrate',
  description: 'Run database or code migrations',
  options: [
    {
      name: 'version',
      alias: 'v',
      type: 'string',
      description: 'Target version to migrate to',
    },
    {
      name: 'force',
      alias: 'f',
      type: 'boolean',
      description: 'Continue on migration errors',
      default: false,
    },
  ],
  handler: MigrateCommand,
};

export default migrateCommand;`,
      },
    ],
  },
  {
    id: 'migrations',
    title: 'Version Migrations',
    description: 'Handle package version upgrades and data migrations',
    icon: '🔄',
    examples: [
      {
        title: 'Migration File Structure',
        description: 'How to structure your migration files',
        language: 'typescript',
        filename: 'packages/my-package/migrations/1.2.0.ts',
        code: `import type { IMigrationDefinition } from '@/types';
import { FileService } from '@/core/file';
import { Logger } from '@/core/logger';

const migration_1_2_0: IMigrationDefinition = {
  version: '1.2.0',
  description: 'Add TypeScript support and update config files',
  
  async up(context: any): Promise<void> {
    const logger = new Logger();
    const fileService = new FileService();
    
    logger.info('🔄 Migrating to v1.2.0...');
    
    // 1. Update package.json
    await this.updatePackageJson(fileService, context.projectPath);
    
    // 2. Add TypeScript config
    await this.addTypeScriptConfig(fileService, context.projectPath);
    
    // 3. Convert JS files to TS
    await this.convertJavaScriptFiles(fileService, context.projectPath);
    
    logger.success('✅ Migration to v1.2.0 completed');
  },

  async down(context: any): Promise<void> {
    const logger = new Logger();
    const fileService = new FileService();
    
    logger.info('🔄 Rolling back from v1.2.0...');
    
    // Rollback steps (reverse order)
    await this.revertJavaScriptFiles(fileService, context.projectPath);
    await this.removeTypeScriptConfig(fileService, context.projectPath);
    await this.revertPackageJson(fileService, context.projectPath);
    
    logger.success('✅ Rollback from v1.2.0 completed');
  },

  async updatePackageJson(fileService: FileService, projectPath: string): Promise<void> {
    const packageJsonPath = \`\${projectPath}/package.json\`;
    const packageJson = await fileService.readJson(packageJsonPath);
    
    // Add TypeScript dependencies
    packageJson.devDependencies = packageJson.devDependencies || {};
    Object.assign(packageJson.devDependencies, {
      'typescript': '^5.0.0',
      '@types/node': '^20.0.0',
      '@types/react': '^18.0.0',
    });

    // Add TypeScript scripts
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts['type-check'] = 'tsc --noEmit';
    
    await fileService.writeJson(packageJsonPath, packageJson);
  },

  async addTypeScriptConfig(fileService: FileService, projectPath: string): Promise<void> {
    const tsconfigPath = \`\${projectPath}/tsconfig.json\`;
    const tsconfig = {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        skipLibCheck: true,
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist'],
    };
    
    await fileService.writeJson(tsconfigPath, tsconfig);
  },

  async convertJavaScriptFiles(fileService: FileService, projectPath: string): Promise<void> {
    // Implementation for converting .js files to .ts
    // This would involve parsing, type inference, etc.
  },

  // Rollback methods...
  async revertJavaScriptFiles(fileService: FileService, projectPath: string): Promise<void> {
    // Revert .ts files back to .js
  },

  async removeTypeScriptConfig(fileService: FileService, projectPath: string): Promise<void> {
    const tsconfigPath = \`\${projectPath}/tsconfig.json\`;
    await fileService.remove(tsconfigPath);
  },

  async revertPackageJson(fileService: FileService, projectPath: string): Promise<void> {
    // Remove TypeScript-related dependencies and scripts
  },
};

export default migration_1_2_0;`,
      },
      {
        title: 'Migration Index File',
        description: 'How to export all migrations from your package',
        language: 'typescript',
        filename: 'packages/my-package/migrations/index.ts',
        code: `import type { IMigrationDefinition } from '@/types';

import migration_1_0_0 from './1.0.0';
import migration_1_1_0 from './1.1.0';
import migration_1_2_0 from './1.2.0';

export const migrations: IMigrationDefinition[] = [
  migration_1_0_0,
  migration_1_1_0,
  migration_1_2_0,
];

export {
  migration_1_0_0,
  migration_1_1_0,
  migration_1_2_0,
};`,
      },
    ],
  },
  {
    id: 'templates',
    title: 'Code Templates',
    description: 'Create reusable code templates for scaffolding',
    icon: '📝',
    examples: [
      {
        title: 'React Component Template',
        description: 'Template for generating React components',
        language: 'typescript',
        filename: 'packages/jarvis/templates/component.ts',
        code: `export interface ComponentTemplateOptions {
  name: string;
  type: 'functional' | 'class';
  includeStyles: boolean;
  includeTests: boolean;
  propsInterface?: string;
}

export const componentTemplate = (options: ComponentTemplateOptions): string => {
  const { name, type, propsInterface } = options;
  
  if (type === 'functional') {
    return \`import React from 'react';
\${options.includeStyles ? \`import styles from './\${name}.module.css';\` : ''}

\${propsInterface ? \`interface \${name}Props {
  \${propsInterface}
}\` : \`interface \${name}Props {
  // Add your props here
}\`}

const \${name}: React.FC<\${name}Props> = (props) => {
  return (
    <div\${options.includeStyles ? \` className={styles.container}\` : ''}>
      <h1>\${name} Component</h1>
      {/* Component content */}
    </div>
  );
};

export default \${name};
\`;
  }
  
  return \`import React, { Component } from 'react';
\${options.includeStyles ? \`import styles from './\${name}.module.css';\` : ''}

\${propsInterface ? \`interface \${name}Props {
  \${propsInterface}
}\` : \`interface \${name}Props {
  // Add your props here
}\`}

interface \${name}State {
  // Add your state here
}

class \${name} extends Component<\${name}Props, \${name}State> {
  constructor(props: \${name}Props) {
    super(props);
    this.state = {
      // Initialize state
    };
  }

  render() {
    return (
      <div\${options.includeStyles ? \` className={styles.container}\` : ''}>
        <h1>\${name} Component</h1>
        {/* Component content */}
      </div>
    );
  }
}

export default \${name};
\`;
};`,
      },
      {
        title: 'Test Template',
        description: 'Template for generating test files',
        language: 'typescript',
        filename: 'packages/jarvis/templates/component-test.ts',
        code: `export interface TestTemplateOptions {
  componentName: string;
  testFramework: 'jest' | 'vitest';
  includeSnapshots: boolean;
}

export const testTemplate = (options: TestTemplateOptions): string => {
  const { componentName, testFramework, includeSnapshots } = options;
  
  return \`import React from 'react';
import { render, screen\${includeSnapshots ? ', renderer' : ''} } from '@testing-library/react';
\${testFramework === 'vitest' ? "import { describe, it, expect } from 'vitest';" : ''}
import \${componentName} from './\${componentName}';

describe('\${componentName}', () => {
  it('renders without crashing', () => {
    render(<\${componentName} />);
    expect(screen.getByText('\${componentName} Component')).toBeInTheDocument();
  });

  it('displays the correct heading', () => {
    render(<\${componentName} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('\${componentName} Component');
  });

  \${includeSnapshots ? \`it('matches snapshot', () => {
    const tree = renderer.create(<\${componentName} />).toJSON();
    expect(tree).toMatchSnapshot();
  });\` : ''}

  // Add more tests here
});
\`;
};`,
      },
    ],
  },
  {
    id: 'core-utilities',
    title: 'Core Utilities',
    description:
      'Shared utilities for file operations, logging, and process management',
    icon: '🛠️',
    examples: [
      {
        title: 'Custom Logger',
        description: 'Package-specific logger with custom formatting',
        language: 'typescript',
        filename: 'packages/my-package/core/logger.ts',
        code: `import { Logger as BaseLogger } from '@/core/logger';

export class MyPackageLogger extends BaseLogger {
  constructor() {
    super();
    this.setPrefix('🚀 MY-PACKAGE');
  }

  deployment(message: string): void {
    this.log('info', \`🚀 [DEPLOY] \${message}\`, 'cyan');
  }

  build(message: string): void {
    this.log('info', \`🔨 [BUILD] \${message}\`, 'yellow');
  }

  test(message: string): void {
    this.log('info', \`🧪 [TEST] \${message}\`, 'green');
  }

  performance(message: string, duration?: number): void {
    const durationText = duration ? \` (\${duration}ms)\` : '';
    this.log('info', \`⚡ [PERF] \${message}\${durationText}\`, 'magenta');
  }
}

// Usage in commands:
// const logger = new MyPackageLogger();
// logger.deployment('Starting deployment to production');
// logger.build('Compiling TypeScript files');
// logger.performance('Build completed', 1250);`,
      },
      {
        title: 'File Operations Utility',
        description: 'Enhanced file operations specific to your package needs',
        language: 'typescript',
        filename: 'packages/my-package/core/file.ts',
        code: `import { FileService as BaseFileService } from '@/core/file';
import path from 'path';
import { glob } from 'glob';

export class MyPackageFileService extends BaseFileService {
  /**
   * Find all component files in the project
   */
  async findComponentFiles(projectPath: string): Promise<string[]> {
    const patterns = [
      'src/components/**/*.tsx',
      'src/components/**/*.jsx',
      'components/**/*.tsx',
      'components/**/*.jsx',
    ];

    const files: string[] = [];
    for (const pattern of patterns) {
      const matches = await glob(pattern, { cwd: projectPath });
      files.push(...matches.map(file => path.join(projectPath, file)));
    }

    return files;
  }

  /**
   * Create a component directory structure
   */
  async createComponentStructure(
    projectPath: string,
    componentName: string
  ): Promise<void> {
    const componentDir = path.join(projectPath, 'src', 'components', componentName);
    
    // Create directory
    await this.ensureDir(componentDir);
    
    // Create subdirectories if needed
    await this.ensureDir(path.join(componentDir, '__tests__'));
    await this.ensureDir(path.join(componentDir, 'styles'));
  }

  /**
   * Read and parse a TypeScript file
   */
  async readTypeScriptFile(filePath: string): Promise<{
    content: string;
    exports: string[];
    imports: string[];
  }> {
    const content = await this.readFile(filePath);
    
    // Simple regex-based parsing (you might want to use a proper TS parser)
    const exportMatches = content.match(/export\\s+(?:default\\s+)?(?:class|function|const|let|var)\\s+(\\w+)/g) || [];
    const importMatches = content.match(/import\\s+.*?from\\s+['"][^'"]+['"]/g) || [];
    
    const exports = exportMatches.map(match => {
      const nameMatch = match.match(/\\b(\\w+)$/);
      return nameMatch ? nameMatch[1] : '';
    }).filter(Boolean);
    
    return {
      content,
      exports,
      imports: importMatches,
    };
  }

  /**
   * Update imports in a file
   */
  async updateImports(
    filePath: string,
    newImports: { module: string; imports: string[] }[]
  ): Promise<void> {
    let content = await this.readFile(filePath);
    
    // Add new imports at the top
    const newImportStatements = newImports
      .map(({ module, imports }) => {
        if (imports.includes('default')) {
          const defaultImport = imports.find(imp => imp === 'default');
          const namedImports = imports.filter(imp => imp !== 'default');
          return \`import \${defaultImport}\${namedImports.length ? \`, { \${namedImports.join(', ')} }\` : ''} from '\${module}';\`;
        }
        return \`import { \${imports.join(', ')} } from '\${module}';\`;
      })
      .join('\\n');
    
    content = newImportStatements + '\\n' + content;
    
    await this.writeFile(filePath, content);
  }
}`,
      },
      {
        title: 'Process Management',
        description:
          'Custom process utilities for running commands and handling output',
        language: 'typescript',
        filename: 'packages/my-package/core/process.ts',
        code: `import { ProcessService as BaseProcessService } from '@/core/process';
import { MyPackageLogger } from './logger';

export class MyPackageProcessService extends BaseProcessService {
  private logger = new MyPackageLogger();

  /**
   * Run npm/yarn/pnpm commands with proper package manager detection
   */
  async runPackageManager(
    command: string,
    args: string[] = [],
    options: any = {}
  ): Promise<void> {
    const packageManager = await this.detectPackageManager();
    this.logger.info(\`📦 Running \${packageManager} \${command} \${args.join(' ')}\`);
    
    await this.run(packageManager, [command, ...args], {
      stdio: 'inherit',
      ...options,
    });
  }

  /**
   * Run build tools (webpack, vite, rollup, etc.)
   */
  async runBuildTool(
    tool: string,
    config?: string,
    options: string[] = []
  ): Promise<void> {
    const args = config ? ['--config', config, ...options] : options;
    
    this.logger.build(\`🔨 Running \${tool} build\`);
    const startTime = Date.now();
    
    try {
      await this.run(tool, args, { stdio: 'inherit' });
      const duration = Date.now() - startTime;
      this.logger.performance('Build completed', duration);
    } catch (error) {
      this.logger.error(\`❌ Build failed: \${error.message}\`);
      throw error;
    }
  }

  /**
   * Run tests with coverage
   */
  async runTests(
    testRunner: 'jest' | 'vitest' = 'jest',
    coverage = false,
    watch = false
  ): Promise<void> {
    const args: string[] = [];
    
    if (coverage) args.push('--coverage');
    if (watch) args.push('--watch');
    
    this.logger.test(\`🧪 Running tests with \${testRunner}\`);
    
    try {
      await this.run(testRunner, args, { stdio: 'inherit' });
      this.logger.success('✅ All tests passed');
    } catch (error) {
      this.logger.error('❌ Tests failed');
      throw error;
    }
  }

  /**
   * Deploy to various platforms
   */
  async deploy(
    platform: 'vercel' | 'netlify' | 'aws' | 'docker',
    config: any = {}
  ): Promise<void> {
    this.logger.deployment(\`🚀 Deploying to \${platform}\`);
    
    switch (platform) {
      case 'vercel':
        await this.deployToVercel(config);
        break;
      case 'netlify':
        await this.deployToNetlify(config);
        break;
      case 'aws':
        await this.deployToAWS(config);
        break;
      case 'docker':
        await this.deployToDocker(config);
        break;
      default:
        throw new Error(\`Unsupported platform: \${platform}\`);
    }
    
    this.logger.success(\`🎉 Successfully deployed to \${platform}\`);
  }

  private async detectPackageManager(): Promise<string> {
    // Check for lock files to determine package manager
    if (await this.fileExists('pnpm-lock.yaml')) return 'pnpm';
    if (await this.fileExists('yarn.lock')) return 'yarn';
    return 'npm';
  }

  private async deployToVercel(config: any): Promise<void> {
    const args = ['--prod'];
    if (config.token) args.push('--token', config.token);
    await this.run('vercel', args);
  }

  private async deployToNetlify(config: any): Promise<void> {
    const args = ['deploy', '--prod'];
    if (config.site) args.push('--site', config.site);
    await this.run('netlify', args);
  }

  private async deployToAWS(config: any): Promise<void> {
    // AWS deployment logic
    await this.run('aws', ['s3', 'sync', './dist', \`s3://\${config.bucket}\`]);
  }

  private async deployToDocker(config: any): Promise<void> {
    const tag = config.tag || 'latest';
    await this.run('docker', ['build', '-t', tag, '.']);
    if (config.push) {
      await this.run('docker', ['push', tag]);
    }
  }
}`,
      },
    ],
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    description:
      'Guidelines and patterns for building maintainable CLI packages',
    icon: '🌟',
    examples: [
      {
        title: 'Command Validation',
        description:
          'How to validate command inputs and provide helpful error messages',
        language: 'typescript',
        code: `import type { ICommandDefinition } from '@/types';
import { injectable, inject } from 'inversify';
import { Logger } from '@/core/logger';
import { FileService } from '@/core/file';

@injectable()
export class ValidatedCommand {
  constructor(
    @inject('Logger') private logger: Logger,
    @inject('FileService') private fileService: FileService
  ) {}

  async execute(options: any, context: any): Promise<void> {
    // Validate environment
    await this.validateEnvironment(context);
    
    // Validate options
    this.validateOptions(options);
    
    // Validate project state
    await this.validateProjectState(context.projectPath);
    
    // Execute command logic
    await this.executeCommand(options, context);
  }

  private async validateEnvironment(context: any): Promise<void> {
    // Check Node.js version
    const nodeVersion = process.version;
    const requiredVersion = '16.0.0';
    
    if (!this.isVersionCompatible(nodeVersion.slice(1), requiredVersion)) {
      throw new Error(
        \`❌ Node.js \${requiredVersion}+ required. Current: \${nodeVersion}\`
      );
    }

    // Check if required tools are installed
    const requiredTools = ['git', 'npm'];
    for (const tool of requiredTools) {
      if (!(await this.isCommandAvailable(tool))) {
        throw new Error(\`❌ Required tool not found: \${tool}\`);
      }
    }
  }

  private validateOptions(options: any): void {
    // Validate required options
    if (options.env && !['development', 'staging', 'production'].includes(options.env)) {
      throw new Error(
        \`❌ Invalid environment: \${options.env}. Must be: development, staging, or production\`
      );
    }

    // Validate file paths
    if (options.config && !this.isValidPath(options.config)) {
      throw new Error(\`❌ Invalid config path: \${options.config}\`);
    }

    // Validate port numbers
    if (options.port && (options.port < 1 || options.port > 65535)) {
      throw new Error(\`❌ Invalid port: \${options.port}. Must be between 1-65535\`);
    }
  }

  private async validateProjectState(projectPath: string): Promise<void> {
    // Check if package.json exists
    const packageJsonPath = \`\${projectPath}/package.json\`;
    if (!(await this.fileService.exists(packageJsonPath))) {
      throw new Error('❌ No package.json found. Are you in a valid project directory?');
    }

    // Validate package.json structure
    const packageJson = await this.fileService.readJson(packageJsonPath);
    if (!packageJson.name) {
      throw new Error('❌ package.json must have a name field');
    }

    // Check for conflicting processes
    if (await this.isPortInUse(3000)) {
      this.logger.warn('⚠️  Port 3000 is already in use');
    }
  }

  private isVersionCompatible(current: string, required: string): boolean {
    const currentParts = current.split('.').map(Number);
    const requiredParts = required.split('.').map(Number);
    
    for (let i = 0; i < requiredParts.length; i++) {
      if (currentParts[i] < requiredParts[i]) return false;
      if (currentParts[i] > requiredParts[i]) return true;
    }
    return true;
  }

  private async isCommandAvailable(command: string): Promise<boolean> {
    try {
      await this.run('which', [command]);
      return true;
    } catch {
      return false;
    }
  }

  private isValidPath(path: string): boolean {
    return /^[^<>:"|?*\\x00-\\x1f]+$/.test(path);
  }

  // ... other validation methods
}`,
      },
      {
        title: 'Error Handling',
        description: 'Comprehensive error handling with user-friendly messages',
        language: 'typescript',
        code: `import type { ICommandDefinition } from '@/types';
import { injectable, inject } from 'inversify';
import { Logger } from '@/core/logger';

export class CommandError extends Error {
  constructor(
    message: string,
    public code: string,
    public suggestions: string[] = []
  ) {
    super(message);
    this.name = 'CommandError';
  }
}

@injectable()
export class RobustCommand {
  constructor(
    @inject('Logger') private logger: Logger
  ) {}

  async execute(options: any, context: any): Promise<void> {
    try {
      await this.executeWithErrorHandling(options, context);
    } catch (error) {
      await this.handleError(error, options, context);
    }
  }

  private async executeWithErrorHandling(options: any, context: any): Promise<void> {
    // Wrap potentially failing operations
    try {
      await this.performNetworkOperation();
    } catch (error) {
      throw new CommandError(
        'Failed to connect to remote service',
        'NETWORK_ERROR',
        [
          'Check your internet connection',
          'Verify the service URL is correct',
          'Try again in a few moments',
        ]
      );
    }

    try {
      await this.performFileOperation();
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new CommandError(
          \`File not found: \${error.path}\`,
          'FILE_NOT_FOUND',
          [
            'Check if the file path is correct',
            'Ensure the file exists and is readable',
            \`Run 'ls -la \${error.path}' to check permissions\`,
          ]
        );
      }
      throw error;
    }
  }

  private async handleError(error: Error, options: any, context: any): Promise<void> {
    if (error instanceof CommandError) {
      // Handle custom command errors
      this.logger.error(\`❌ \${error.message}\`);
      
      if (error.suggestions.length > 0) {
        this.logger.info('💡 Suggestions:');
        error.suggestions.forEach((suggestion, index) => {
          this.logger.info(\`   \${index + 1}. \${suggestion}\`);
        });
      }

      // Provide context-specific help
      if (error.code === 'NETWORK_ERROR' && options.offline) {
        this.logger.info('ℹ️  You can try running in offline mode with --offline flag');
      }

    } else if (error.code === 'EACCES') {
      // Permission errors
      this.logger.error('❌ Permission denied');
      this.logger.info('💡 Try running with appropriate permissions:');
      this.logger.info('   sudo shuriken <command>');
      
    } else if (error.code === 'ENOSPC') {
      // Disk space errors
      this.logger.error('❌ Insufficient disk space');
      this.logger.info('💡 Free up disk space and try again');
      
    } else {
      // Unexpected errors
      this.logger.error(\`❌ Unexpected error: \${error.message}\`);
      
      if (options.debug) {
        this.logger.error('Stack trace:');
        this.logger.error(error.stack || 'No stack trace available');
      } else {
        this.logger.info('💡 Run with --debug flag for more details');
      }
    }

    // Log error for debugging
    this.logger.debug(\`Error details: \${JSON.stringify({
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    }, null, 2)}\`);

    // Exit with appropriate code
    process.exit(1);
  }

  private async performNetworkOperation(): Promise<void> {
    // Network operation that might fail
  }

  private async performFileOperation(): Promise<void> {
    // File operation that might fail
  }
}`,
      },
      {
        title: 'Configuration Management',
        description:
          'Best practices for handling configuration files and user settings',
        language: 'typescript',
        code: `import type { ICommandDefinition } from '@/types';
import { injectable, inject } from 'inversify';
import { FileService } from '@/core/file';
import { Logger } from '@/core/logger';
import path from 'path';
import os from 'os';

interface PackageConfig {
  version: string;
  preferences: {
    theme: 'light' | 'dark';
    verbosity: 'quiet' | 'normal' | 'verbose';
    autoUpdate: boolean;
  };
  tools: {
    editor: string;
    browser: string;
    terminal: string;
  };
  projects: Array<{
    name: string;
    path: string;
    type: string;
  }>;
}

@injectable()
export class ConfigurableCommand {
  private configPath: string;
  private config: PackageConfig | null = null;

  constructor(
    @inject('FileService') private fileService: FileService,
    @inject('Logger') private logger: Logger
  ) {
    this.configPath = path.join(os.homedir(), '.shuriken', 'my-package.json');
  }

  async execute(options: any, context: any): Promise<void> {
    // Load configuration
    await this.loadConfig();
    
    // Merge with command options
    const effectiveConfig = this.mergeConfig(options);
    
    // Execute with configuration
    await this.executeWithConfig(effectiveConfig, context);
  }

  private async loadConfig(): Promise<void> {
    try {
      if (await this.fileService.exists(this.configPath)) {
        this.config = await this.fileService.readJson(this.configPath);
        this.validateConfig(this.config);
      } else {
        this.config = this.getDefaultConfig();
        await this.saveConfig();
      }
    } catch (error) {
      this.logger.warn(\`⚠️  Failed to load config: \${error.message}\`);
      this.logger.info('📝 Using default configuration');
      this.config = this.getDefaultConfig();
    }
  }

  private getDefaultConfig(): PackageConfig {
    return {
      version: '1.0.0',
      preferences: {
        theme: 'dark',
        verbosity: 'normal',
        autoUpdate: true,
      },
      tools: {
        editor: process.env.EDITOR || 'code',
        browser: process.env.BROWSER || 'chrome',
        terminal: process.env.TERMINAL || 'Terminal',
      },
      projects: [],
    };
  }

  private validateConfig(config: any): void {
    const requiredFields = ['version', 'preferences', 'tools', 'projects'];
    for (const field of requiredFields) {
      if (!(field in config)) {
        throw new Error(\`Missing required config field: \${field}\`);
      }
    }

    // Validate enum values
    if (!['light', 'dark'].includes(config.preferences.theme)) {
      config.preferences.theme = 'dark';
      this.logger.warn('⚠️  Invalid theme in config, using default: dark');
    }

    if (!['quiet', 'normal', 'verbose'].includes(config.preferences.verbosity)) {
      config.preferences.verbosity = 'normal';
      this.logger.warn('⚠️  Invalid verbosity in config, using default: normal');
    }
  }

  private mergeConfig(options: any): PackageConfig {
    const merged = JSON.parse(JSON.stringify(this.config));

    // Override with command-line options
    if (options.theme) merged.preferences.theme = options.theme;
    if (options.verbose) merged.preferences.verbosity = 'verbose';
    if (options.quiet) merged.preferences.verbosity = 'quiet';
    if (options.editor) merged.tools.editor = options.editor;

    return merged;
  }

  private async saveConfig(): Promise<void> {
    try {
      await this.fileService.ensureDir(path.dirname(this.configPath));
      await this.fileService.writeJson(this.configPath, this.config, { spaces: 2 });
    } catch (error) {
      this.logger.warn(\`⚠️  Failed to save config: \${error.message}\`);
    }
  }

  private async executeWithConfig(config: PackageConfig, context: any): Promise<void> {
    // Set logger verbosity
    this.logger.setLevel(
      config.preferences.verbosity === 'quiet' ? 'error' :
      config.preferences.verbosity === 'verbose' ? 'debug' : 'info'
    );

    // Use configured tools
    if (config.tools.editor) {
      process.env.EDITOR = config.tools.editor;
    }

    // Apply theme
    if (config.preferences.theme === 'dark') {
      this.logger.setColorScheme('dark');
    }

    // Command implementation using config...
    this.logger.info(\`🎯 Running with \${config.preferences.theme} theme\`);
  }

  // Utility method for other commands to access config
  async getConfig(): Promise<PackageConfig> {
    if (!this.config) {
      await this.loadConfig();
    }
    return this.config!;
  }

  async updateConfig(updates: Partial<PackageConfig>): Promise<void> {
    if (!this.config) {
      await this.loadConfig();
    }
    
    this.config = { ...this.config!, ...updates };
    await this.saveConfig();
    this.logger.success('✅ Configuration updated');
  }
}`,
      },
    ],
  },
];

const ExamplesPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('package-structure');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  React.useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode ? 'dark' : 'light'
    );
  }, [isDarkMode]);

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const activeExampleSection = EXAMPLE_SECTIONS.find(
    (section) => section.id === activeSection
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <Link href="/">
        <header className="border-b border-border bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">🥷</div>
                <div>
                  <h1 className="text-2xl font-bold text-primary">
                    Shuriken CLI
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Developer Examples & Documentation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-md hover:bg-accent transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>
      </Link>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            📚 Developer Examples
          </h2>
          <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-lg">
            Learn how to extend Shuriken CLI with custom packages, commands, and
            utilities. These examples will help you build powerful CLI tools for
            your organization.
          </p>
        </section>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-4 sticky top-24">
              <h3 className="font-semibold mb-4 text-primary">📖 Sections</h3>
              <ul className="space-y-2">
                {EXAMPLE_SECTIONS.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <span className="mr-2">{section.icon}</span>
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {activeExampleSection && (
              <div>
                {/* Section Header */}
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">
                      {activeExampleSection.icon}
                    </span>
                    <h2 className="text-2xl font-bold text-primary">
                      {activeExampleSection.title}
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-lg">
                    {activeExampleSection.description}
                  </p>
                </div>

                {/* Examples */}
                <div className="space-y-8">
                  {activeExampleSection.examples.map((example, index) => (
                    <div
                      key={index}
                      className="bg-card border border-border rounded-lg overflow-hidden"
                    >
                      {/* Example Header */}
                      <div className="bg-muted px-6 py-4 border-b border-border">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg text-primary">
                              {example.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1">
                              {example.description}
                            </p>
                            {example.filename && (
                              <p className="text-xs font-mono mt-2 text-blue-600 dark:text-blue-400">
                                📁 {example.filename}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                example.code,
                                `${activeSection}-${index}`
                              )
                            }
                            className="p-2 rounded-md hover:bg-accent transition-colors"
                            title="Copy code"
                          >
                            {copiedCode === `${activeSection}-${index}` ? (
                              <span className="text-green-500">✅</span>
                            ) : (
                              <span>📋</span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Code Block */}
                      <div className="relative">
                        <pre className="overflow-x-auto p-6 text-sm font-mono bg-card">
                          <code className="language-typescript">
                            {example.code}
                          </code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Quick Start Section */}
        <section className="mt-16 bg-card border border-border rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              🚀 Quick Start
            </h2>
            <p className="text-muted-foreground">
              Ready to create your first package? Follow these steps:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Scaffold Package</h3>
              <p className="text-muted-foreground text-sm">
                Run{' '}
                <code className="bg-muted px-2 py-1 rounded">
                  pnpm run prepare-package
                </code>{' '}
                to create a new package structure
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Add Commands</h3>
              <p className="text-muted-foreground text-sm">
                Create command files in the{' '}
                <code className="bg-muted px-2 py-1 rounded">commands/</code>{' '}
                directory following our examples
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Test & Use</h3>
              <p className="text-muted-foreground text-sm">
                Run{' '}
                <code className="bg-muted px-2 py-1 rounded">
                  shuriken your-package command
                </code>{' '}
                to test your new CLI tools
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="border-t border-border pt-8">
            <p className="text-muted-foreground">
              Need help? Check out our{' '}
              <a
                href="https://github.com/soheilnikroo/shuriken"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub repository
              </a>{' '}
              or join our community discussions.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ExamplesPage;
