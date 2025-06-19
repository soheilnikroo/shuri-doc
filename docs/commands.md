---
sidebar_position: 5
title: Commands
description: Master the art of creating powerful CLI commands
---

# ⚡ Commands

Commands are the heart of your Shuriken CLI packages. Learn how to create powerful, user-friendly commands that handle complex workflows with ease.

## Command Anatomy

Every command in Shuriken CLI follows this structure:

```typescript
import type { ICommandDefinition } from '@/types';
import { injectable, inject } from 'inversify';

@injectable()
export class MyCommand implements ICommandHandler {
  constructor(@inject('Logger') private logger: Logger) {}

  async execute(options: any, context: IProjectContext): Promise<void> {
    // Command implementation
  }
}

const myCommand: ICommandDefinition = {
  name: 'my-command',
  description: 'Does something awesome',
  options: [], // Command options
  arguments: [], // Command arguments
  handler: MyCommand,
};

export default myCommand;
```

## Command Definition Interface

```typescript
interface ICommandDefinition {
  name: string; // Command name
  description: string; // Help text description
  options?: ICommandOption[]; // Optional flags
  arguments?: ICommandArgument[]; // Positional arguments
  handler: new (...args: any[]) => ICommandHandler; // Command class
  hidden?: boolean; // Hide from help
  aliases?: string[]; // Alternative names
}
```

## Command Options

Options are flags that modify command behavior:

### Basic Options

```typescript
const options: ICommandOption[] = [
  {
    name: 'env', // --env
    alias: 'e', // -e (short alias)
    type: 'string', // Value type
    description: 'Environment to deploy to',
    required: false, // Optional by default
    default: 'production', // Default value
  },
  {
    name: 'verbose', // --verbose
    alias: 'v', // -v
    type: 'boolean', // Boolean flag
    description: 'Enable verbose logging',
    default: false,
  },
  {
    name: 'port', // --port
    alias: 'p', // -p
    type: 'number', // Numeric value
    description: 'Port number to use',
    default: 3000,
  },
];
```

### Advanced Options

```typescript
const advancedOptions: ICommandOption[] = [
  {
    name: 'format',
    type: 'string',
    description: 'Output format',
    choices: ['json', 'yaml', 'table'], // Restrict to specific values
    default: 'table',
  },
  {
    name: 'config',
    type: 'string',
    description: 'Path to config file',
    required: true, // Required option
    validate: (value: string) => {
      // Custom validation
      return value.endsWith('.json') || 'Config must be a JSON file';
    },
  },
  {
    name: 'include',
    type: 'array', // Array of strings
    description: 'Files to include',
    default: [],
  },
];
```

## Command Arguments

Arguments are positional parameters:

```typescript
const arguments: ICommandArgument[] = [
  {
    name: 'component-name', // First argument
    description: 'Name of the component',
    required: true, // Must be provided
    validate: (value: string) => {
      return /^[A-Z][a-zA-Z0-9]*$/.test(value) || 'Must be PascalCase';
    },
  },
  {
    name: 'output-dir', // Second argument
    description: 'Output directory',
    required: false, // Optional argument
    default: './src/components',
  },
];
```

## Command Types

### 1. Simple Commands

Basic commands that perform a single task:

```typescript
@injectable()
export class BuildCommand {
  constructor(
    @inject('Logger') private logger: Logger,
    @inject('ProcessService') private process: ProcessService
  ) {}

  async execute(options: any, context: IProjectContext): Promise<void> {
    this.logger.info('🔨 Building project...');

    const buildCommand = options.watch ? 'build:watch' : 'build';
    await this.process.run('npm', ['run', buildCommand], {
      cwd: context.workingDirectory,
    });

    this.logger.success('✅ Build completed!');
  }
}
```

### 2. Interactive Commands

Commands that prompt users for input:

