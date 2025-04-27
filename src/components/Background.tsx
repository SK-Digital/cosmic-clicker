import React, { useMemo } from 'react';
import { generateRandomStars } from '../utils/gameUtils';

const generateFallingStars = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: Math.random() * 20, // start near the top
    size: Math.random() * 8 + 8, // 8-16px for soft glow
    opacity: Math.random() * 0.5 + 0.5,
    speed: Math.random() * 6 + 4, // 4-10s
    delay: Math.random() * 10,
    color: Math.random() > 0.5 ? '#e0eaff' : '#b6d0ff',
  }));
};

const Background: React.FC = () => {
  const stars = useMemo(() => generateRandomStars(180), []);
  const bigStars = useMemo(() => generateRandomStars(8).map(s => ({ ...s, size: Math.random() * 8 + 8, opacity: 0.3 + Math.random() * 0.5 })), []);
  const fallingStars = useMemo(() => generateFallingStars(3), []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep space background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E0B3D] via-[#2E065D] to-[#3B185F]" />
      {/* Nebula overlays - now all full viewport, feathered to 100% transparent at edges */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(111,66,193,0.22)_0%,rgba(111,66,193,0.12)_60%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.13)_0%,rgba(56,189,248,0.07)_60%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(192,132,252,0.10)_0%,rgba(192,132,252,0.04)_60%,transparent_100%)]" />
      </div>
      {/* Faint starfield */}
      <div className="absolute inset-0">
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.animationDelay}s`,
            }}
          />
        ))}
      </div>
      {/* Big glowing stars */}
      <div className="absolute inset-0">
        {bigStars.map(star => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: 'radial-gradient(circle, #fff 0%, #b6d0ff 60%, transparent 100%)',
              opacity: star.opacity,
              filter: 'brightness(1.2)',
            }}
          />
        ))}
      </div>
      {/* Falling stars (soft glowing dots) */}
      <div className="absolute inset-0">
        {fallingStars.map(star => (
          <div
            key={star.id}
            className="absolute animate-falling-galaxy-star"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: `radial-gradient(circle, #fff 0%, ${star.color} 60%, transparent 100%)`,
              opacity: star.opacity,
              animationDuration: `${star.speed}s`,
              animationDelay: `${star.delay}s`,
              borderRadius: '50%',
              filter: 'brightness(1.5)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Background;