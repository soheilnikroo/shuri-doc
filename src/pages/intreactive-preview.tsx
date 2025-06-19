import Link from '@docusaurus/Link';
import React, { useState, useEffect, useRef } from 'react';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'info';
  content: string;
  timestamp?: string;
}

const DEMO_COMMANDS = {
  help: {
    output: `🥷 SHURIKEN CLI — Available Packages

── UI-KIT ─────────────────────
  setup       Install and configure UI components
  update      Migrate UI components to newer versions
  component   Generate a new UI component

── JARVIS ─────────────────────
  setup       Install and configure AI tools
  component   Generate a React component template
  deploy      Deploy application to production

── BACKEND-TOOLS ──────────────
  setup       Setup backend development environment
  migrate     Run database migrations
  seed        Seed database with test data

Type 'shuriken <package> <command>' to run a command
Type 'clear' to clear the terminal`,
    delay: 50,
  },
  'ui-kit setup': {
    output: `🎯 Setting up UI-KIT package...

✅ Installing dependencies...
✅ Configuring Tailwind CSS...
✅ Setting up component library...
✅ Creating example components...
✅ Running initial build...

🚀 UI-KIT setup completed successfully!
   
📁 Components available in: ./packages/ui-kit/components
📖 Documentation: ./packages/ui-kit/README.md`,
    delay: 80,
  },
  'jarvis component button': {
    output: `🤖 Generating React component: Button

✅ Created ./src/components/Button/Button.tsx
✅ Created ./src/components/Button/Button.module.css
✅ Created ./src/components/Button/Button.test.tsx
✅ Created ./src/components/Button/index.ts
✅ Updated ./src/components/index.ts

🎉 Component 'Button' generated successfully!`,
    delay: 60,
  },
  'backend-tools migrate': {
    output: `⚡ Running database migrations...

✅ Migration 001_create_users_table.sql
✅ Migration 002_create_posts_table.sql  
✅ Migration 003_add_user_roles.sql
✅ Migration 004_create_sessions_table.sql

🎯 All migrations completed successfully!
📊 Database schema is up to date`,
    delay: 70,
  },
  version: {
    output: `🥷 Shuriken CLI v2.1.0
Built with ❤️ for ninja developers`,
    delay: 30,
  },
};

const SUGGESTIONS = [
  'help',
  'ui-kit setup',
  'jarvis component button',
  'backend-tools migrate',
  'version',
  'clear',
];

