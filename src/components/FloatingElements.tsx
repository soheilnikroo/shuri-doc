import { useEffect, useState } from 'react';

const FloatingElements = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Ninja smoke/mist effects */}
      <div
        className="absolute top-32 left-20 w-96 h-96 bg-gradient-to-r from-red-500/5 to-transparent rounded-full blur-3xl animate-pulse opacity-60"
        style={{
          transform: `translateY(${scrollY * 0.4}px) scale(${
            1 + Math.sin(scrollY * 0.01) * 0.3
          })`,
          animationDuration: '3s',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-20 right-32 w-80 h-80 bg-gradient-to-l from-red-400/8 to-transparent rounded-full blur-3xl animate-pulse opacity-40"
        style={{
          transform: `translateY(${scrollY * -0.3}px) scale(${
            1 + Math.cos(scrollY * 0.008) * 0.2
          })`,
          animationDelay: '1.5s',
          animationDuration: '4s',
          filter: 'blur(50px)',
        }}
      />

      {/* Floating shuriken with ninja-like movements */}
      <div
        className="absolute top-40 right-1/4 w-8 h-8 opacity-30 transition-all duration-1000"
        style={{
          transform: `translateY(${scrollY * 0.6}px) translateX(${
            Math.sin(scrollY * 0.01) * 20
          }px) rotate(${scrollY * 0.8}deg)`,
        }}
      >
        <div
          className="w-full h-full bg-red-500/40 transform rotate-45 animate-spin"
          style={{ animationDuration: '8s' }}
        >
          <div className="absolute inset-2 bg-red-600/60 transform -rotate-45"></div>
        </div>
      </div>

      {/* Quick strike lines - appearing and disappearing like ninja movements */}
      <div
        className="absolute top-1/3 left-10 w-32 h-0.5 bg-gradient-to-r from-transparent via-red-500/60 to-transparent opacity-0 animate-pulse"
        style={{
          transform: `translateY(${scrollY * 0.7}px) scaleX(${Math.max(
            0,
            Math.sin(scrollY * 0.02)
          )})`,
          animationDelay: '0.5s',
          animationDuration: '1.5s',
        }}
      />
      <div
        className="absolute bottom-1/3 right-20 w-24 h-0.5 bg-gradient-to-l from-transparent via-red-400/50 to-transparent opacity-0 animate-pulse"
        style={{
          transform: `translateY(${scrollY * -0.5}px) scaleX(${Math.max(
            0,
            Math.cos(scrollY * 0.015)
          )})`,
          animationDelay: '2s',
          animationDuration: '2s',
        }}
      />

      {/* Stealth particles - small dots that fade in and out */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-red-500/40 rounded-full opacity-0"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 12}%`,
            transform: `translateY(${scrollY * (0.2 + i * 0.1)}px)`,
            animation: `pulse ${2 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* Ninja blade slashes - diagonal lines with quick animations */}
      <div
        className="absolute top-60 right-1/3 w-0.5 h-16 bg-gradient-to-b from-red-500/0 via-red-500/70 to-red-500/0 opacity-0 transform rotate-45"
        style={{
          animation: 'flash 3s ease-in-out infinite',
          animationDelay: '1s',
          transform: `rotate(45deg) translateY(${
            scrollY * 0.4
          }px) scaleY(${Math.max(0.1, Math.sin(scrollY * 0.01) + 0.5)})`,
        }}
      />
      <div
        className="absolute bottom-40 left-1/3 w-0.5 h-20 bg-gradient-to-t from-red-400/0 via-red-400/60 to-red-400/0 opacity-0 transform -rotate-45"
        style={{
          animation: 'flash 4s ease-in-out infinite',
          animationDelay: '2.5s',
          transform: `rotate(-45deg) translateY(${
            scrollY * -0.3
          }px) scaleY(${Math.max(0.1, Math.cos(scrollY * 0.008) + 0.5)})`,
        }}
      />

      {/* Mystical orbs with ninja energy */}
      <div
        className="absolute top-1/2 left-1/4 w-6 h-6 rounded-full bg-red-500/30 shadow-lg shadow-red-500/50"
        style={{
          transform: `translateY(${scrollY * -0.4}px) translateX(${
            Math.sin(scrollY * 0.02) * 30
          }px)`,
          animation:
            'pulse 2s ease-in-out infinite, bounce 4s ease-in-out infinite',
          filter: 'blur(1px)',
        }}
      />

      {/* Shadow trails */}
      <div
        className="absolute top-3/4 right-1/4 w-16 h-1 bg-gradient-to-r from-red-900/0 via-red-900/30 to-red-900/0 opacity-60"
        style={{
          transform: `translateY(${scrollY * 0.2}px) skew(${
            Math.sin(scrollY * 0.01) * 10
          }deg)`,
          animation: 'fadeInOut 5s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes flash {
          0%,
          90% {
            opacity: 0;
          }
          45%,
          55% {
            opacity: 1;
          }
        }

        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0;
            transform: scaleX(0);
          }
          50% {
            opacity: 0.6;
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingElements;
