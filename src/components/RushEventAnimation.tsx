import React, { useEffect, useState } from 'react';
import { RushEvent } from '../context/GameContext';

interface RushEventAnimationProps {
  event: RushEvent;
  onComplete: () => void;
}

const RushEventAnimation: React.FC<RushEventAnimationProps> = ({ event, onComplete }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate particles based on event type
    const newParticles = Array.from({ length: event.id === 'meteorShower' ? 20 : 1 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    
    setParticles(newParticles);
    
    const timer = setTimeout(() => {
      onComplete();
    }, event.duration * 1000);
    
    return () => clearTimeout(timer);
  }, [event, onComplete]);

  if (event.id === 'meteorShower') {
    return (
      <div className="fixed inset-0 pointer-events-none z-30">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute animate-meteor"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s',
              animationIterationCount: 'infinite'
            }}
          >
            <div className="w-1 h-20 bg-gradient-to-r from-transparent via-orange-400 to-white transform -rotate-45 opacity-80" />
            <div className="absolute top-0 left-0 w-2 h-2 bg-orange-400 rounded-full shadow-[0_0_10px_2px_rgba(251,146,60,0.8)]" />
          </div>
        ))}
      </div>
    );
  }

  if (event.id === 'blackHoleRift') {
    return (
      <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-1000" />
        <div className="relative scale-150 transition-transform duration-1000">
          <div className="outer-circle">
            <div className="inner-circle" />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RushEventAnimation