const formatTime = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const TerminalPreview: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: 'info',
      content: '🥷 Welcome to Shuriken CLI Interactive Demo',
      timestamp: formatTime(),
    },
    {
      type: 'info',
      content:
        'Type "help" to see available commands, or try the suggestions below.',
      timestamp: formatTime(),
    },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode ? 'dark' : 'light'
    );
  }, [isDarkMode]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = (line: TerminalLine) => {
    setLines((prev) => [
      ...prev,
      {
        ...line,
        timestamp: line.timestamp || formatTime(),
      },
    ]);
  };

  const typewriterEffect = async (text: string, delay: number = 50) => {
    const words = text.split(' ');
    let currentText = '';

    // Add initial empty line for typewriter effect
    const timestamp = formatTime();
    setLines((prev) => [
      ...prev,
      {
        type: 'output',
        content: '',
        timestamp,
      },
    ]);

    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      setLines((prev) => {
        const newLines = [...prev];
        const lastIndex = newLines.length - 1;
        if (newLines[lastIndex]?.type === 'output') {
          newLines[lastIndex] = {
            type: 'output',
            content: currentText,
            timestamp,
          };
        }
        return newLines;
      });
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  };

  const executeCommand = async (command: string) => {
    const trimmedCommand = command.trim().toLowerCase();

    if (trimmedCommand === 'clear') {
      setLines([
        {
          type: 'info',
          content: '🥷 Terminal cleared',
          timestamp: formatTime(),
        },
      ]);
      return;
    }

    if (trimmedCommand === '') return;

    // Add command to history
    setCommandHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);

    // Add input line
    addLine({
      type: 'input',
      content: `$ shuriken ${command}`,
    });

    setIsProcessing(true);

    // Find matching command - normalize the command for comparison
    const normalizedCommand = trimmedCommand.replace(/\s+/g, ' ').trim();
    const matchedCommand = Object.entries(DEMO_COMMANDS).find(([key]) => {
      const normalizedKey = key.replace(/\s+/g, ' ').trim();
      return (
        normalizedCommand === normalizedKey ||
        normalizedCommand.startsWith(normalizedKey + ' ')
      );
    });

    // Add a small delay to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (matchedCommand) {
      const [, config] = matchedCommand;
      await typewriterEffect(config.output, config.delay);
    } else {
      addLine({
        type: 'error',
        content: `❌ Command not found: ${command}\nType 'help' to see available commands.`,
      });
    }

    setIsProcessing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!isProcessing && currentInput.trim()) {
        executeCommand(currentInput);
        setCurrentInput('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isProcessing) {
      setCurrentInput(suggestion);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="mi  n-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <Link href="/">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">🥷</div>
                <div>
                  <h1 className="text-3xl font-bold text-primary">
                    Shuriken CLI
                  </h1>
                  <p className="text-muted-foreground">
                    A ninja-inspired, modular CLI framework
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            Interactive Terminal Demo
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience Shuriken CLI's power through this interactive terminal.
            Try the commands below or type "help" to explore all features.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Terminal */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg">
              {/* Terminal Header */}
              <div className="bg-muted px-4 py-3 flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-muted-foreground text-sm font-mono ml-4">
                  shuriken-terminal
                </span>
              </div>

              {/* Terminal Content */}
              <div
                ref={terminalRef}
                className="bg-card p-4 h-96 overflow-y-auto font-mono text-sm"
              >
                {lines.map((line, index) => (
                  <div key={index} className="mb-2 leading-relaxed">
                    <div className="flex items-start space-x-2">
                      {line.timestamp && (
                        <span className="text-muted-foreground text-xs mt-0.5 min-w-[70px] font-mono">
                          {line.timestamp}
                        </span>
                      )}
                      <div
                        className={`flex-1 whitespace-pre-wrap ${
                          line.type === 'input'
                            ? 'text-primary font-semibold'
                            : line.type === 'error'
                            ? 'text-destructive'
                            : line.type === 'info'
                            ? 'text-blue-500'
                            : 'text-foreground'
                        }`}
                      >
                        {line.content}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Input Line */}
                <div className="flex items-center space-x-2 mt-4">
                  <span className="text-muted-foreground text-xs min-w-[70px] font-mono">
                    {formatTime()}
                  </span>
                  <span className="text-primary font-semibold">$ shuriken</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isProcessing}
                    className="flex-1 bg-transparent border-none outline-none text-foreground"
                    placeholder={
                      isProcessing ? 'Processing...' : 'Enter command...'
                    }
                    autoFocus
                  />
                  {isProcessing && (
                    <div className="animate-spin text-primary">⚡</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Commands */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-4 text-primary">
                🚀 Try These Commands
              </h3>
              <div className="space-y-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isProcessing}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-4 text-primary">
                ✨ Key Features
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Modular Architecture</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Lazy Command Loading</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Built-in Migrations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Package Scaffolding</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>TypeScript Powered</span>
                </li>
              </ul>
            </div>

            {/* Quick Stats */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-4 text-primary">
                📊 Quick Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commands Run:</span>
                  <span className="font-mono">{commandHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Terminal Lines:</span>
                  <span className="font-mono">{lines.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Theme:</span>
                  <span className="font-mono">
                    {isDarkMode ? 'Dark' : 'Light'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="border-t border-border pt-8">
            <p className="text-muted-foreground">
              Built with ❤️ for ninja developers •
              <a
                href="https://github.com/soheilnikroo/shuriken"
                className="text-primary hover:underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TerminalPreview;