```typescript
@injectable()
export class GenerateCommand {
  constructor(
    @inject('Logger') private logger: Logger,
    @inject('PromptService') private prompt: PromptService,
    @inject('FileService') private fileService: FileService
  ) {}

  async execute(options: any, context: IProjectContext): Promise<void> {
    // Gather requirements through prompts
    const config = await this.gatherRequirements(options);

    // Generate files based on config
    await this.generateFiles(config, context);

    this.logger.success('✅ Generation completed!');
  }

  private async gatherRequirements(options: any): Promise<any> {
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
        when: !options.name,
        validate: (input: string) => {
          if (!input.trim()) return 'Name is required';
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) return 'Must be PascalCase';
          return true;
        },
      },
      {
        type: 'list',
        name: 'type',
        message: 'Component type:',
        choices: [
          { name: 'Functional Component', value: 'functional' },
          { name: 'Class Component', value: 'class' },
          { name: 'Custom Hook', value: 'hook' },
        ],
        default: 'functional',
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Include features:',
        choices: [
          { name: 'TypeScript', value: 'typescript', checked: true },
          { name: 'CSS Modules', value: 'styles' },
          { name: 'Unit Tests', value: 'tests', checked: true },
          { name: 'Storybook Stories', value: 'stories' },
        ],
      },
    ];

    return this.prompt.ask(questions);
  }

  private async generateFiles(
    config: any,
    context: IProjectContext
  ): Promise<void> {
    const outputDir = path.join(
      context.workingDirectory,
      'src/components',
      config.name
    );

    // Create component directory
    await this.fileService.ensureDir(outputDir);

    // Generate main component file
    const componentContent = this.generateComponentContent(config);
    await this.fileService.writeFile(
      path.join(
        outputDir,
        `${config.name}.${
          config.features.includes('typescript') ? 'tsx' : 'jsx'
        }`
      ),
      componentContent
    );

    // Generate additional files based on features
    if (config.features.includes('styles')) {
      await this.generateStylesFile(outputDir, config.name);
    }

    if (config.features.includes('tests')) {
      await this.generateTestFile(outputDir, config);
    }

    if (config.features.includes('stories')) {
      await this.generateStoryFile(outputDir, config);
    }
  }
}
```

### 3. File Processing Commands

Commands that work with files and directories:

```typescript
@injectable()
export class MigrateCommand {
  constructor(
    @inject('Logger') private logger: Logger,
    @inject('FileService') private fileService: FileService
  ) {}

  async execute(options: any, context: IProjectContext): Promise<void> {
    const sourceDir = path.join(context.workingDirectory, 'src');

    // Find all files to migrate
    const jsFiles = await this.fileService.glob('**/*.{js,jsx}', {
      cwd: sourceDir,
      absolute: true,
    });

    this.logger.info(`📁 Found ${jsFiles.length} JavaScript files to migrate`);

    // Process files in batches
    const batchSize = 10;
    for (let i = 0; i < jsFiles.length; i += batchSize) {
      const batch = jsFiles.slice(i, i + batchSize);
      await this.processBatch(batch, options);

      this.logger.info(
        `✅ Processed ${Math.min(i + batchSize, jsFiles.length)}/${
          jsFiles.length
        } files`
      );
    }

    this.logger.success('🎉 Migration completed successfully!');
  }

  private async processBatch(files: string[], options: any): Promise<void> {
    const promises = files.map((file) => this.migrateFile(file, options));
    await Promise.all(promises);
  }

  private async migrateFile(filePath: string, options: any): Promise<void> {
    try {
      const content = await this.fileService.readFile(filePath);
      const migratedContent = this.applyMigrations(content, options);

      // Rename .js to .ts / .jsx to .tsx
      const newPath = filePath.replace(/\.jsx?$/, (match) =>
        match === '.js' ? '.ts' : '.tsx'
      );

      await this.fileService.writeFile(newPath, migratedContent);

      if (newPath !== filePath) {
        await this.fileService.remove(filePath);
      }
    } catch (error) {
      this.logger.error(`❌ Failed to migrate ${filePath}: ${error.message}`);
      if (!options.continueOnError) {
        throw error;
      }
    }
  }
}
```

### 4. API Integration Commands

Commands that interact with external services:

```typescript
@injectable()
export class DeployCommand {
  constructor(
    @inject('Logger') private logger: Logger,
    @inject('HttpService') private http: HttpService,
    @inject('ConfigService') private config: ConfigService
  ) {}

  async execute(options: any, context: IProjectContext): Promise<void> {
    // Authenticate with deployment service
    const apiKey = await this.config.get('deploy.apiKey');
    if (!apiKey) {
      throw new Error('API key not configured. Run setup first.');
    }

    // Build the project
    this.logger.info('🔨 Building project for deployment...');
    await this.buildProject(context);

    // Create deployment
    this.logger.info('🚀 Creating deployment...');
    const deployment = await this.createDeployment(apiKey, options);

    // Monitor deployment status
    this.logger.info('⏳ Monitoring deployment...');
    await this.monitorDeployment(deployment.id, apiKey);

    this.logger.success(`🎉 Deployed successfully to ${deployment.url}`);
  }

  private async createDeployment(apiKey: string, options: any): Promise<any> {
    const response = await this.http.post(
      '/deployments',
      {
        environment: options.env,
        branch: options.branch || 'main',
        buildCommand: options.buildCommand || 'npm run build',
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data;
  }

  private async monitorDeployment(
    deploymentId: string,
    apiKey: string
  ): Promise<void> {
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await this.getDeploymentStatus(deploymentId, apiKey);

      if (status === 'success') {
        return;
      } else if (status === 'failed') {
        throw new Error('Deployment failed');
      }

      // Wait 5 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 5000));
      attempts++;
    }

    throw new Error('Deployment timeout');
  }
}
```

