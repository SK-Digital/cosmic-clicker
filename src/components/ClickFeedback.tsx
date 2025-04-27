import React, { useEffect, useState } from 'react';
import { formatNumber } from '../utils/gameUtils';

interface ClickFeedbackProps {
  x: number;
  y: number;
  value: number;
  onComplete: () => void;
}

const ClickFeedback: React.FC<ClickFeedbackProps> = ({ x, y, value, onComplete }) => {
  const [position] = useState(() => ({
    x: x + (Math.random() * 40 - 20), // Random offset ±20px
    y: y + (Math.random() * 40 - 20),
  }));

  useEffect(() => {
    const timer = setTimeout(onComplete, 500); // Match animation duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="absolute pointer-events-none select-none z-50 animate-float-up"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <span className="text-white/80 font-medium text-base">
        +{formatNumber(value)}
      </span>
    </div>
  );
};

export default ClickFeedback;