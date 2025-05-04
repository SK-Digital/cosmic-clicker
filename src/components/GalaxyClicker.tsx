import React, { useState, useEffect, useCallback, ReactNode } from 'react';
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

interface GalaxyClickerProps {
  eventMultiplier?: number;
  children?: ReactNode;
}

const GalaxyClicker: React.FC<GalaxyClickerProps> = ({ eventMultiplier = 1, children }) => {
  const { state, dispatch } = useGame();
  const [isClicking, setIsClicking] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 });
  const [clickSound] = useState(() => new Audio('/audio/click.mp3'));
  const [clickFeedbacks, setClickFeedbacks] = useState<ClickFeedbackInstance[]>([]);
  const [nextFeedbackId, setNextFeedbackId] = useState(0);
  const SETTINGS_KEY = 'cosmicClickerSettings';
  
  useEffect(() => {
    // Set initial volume from settings
    let sfxVolume = 0.5;
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        sfxVolume = JSON.parse(saved).sfxVolume ?? 0.5;
      }
    } catch {}
    clickSound.volume = sfxVolume;
    clickSound.play().catch(() => {});
    clickSound.currentTime = 0;
  }, [clickSound]);

  // Listen for SFX volume changes in localStorage and custom event
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
          const sfxVolume = JSON.parse(saved).sfxVolume ?? 0.5;
          clickSound.volume = sfxVolume;
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('settingsChanged', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('settingsChanged', handleStorage);
    };
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
      value: state.clickPower * eventMultiplier
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
  }, [dispatch, clickSound, nextFeedbackId, state.clickPower, eventMultiplier]);

  const handleFeedbackComplete = useCallback((id: number) => {
    setClickFeedbacks(prev => prev.filter(feedback => feedback.id !== id));
  }, []);

  const hasBlackHoleEvent = state.activeEvents?.some(event => event.id === 'blackHoleRift') ?? false;

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center bg-transparent">
      {/* Render rush event animation as background layer */}
      {children && (
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          {children}
        </div>
      )}
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
          bg-[radial-gradient(circle_at_60%_40%,rgba(120,80,255,0.25)_0%,rgba(60,30,120,0.5)_60%,rgba(20,10,40,0.9)_100%)]
          before:absolute before:inset-0 before:rounded-full before:bg-none
          before:z-0
          overflow-hidden
          transition-all duration-200 ease-out
          transform ${isClicking ? 'scale-95' : 'scale-100'}
          hover:scale-105 active:scale-95
          shadow-[0_0_60px_10px_rgba(120,80,255,0.25)]
          ${hasBlackHoleEvent ? 'animate-pulse' : ''}
        `}
        onClick={handleClick}
      >
        <img src="/icons/clicker.png" alt="Clicker" className="w-32 h-32 md:w-48 md:h-48 z-10 select-none pointer-events-none" draggable="false" />
      </div>
    </div>
  );
};

export default GalaxyClicker;