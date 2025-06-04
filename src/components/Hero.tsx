import { ArrowRight, Github, Sparkles, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const NinjaStar = ({
    size = 60,
    className = '',
    style,
  }: {
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      <div
        className="absolute inset-0 animate-spin"
        style={{ animationDuration: '20s' }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
            fill="currentColor"
            className="text-red-500/60 dark:text-red-400/60"
          />
          <path
            d="M12 6L13.5 10.5L18 12L13.5 13.5L12 18L10.5 13.5L6 12L10.5 10.5L12 6Z"
            fill="currentColor"
            className="text-red-600/80 dark:text-red-300/80"
          />
        </svg>
      </div>
    </div>
  );

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    setTimeout(() => setIsVisible(true), 300);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic background with ninja-like elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-red-50/30 to-red-100/50 dark:from-gray-950 dark:via-gray-900 dark:to-red-950/30" />

      {/* Ninja grid pattern that responds to mouse */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(255,0,0,0.03)_25%,rgba(255,0,0,0.03)_26%,transparent_27%,transparent_74%,rgba(255,0,0,0.03)_75%,rgba(255,0,0,0.03)_76%,transparent_77%,transparent),linear-gradient(rgba(255,0,0,0.03)_25%,transparent_25%,transparent_75%,rgba(255,0,0,0.03)_75%,rgba(255,0,0,0.03))] bg-[length:80px_80px]"
          style={{
            transform: `translate(${
              scrollY * 0.1 + mousePosition.x * 0.01
            }px, ${scrollY * 0.05 + mousePosition.y * 0.01}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      </div>

      {/* Floating ninja stars */}
      <NinjaStar
        size={40}
        className="absolute top-20 left-20 opacity-20 hover:opacity-40 transition-opacity duration-300"
        style={{
          transform: `translateY(${scrollY * 0.3}px) rotate(${
            mousePosition.x * 0.1
          }deg)`,
        }}
      />
      <NinjaStar
        size={30}
        className="absolute top-1/3 right-32 opacity-30 hover:opacity-50 transition-opacity duration-300"
        style={{
          transform: `translateY(${scrollY * -0.2}px) rotate(${
            mousePosition.y * 0.1
          }deg)`,
        }}
      />
      <NinjaStar
        size={50}
        className="absolute bottom-1/4 left-1/4 opacity-15 hover:opacity-35 transition-opacity duration-300"
        style={{
          transform: `translateY(${scrollY * 0.15}px) rotate(${
            (mousePosition.x + mousePosition.y) * 0.05
          }deg)`,
        }}
      />

      <div
        className={`container mx-auto px-6 text-center relative z-10 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          {/* Animated Logo with enhanced ninja effects */}
          <div className="mb-12 relative group">
            <div className="w-40 h-40 mx-auto mb-8 relative">
              {/* Ninja aura effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full animate-pulse group-hover:from-red-400/30 group-hover:to-red-500/30 transition-all duration-500" />
              <div
                className="absolute inset-2 bg-gradient-to-r from-red-600/10 to-red-700/10 rounded-full animate-pulse"
                style={{ animationDelay: '0.5s' }}
              />

              {/* Main ninja star */}
              <div className="relative w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <NinjaStar size={80} className="group-hover:animate-bounce" />
              </div>

              {/* Orbiting mini stars */}
              <div
                className="absolute inset-0 animate-spin"
                style={{ animationDuration: '30s' }}
              >
                <NinjaStar
                  size={20}
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 opacity-40"
                />
              </div>
              <div
                className="absolute inset-0 animate-spin"
                style={{
                  animationDuration: '25s',
                  animationDirection: 'reverse',
                }}
              >
                <NinjaStar
                  size={15}
                  className="absolute bottom-0 right-0 opacity-50"
                />
              </div>
            </div>
          </div>

          <h1
            className={`text-7xl md:text-9xl font-black mb-8 bg-gradient-to-r from-red-600 via-red-500 to-red-700 dark:from-red-400 dark:via-red-300 dark:to-red-500 bg-clip-text text-transparent transition-all duration-1000 tracking-tight ${
              isVisible ? 'scale-100' : 'scale-95'
            }`}
            style={{
              textShadow: hoveredButton
                ? '0 0 20px rgba(239, 68, 68, 0.3)'
                : 'none',
              transition: 'text-shadow 0.3s ease',
            }}
          >
            Shuriken
          </h1>

          <p
            className={`text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-8 font-light transition-all duration-1000 delay-300 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-5'
            }`}
          >
            Precision CLI Architecture
          </p>

          <p
            className={`text-lg text-gray-500 dark:text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-5'
            }`}
          >
            Master the art of command-line development with IoC patterns. Swift,
            modular, and deadly accurate.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 transition-all duration-1000 delay-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-5'
            }`}
          >
            <Link href="/docs/tutorial-extras/manage-docs-versions">
              <Button
                size="lg"
                className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 dark:from-red-500 dark:to-red-600 dark:hover:from-red-600 dark:hover:to-red-700 text-white px-12 py-4 text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-red-500/30 rounded-full border-0 overflow-hidden"
                onMouseEnter={() => setHoveredButton('start')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                {/* Ninja strike effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Sparkles className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:rotate-180" />
                Get Started
                <ArrowRight
                  className={`ml-3 h-5 w-5 transition-transform duration-300 ${
                    hoveredButton === 'start' ? 'translate-x-2' : ''
                  }`}
                />
              </Button>
            </Link>

            <Link href="https://github.com/soheilnikroo/shuri-doc">
              <Button
                variant="outline"
                size="lg"
                className="group border-2 border-red-300/50 dark:border-red-700/50 text-red-700 dark:text-red-300 hover:bg-red-50/50 dark:hover:bg-red-950/20 hover:border-red-400 dark:hover:border-red-600 px-12 py-4 text-lg transition-all duration-300 hover:scale-110 rounded-full backdrop-blur-sm relative overflow-hidden"
                onMouseEnter={() => setHoveredButton('github')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <Github className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                View Source
              </Button>
            </Link>
          </div>

          {/* Enhanced interactive stats with ninja effects */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto transition-all duration-1000 delay-900 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-5'
            }`}
          >
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                label: 'Lightning Fast',
                description: 'Zero config setup',
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                label: 'IoC Architecture',
                description: 'Dependency injection',
              },
              {
                icon: '⚡',
                label: 'Modular Design',
                description: 'Plugin ecosystem',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group text-center p-6 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-red-100/50 dark:border-red-800/50 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:border-red-200 dark:hover:border-red-700 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-red-500/10 relative overflow-hidden cursor-pointer"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Ninja slash effect on hover */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                <div className="text-red-600 dark:text-red-400 mb-3 flex justify-center group-hover:scale-125 transition-transform duration-300">
                  {typeof stat.icon === 'string' ? (
                    <span className="text-2xl group-hover:animate-bounce">
                      {stat.icon}
                    </span>
                  ) : (
                    <div
                      className="group-hover:animate-spin"
                      style={{ animationDuration: '1s' }}
                    >
                      {stat.icon}
                    </div>
                  )}
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
