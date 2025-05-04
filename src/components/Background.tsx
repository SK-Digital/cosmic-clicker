import React from 'react';

const STAR_COUNT = 90;
const STAR_IMG = '/icons/star.png';

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

const stars = Array.from({ length: STAR_COUNT }).map((_, i) => ({
  left: `${randomBetween(0, 100)}vw`,
  top: `${randomBetween(0, 100)}vh`,
  size: randomBetween(18, 32),
  rotate: randomBetween(0, 360),
  key: `star-${i}`,
}));

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-0" style={{
      background: 'radial-gradient(ellipse at 60% 40%, #6b21a8 0%, #312e81 100%)',
      overflow: 'hidden',
    }}>
      {stars.map(star => (
        <img
          src={STAR_IMG}
          alt="Star"
          key={star.key}
          style={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            transform: `rotate(${star.rotate}deg)`,
            opacity: 0.92,
            pointerEvents: 'none',
            filter: 'drop-shadow(0 0 6px #fff8) drop-shadow(0 0 12px #fff4)',
          }}
        />
      ))}
    </div>
  );
};

export default Background;