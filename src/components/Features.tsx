import { Zap, Puzzle, Shield, Code, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { useEffect, useState, useRef } from 'react';

const Features = () => {
  const [visibleFeatures, setVisibleFeatures] = useState<boolean[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: <Puzzle className="h-8 w-8" />,
      title: 'IoC Architecture',
      description:
        'Built on Inversion of Control principles for maximum flexibility and testability.',
      color: 'red-500',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Lightning Fast',
      description:
        'Add new commands in seconds with our modular design and hot-reload capabilities.',
      color: 'red-600',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Battle-Tested',
      description:
        'Production-ready with comprehensive error handling and graceful failures.',
      color: 'red-700',
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: 'Developer First',
      description:
        'Intuitive API with TypeScript support and comprehensive documentation.',
      color: 'red-800',
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
            setVisibleFeatures((prev) => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const featureCards = featuresRef.current?.querySelectorAll('.feature-card');
    featureCards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-32 bg-gradient-to-b from-white to-red-50/30 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-6" ref={featuresRef}>
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent">
            Why Shuriken?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Precision-engineered for modern CLI development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              data-index={index}
              className={`feature-card group relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer ${
                visibleFeatures[index]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-${feature.color}/5 to-${feature.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <CardContent className="p-8 relative z-10">
                <div className="flex items-start gap-6">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br from-${feature.color}/10 to-${feature.color}/20 text-${feature.color} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <div
                      className={`flex items-center text-red-600 dark:text-red-400 font-medium transition-all duration-300 ${
                        hoveredCard === index ? 'translate-x-2' : ''
                      }`}
                    >
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
