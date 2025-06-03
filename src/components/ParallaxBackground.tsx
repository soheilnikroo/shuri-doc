import { useEffect, useState } from 'react';

const ParallaxBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Floating shuriken shapes */}
      <div
        className="absolute top-20 left-20 w-16 h-16 border-2 border-red-300 dark:border-red-700 rotate-45 opacity-20"
        style={{
          transform: `translateY(${scrollY * 0.2}px) rotate(${
            45 + scrollY * 0.1
          }deg)`,
        }}
      />
      <div
        className="absolute top-40 right-32 w-12 h-12 border-2 border-red-400 dark:border-red-600 rotate-12 opacity-30"
        style={{
          transform: `translateY(${scrollY * -0.15}px) rotate(${
            12 + scrollY * -0.08
          }deg)`,
        }}
      />
      <div
        className="absolute bottom-32 left-1/3 w-20 h-20 border-2 border-red-500 dark:border-red-500 -rotate-12 opacity-25"
        style={{
          transform: `translateY(${scrollY * 0.1}px) rotate(${
            -12 + scrollY * 0.05
          }deg)`,
        }}
      />
      <div
        className="absolute top-1/2 right-20 w-8 h-8 border-2 border-red-300 dark:border-red-700 rotate-45 opacity-40"
        style={{
          transform: `translateY(${scrollY * -0.25}px) rotate(${
            45 + scrollY * -0.12
          }deg)`,
        }}
      />
      <div
        className="absolute bottom-1/4 left-20 w-14 h-14 border-2 border-red-400 dark:border-red-600 opacity-20"
        style={{
          transform: `translateY(${scrollY * 0.18}px) rotate(${
            scrollY * 0.06
          }deg)`,
        }}
      />
    </div>
  );
};

export default ParallaxBackground;