## Command Validation

### Input Validation

```typescript
export class ValidatedCommand {
  async execute(options: any, context: IProjectContext): Promise<void> {
    // Validate environment
    await this.validateEnvironment(context);

    // Validate options
    this.validateOptions(options);

    // Validate project state
    await this.validateProjectState(context);

    // Execute command
    await this.executeCommand(options, context);
  }

  private validateOptions(options: any): void {
    // Validate port number
    if (options.port && (options.port < 1 || options.port > 65535)) {
      throw new ValidationError('Port must be between 1 and 65535');
    }

    // Validate environment
    const validEnvs = ['development', 'staging', 'production'];
    if (options.env && !validEnvs.includes(options.env)) {
      throw new ValidationError(
        `Invalid environment: ${options.env}. Must be one of: ${validEnvs.join(
          ', '
        )}`
      );
    }

    // Validate file paths
    if (options.config && !path.isAbsolute(options.config)) {
      options.config = path.resolve(process.cwd(), options.config);
    }
  }

  private async validateProjectState(context: IProjectContext): Promise<void> {
    // Check if package.json exists
    const packageJsonPath = path.join(context.workingDirectory, 'package.json');
    if (!(await this.fileService.exists(packageJsonPath))) {
      throw new ValidationError(
        'No package.json found. Are you in a valid project directory?'
      );
    }

    // Validate package.json content
    const packageJson = await this.fileService.readJson(packageJsonPath);
    if (!packageJson.name) {
      throw new ValidationError('package.json must have a name field');
    }
  }
}
```

### Custom Validation Rules

```typescript
const commandOptions: ICommandOption[] = [
  {
    name: 'email',
    type: 'string',
    description: 'Email address',
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) || 'Please enter a valid email address';
    },
  },
  {
    name: 'version',
    type: 'string',
    description: 'Version number',
    validate: (value: string) => {
      const semverRegex = /^\d+\.\d+\.\d+$/;
      return (
        semverRegex.test(value) || 'Version must be in semver format (x.y.z)'
      );
    },
  },
];
```

## Error Handling

### Graceful Error Handling

```typescript
export class RobustCommand {
  async execute(options: any, context: IProjectContext): Promise<void> {
    try {
      await this.performOperation(options, context);
    } catch (error) {
      await this.handleError(error, options, context);
    }
  }

  private async handleError(
    error: Error,
    options: any,
    context: IProjectContext
  ): Promise<void> {
    if (error instanceof ValidationError) {
      this.logger.error(`❌ ${error.message}`);
      this.showSuggestions(error.suggestions);
    } else if (error.code === 'ENOENT') {
      this.logger.error(`❌ File not found: ${error.path}`);
      this.logger.info(
        '💡 Make sure the file exists and you have read permissions'
      );
    } else if (error.code === 'EACCES') {
      this.logger.error('❌ Permission denied');
      this.logger.info(
        '💡 Try running the command with appropriate permissions'
      );
    } else {
      this.logger.error(`❌ Unexpected error: ${error.message}`);

      if (options.debug) {
        this.logger.debug('Stack trace:', error.stack);
      } else {
        this.logger.info('💡 Run with --debug for more details');
      }
    }

    process.exit(1);
  }

  private showSuggestions(suggestions: string[]): void {
    if (suggestions.length > 0) {
      this.logger.info('💡 Suggestions:');
      suggestions.forEach((suggestion, index) => {
        this.logger.info(`   ${index + 1}. ${suggestion}`);
      });
    }
  }
}
```

## Progress Indicators

### Long-Running Operations

```typescript
import { createSpinner } from 'nanospinner';

export class ProgressCommand {
  async execute(options: any, context: IProjectContext): Promise<void> {
    const spinner = createSpinner('Initializing...').start();

    try {
      // Step 1: Setup
      spinner.update({ text: 'Setting up environment...' });
      await this.setupEnvironment();

      // Step 2: Process files
      spinner.update({ text: 'Processing files...' });
      await this.processFiles();

      // Step 3: Cleanup
      spinner.update({ text: 'Cleaning up...' });
      await this.cleanup();

      spinner.success({ text: 'Operation completed successfully!' });
    } catch (error) {
      spinner.error({ text: `Operation failed: ${error.message}` });
      throw error;
    }
  }
}
```

