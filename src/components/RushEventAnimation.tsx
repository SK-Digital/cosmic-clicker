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
            className="absolute animate-falling-galaxy-star"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: '14px',
              height: '14px',
              background: 'radial-gradient(circle, #fff 0%, #b6d0ff 60%, transparent 100%)',
              opacity: 0.7,
              animationDelay: `${particle.delay}s`,
              animationDuration: '4s',
              borderRadius: '50%',
              filter: 'brightness(1.5)',
            }}
          />
        ))}
      </div>
    );
  }

  if (event.id === 'blackHoleRift') {
    return (
      <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 transition-opacity duration-1000" />
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