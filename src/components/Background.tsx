import React, { useMemo } from 'react';
import { generateRandomStars, generateRandomMeteors } from '../utils/gameUtils';

const Background: React.FC = () => {
  const stars = useMemo(() => generateRandomStars(150), []);
  const meteors = useMemo(() => generateRandomMeteors(5), []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep space background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E0B3D] via-[#2E065D] to-[#3B185F]"></div>
      
      {/* Nebula effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(111,66,193,0.5)_0%,transparent_60%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(56,189,248,0.5)_0%,transparent_60%)]"></div>
        <div className="absolute top-1/3 right-1/4 w-full h-full bg-[radial-gradient(circle_at_70%_40%,rgba(192,132,252,0.4)_0%,transparent_50%)]"></div>
      </div>
      
      {/* Stars */}
      <div className="absolute inset-0">
        {stars.map((star) => (
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
          ></div>
        ))}
      </div>
      
      {/* Meteors */}
      <div className="absolute inset-0 overflow-hidden">
        {meteors.map((meteor) => (
          <div 
            key={meteor.id}
            className="absolute animate-meteor"
            style={{
              left: `${meteor.startX}%`,
              top: `${meteor.startY}%`,
              opacity: meteor.opacity,
              animationDuration: `${meteor.speed}s`,
              animationDelay: `${meteor.delay}s`,
              transformOrigin: 'top left',
              transform: `rotate(${meteor.angle}deg)`,
            }}
          >
            <div 
              className="w-1 bg-gradient-to-r from-transparent via-blue-300 to-white"
              style={{
                height: `${meteor.size}px`,
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Background;