### Progress Bars

```typescript
import { MultiBar, Presets } from 'cli-progress';

export class BatchProcessCommand {
  async execute(options: any, context: IProjectContext): Promise<void> {
    const files = await this.getFilesToProcess();

    // Create progress bar
    const multibar = new MultiBar(
      {
        clearOnComplete: false,
        hideCursor: true,
        format: ' {bar} | {filename} | {value}/{total}',
      },
      Presets.shades_classic
    );

    const progressBar = multibar.create(files.length, 0);

    // Process files with progress updates
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      progressBar.update(i + 1, { filename: path.basename(file) });

      await this.processFile(file);
    }

    multibar.stop();
    this.logger.success(`✅ Processed ${files.length} files`);
  }
}
```

## Command Composition

### Calling Other Commands

```typescript
@injectable()
export class WorkflowCommand {
  constructor(
    @inject('CommandManager') private commandManager: CommandManager
  ) {}

  async execute(options: any, context: IProjectContext): Promise<void> {
    // Step 1: Setup
    await this.commandManager.executeCommand('setup', options, context);

    // Step 2: Build
    await this.commandManager.executeCommand(
      'build',
      {
        ...options,
        env: 'production',
      },
      context
    );

    // Step 3: Test
    if (options.runTests) {
      await this.commandManager.executeCommand(
        'test',
        {
          coverage: true,
        },
        context
      );
    }

    // Step 4: Deploy
    if (options.deploy) {
      await this.commandManager.executeCommand(
        'deploy',
        {
          env: options.env || 'staging',
        },
        context
      );
    }
  }
}
```

## Testing Commands

### Unit Tests

```typescript
// commands/__tests__/build.test.ts
import { Container } from 'inversify';
import { BuildCommand } from '../build';
import { Logger } from '@/core/logger';
import { ProcessService } from '@/core/process';

describe('BuildCommand', () => {
  let command: BuildCommand;
  let mockLogger: jest.Mocked<Logger>;
  let mockProcess: jest.Mocked<ProcessService>;

  beforeEach(() => {
    const container = new Container();

    mockLogger = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
    } as any;

    mockProcess = {
      run: jest.fn().mockResolvedValue({ code: 0 }),
    } as any;

    container.bind('Logger').toConstantValue(mockLogger);
    container.bind('ProcessService').toConstantValue(mockProcess);

    command = container.resolve(BuildCommand);
  });

  it('should build successfully', async () => {
    const options = { env: 'production' };
    const context = { workingDirectory: '/test/project' };

    await command.execute(options, context);

    expect(mockLogger.info).toHaveBeenCalledWith('🔨 Building project...');
    expect(mockProcess.run).toHaveBeenCalledWith('npm', ['run', 'build'], {
      cwd: '/test/project',
    });
    expect(mockLogger.success).toHaveBeenCalledWith('✅ Build completed!');
  });

  it('should handle build failures', async () => {
    mockProcess.run.mockRejectedValue(new Error('Build failed'));

    const options = { env: 'production' };
    const context = { workingDirectory: '/test/project' };

    await expect(command.execute(options, context)).rejects.toThrow(
      'Build failed'
    );
  });
});
```

## Best Practices

### 1. User Experience

- **Clear feedback**: Always inform users what's happening
- **Progress indicators**: Show progress for long operations
- **Helpful errors**: Provide actionable error messages
- **Consistent styling**: Use consistent emoji and formatting

### 2. Error Handling

- **Graceful degradation**: Handle errors without crashing
- **Contextual help**: Provide relevant suggestions
- **Debug information**: Include debug mode for troubleshooting
- **Exit codes**: Use appropriate exit codes for different failure types

### 3. Performance

- **Lazy loading**: Only load what's needed
- **Parallel processing**: Use async operations where possible
- **Caching**: Cache expensive operations
- **Memory management**: Clean up resources properly

### 4. Documentation

- **Clear descriptions**: Write helpful command descriptions
- **Example usage**: Include usage examples in help text
- **Option documentation**: Explain all options clearly
- **Migration guides**: Document breaking changes

## Next Steps

Now that you've mastered commands:

1. 🔄 **[Learn Migration System](./migrations)** - Handle version upgrades gracefully
2. 💡 **[Explore Examples](./commands)** - See complete real-world implementations
3. 🌟 **[Follow Best Practices](./best-practices)** - Build maintainable commands
4. 🔧 **[API Reference](./api-reference)** - Dive into the technical details

---

Ready to handle version upgrades like a ninja? Let's learn about migrations! 🥷
