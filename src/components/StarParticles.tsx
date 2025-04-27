import React, { useMemo } from 'react';

interface StarParticlesProps {
  x: number;
  y: number;
}

const StarParticles: React.FC<StarParticlesProps> = ({ x, y }) => {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      angle: (Math.PI * 2 * i) / 12 + Math.random() * 0.5,
      opacity: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  return (
    <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
      {particles.map((particle) => {
        const distance = 50 + Math.random() * 20;
        const endX = x + Math.cos(particle.angle) * distance;
        const endY = y + Math.sin(particle.angle) * distance;
        
        return (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-purple-400 to-indigo-300"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${x}px`,
              top: `${y}px`,
              opacity: particle.opacity,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
              animation: `particle-move ${particle.speed}s forwards cubic-bezier(0.2, 0.8, 0.2, 1)`,
              '--end-x': `${endX}px`,
              '--end-y': `${endY}px`,
            } as React.CSSProperties}
          ></div>
        );
      })}
    </div>
  );
};

export default StarParticles;