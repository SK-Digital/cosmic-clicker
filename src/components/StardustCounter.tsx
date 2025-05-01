import React, { useEffect, useRef, useState } from 'react';
import { formatNumber } from '../utils/gameUtils';
import { useGame } from '../context/GameContext';
import { Star, Zap } from 'lucide-react';

interface StardustCounterProps {
  eventMultiplier?: number;
}

const StardustCounter: React.FC<StardustCounterProps> = ({ eventMultiplier = 1 }) => {
  const { state } = useGame();
  const [displayValue, setDisplayValue] = useState(state.stardust);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const prevValueRef = useRef(state.stardust);
  
  useEffect(() => {
    if (state.stardust > prevValueRef.current) {
      setIsIncreasing(true);
      setTimeout(() => setIsIncreasing(false), 300);
    }
    
    const animateValue = (start: number, end: number, duration: number) => {
      let startTimestamp: number | null = null;
      
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        setDisplayValue(value);
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      
      window.requestAnimationFrame(step);
    };
    
    if (Math.abs(state.stardust - prevValueRef.current) > 0.1) {
      animateValue(prevValueRef.current, state.stardust, 200);
    } else {
      setDisplayValue(state.stardust);
    }
    
    prevValueRef.current = state.stardust;
  }, [state.stardust]);

  return (
    <div className="p-6 transition-all duration-300 bg-indigo-900/40 rounded-2xl shadow-xl border border-indigo-400/30 ring-1 ring-indigo-200/10 backdrop-blur-sm">
      <div className="space-y-4">
        {/* Stardust Counter */}
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <div className={`
            text-2xl font-bold
            bg-clip-text text-transparent
            bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300
            transition-transform duration-300
            ${isIncreasing ? 'scale-110' : 'scale-100'}
          `}>
            {formatNumber(displayValue)}
          </div>
        </div>
        
        {/* Passive Income */}
        <div className="flex items-center gap-2 text-indigo-200">
          <Zap className="w-4 h-4" />
          <div className="text-sm">
            {formatNumber(state.passiveIncome * eventMultiplier)}/sec
          </div>
        </div>
        
        {/* Click Power */}
        <div className="pt-2 space-y-2 border-t border-indigo-800/50">
          <div className="text-sm text-indigo-200">
            Click Power: {formatNumber(state.clickPower * eventMultiplier)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StardustCounter;