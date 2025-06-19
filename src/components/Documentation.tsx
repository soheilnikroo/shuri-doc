import { Book, ExternalLink, FileText, Zap, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useEffect, useState, useRef } from 'react';
import Link from '@docusaurus/Link';

const Documentation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const docSections = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Quick Start',
      description: 'Get up and running in under 5 minutes',
      items: [
        'Installation guide',
        'Your first command',
        'Basic configuration',
        'Common patterns',
      ],
      color: 'red-500',
      gradient: 'from-red-500/10 to-red-600/10',
      href: '/docs/',
    },
    {
      icon: <Book className="h-6 w-6" />,
      title: 'Core Concepts',
      description: 'Understanding the IoC architecture',
      items: [
        'Dependency injection',
        'Command lifecycle',
        'Service registration',
        'Container management',
      ],
      color: 'red-600',
      gradient: 'from-red-600/10 to-red-700/10',
      href: '/docs/concepts',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'API Reference',
      description: 'Complete API documentation',
      items: [
        'Command interface',
        'Decorators reference',
        'Container API',
        'Configuration options',
      ],
      color: 'red-700',
      gradient: 'from-red-700/10 to-red-800/10',
      href: '/docs/commands',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="py-32 bg-gradient-to-b from-white to-red-50/30 dark:from-gray-950 dark:to-gray-900"
      id="docs"
      ref={sectionRef}
    >
      <div className="container mx-auto px-6">
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent">
            Master the Craft
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Everything you need to become a CLI ninja
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {docSections.map((section, index) => (
            <Card
              key={index}
              className={`group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`}
              />

              <CardHeader className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br from-${section.color}/10 to-${section.color}/20 text-${section.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {section.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                      {section.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 group/item"
                    >
                      <div className="w-2 h-2 bg-red-500/60 rounded-full group-hover/item:bg-red-500 transition-colors duration-200"></div>
                      <span className="group-hover/item:translate-x-1 transition-transform duration-200">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href={section.href}>
                  <div
                    className={`mt-6 flex items-center text-red-600 dark:text-red-400 font-medium transition-all duration-300 ${
                      hoveredCard === index ? 'translate-x-2' : ''
                    }`}
                  >
                    Explore docs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Card className="bg-gradient-to-r from-red-50/80 to-red-100/80 dark:from-red-950/20 dark:to-red-900/20 border-0 backdrop-blur-sm shadow-2xl overflow-hidden relative">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-600/5 animate-pulse" />

            <CardHeader className="text-center relative z-10">
              <CardTitle className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                Ready to Begin?
              </CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300 text-lg font-light">
                Join thousands of developers building the future of CLI tools
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center relative z-10">
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/docs/">
                  <Button
                    size="lg"
                    className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/25"
                  >
                    <Book className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    Read Full Docs
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link href="/examples">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-red-300/50 dark:border-red-700/50 text-red-700 dark:text-red-300 hover:bg-red-50/50 dark:hover:bg-red-950/20 hover:border-red-400 dark:hover:border-red-600 px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                    <ExternalLink className="mr-3 h-5 w-5" />
                    View Examples
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Documentation;
