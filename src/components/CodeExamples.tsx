import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Copy, Check, Play, Terminal } from 'lucide-react';
import Link from '@docusaurus/Link';

const CodeExamples = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const examples = [
    {
      title: 'Quick Install',
      description: 'Get started in seconds',
      code: `npm install -g shuriken\n\n# Run the command of your packages\nshuriken <package-name> <command>\n`,
      icon: <Terminal className="h-5 w-5" />,
    },
    {
      title: 'Create Command',
      description: 'IoC pattern in action',
      code: `import type { ICommandDefinition } from '@/types';\n\n export const DeployCommand: ICommandDefinition {\n  name = 'deploy';\n  description = 'Deploy with precision';\n\n  async execute(args: string[]) {\n    console.log('🥷 Deployed!');\n  }\n}`,
      icon: <Play className="h-5 w-5" />,
    },
    {
      title: 'Dependency Injection',
      description: 'Clean architecture',
      code: `@Injectable()\nexport class ApiCommand {\n  constructor(\n    @Inject(HttpService) private http: HttpService,\n    @Inject(Logger) private logger: Logger\n  ) {}\n\n  async execute() {\n    const data = await this.http.get('/api');\n    this.logger.info('Success!');\n  }\n}`,
      icon: <Terminal className="h-5 w-5" />,
    },
    {
      title: 'Registration',
      description: 'Wire everything together',
      code: `const cli = new ShurikenCLI();\n\ncli.container\n  .register(HttpService)\n  .register(Logger)\n  .register(DeployCommand)\n  .register(ApiCommand);\n\ncli.run();`,
      icon: <Play className="h-5 w-5" />,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute('data-index') || '0'
            );
            setVisibleCards((prev) => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll('.code-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <section className="py-32 bg-gradient-to-b from-red-50/30 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-6" ref={sectionRef}>
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-red-700 to-red-500 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent">
            See It In Action
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            From zero to CLI hero in minutes
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-full p-2 border border-red-100 dark:border-red-800">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === index
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                {example.title}
              </button>
            ))}
          </div>
        </div>

        {/* Active code example */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  {examples[activeTab].icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {examples[activeTab].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {examples[activeTab].description}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  copyToClipboard(examples[activeTab].code, activeTab)
                }
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300 hover:scale-110"
              >
                {copiedIndex === activeTab ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-950 dark:bg-black rounded-xl p-6 overflow-x-auto text-sm border border-red-900/20 shadow-inner">
                <code className="text-gray-100 font-mono leading-relaxed">
                  {examples[activeTab].code}
                </code>
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Interactive demo button */}
        <Link href="/intreactive-preview">
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/25"
            >
              <Play className="mr-2 h-5 w-5" />
              Try Interactive Demo
            </Button>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default CodeExamples;
