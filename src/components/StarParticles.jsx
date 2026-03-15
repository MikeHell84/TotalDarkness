import React, { useMemo } from 'react';

export function StarParticles({ isVisible = false, animationDelay = '0s' }) {
  // Generate random star particles
  const particles = useMemo(() => {
    const generateRandomValue = (fn) => fn();
    return Array.from({ length: 100 }, (_, i) => {
      const randomX = generateRandomValue(() => Math.random() * 100);
      const randomY = generateRandomValue(() => Math.random() * 100);
      const randomSize = generateRandomValue(() => Math.random() * 3 + 1);
      const randomDuration = generateRandomValue(() => Math.random() * 3 + 2);
      const randomDelay = generateRandomValue(() => Math.random() * 0.5);
      const randomMoveX = generateRandomValue(() => (Math.random() - 0.5) * 50);
      const randomMoveY = generateRandomValue(() => (Math.random() - 0.5) * 50);
      const randomMoveDuration = generateRandomValue(() => Math.random() * 30 + 50);
      const randomOpacity = generateRandomValue(() => Math.random() * 0.7 + 0.3);

      return {
        id: i,
        x: randomX,
        y: randomY,
        size: randomSize,
        duration: randomDuration,
        delay: randomDelay,
        moveX: randomMoveX,
        moveY: randomMoveY,
        moveDuration: randomMoveDuration,
        opacity: randomOpacity
      };
    });
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden ${isVisible ? 'animate-stars-appear' : ''
        }`}
      style={{ animationDelay }}
    >
      <style>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
      {particles.map((particle) => (
        <style key={`drift-${particle.id}`}>{`
          .star-particle-${particle.id} {
            animation: twinkle ${particle.duration}s ease-in-out infinite, 
                       drift-${particle.id} ${particle.moveDuration}s ease-in-out infinite;
            animation-delay: ${particle.delay}s, 0s;
          }
          @keyframes drift-${particle.id} {
            0%, 100% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(${particle.moveX}px, ${particle.moveY}px);
            }
          }
        `}</style>
      ))}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full bg-white star-particle-${particle.id}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity
          }}
        />
      ))}
    </div>
  );
}
