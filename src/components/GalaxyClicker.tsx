import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import StarParticles from './StarParticles';
import ClickFeedback from './ClickFeedback';

interface ClickFeedbackInstance {
  id: number;
  x: number;
  y: number;
  value: number;
}

const GalaxyClicker: React.FC = () => {
  const { state, dispatch } = useGame();
  const [isClicking, setIsClicking] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 });
  const [clickSound] = useState(() => new Audio('/click-sound.mp3'));
  const [clickFeedbacks, setClickFeedbacks] = useState<ClickFeedbackInstance[]>([]);
  const [nextFeedbackId, setNextFeedbackId] = useState(0);
  
  useEffect(() => {
    clickSound.volume = 0;
    clickSound.play().catch(() => {});
    clickSound.volume = 0.2;
    clickSound.currentTime = 0;
  }, [clickSound]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setParticlePosition({ x, y });
    setShowParticles(true);
    setIsClicking(true);
    
    // Add new click feedback
    setClickFeedbacks(prev => [...prev, {
      id: nextFeedbackId,
      x,
      y,
      value: state.clickPower
    }]);
    setNextFeedbackId(prev => prev + 1);
    
    try {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    } catch (e) {}
    
    dispatch({ type: 'CLICK' });
    
    setTimeout(() => {
      setIsClicking(false);
    }, 150);
    
    setTimeout(() => {
      setShowParticles(false);
    }, 1000);
  }, [dispatch, clickSound, nextFeedbackId, state.clickPower]);

  const handleFeedbackComplete = useCallback((id: number) => {
    setClickFeedbacks(prev => prev.filter(feedback => feedback.id !== id));
  }, []);

  const hasBlackHoleEvent = state.activeEvents?.some(event => event.id === 'blackHoleRift') ?? false;

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
      {showParticles && (
        <StarParticles x={particlePosition.x} y={particlePosition.y} />
      )}
      
      {clickFeedbacks.map(feedback => (
        <ClickFeedback
          key={feedback.id}
          x={feedback.x}
          y={feedback.y}
          value={feedback.value}
          onComplete={() => handleFeedbackComplete(feedback.id)}
        />
      ))}
      
      <div 
        className={`
          relative cursor-pointer w-full h-full rounded-full
          flex items-center justify-center
          bg-gradient-to-br from-indigo-800/40 via-purple-900/40 to-blue-900/40
          before:absolute before:inset-0 before:rounded-full before:bg-black/20
          before:z-0 before:backdrop-blur-sm
          overflow-hidden
          transition-all duration-200 ease-out
          transform ${isClicking ? 'scale-95' : 'scale-100'}
          hover:scale-105 active:scale-95
          hover:shadow-[0_0_30px_5px_rgba(139,92,246,0.5)]
          shadow-[0_0_20px_2px_rgba(139,92,246,0.3)]
          ${hasBlackHoleEvent ? 'animate-pulse' : ''}
        `}
        onClick={handleClick}
      >
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.8)_0%,transparent_70%)]"></div>
        
        <Sparkles
          size={80}
          className={`
            text-indigo-100 opacity-90 z-10
            transition-transform duration-200
            ${isClicking ? 'scale-90' : 'scale-100'}
            animate-pulse
          `}
        />
      </div>
    </div>
  );
};

export default GalaxyClicker;