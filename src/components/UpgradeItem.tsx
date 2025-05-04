import React from 'react';
import { Star, Cloud, Orbit, Rocket } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Upgrade } from '../context/GameContext';
import { calculateBulkUpgradeCost, formatNumber } from '../utils/gameUtils';

interface UpgradeItemProps {
  upgrade: Upgrade;
  bulkAmount: number;
}

const UpgradeItem: React.FC<UpgradeItemProps> = ({ upgrade, bulkAmount }) => {
  const { state, dispatch } = useGame();
  const purchaseSound = React.useRef<HTMLAudioElement | null>(null);
  const SETTINGS_KEY = 'cosmicClickerSettings';
  
  React.useEffect(() => {
    purchaseSound.current = new Audio('/audio/purchase.mp3');
    // Set initial volume from settings
    let sfxVolume = 0.5;
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        sfxVolume = JSON.parse(saved).sfxVolume ?? 0.5;
      }
    } catch {}
    if (purchaseSound.current) purchaseSound.current.volume = sfxVolume;
  }, []);

  // Listen for SFX volume changes in localStorage and custom event
  React.useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved && purchaseSound.current) {
          const sfxVolume = JSON.parse(saved).sfxVolume ?? 0.5;
          purchaseSound.current.volume = sfxVolume;
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('settingsChanged', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('settingsChanged', handleStorage);
    };
  }, []);
  
  const effectiveBulkAmount = upgrade.maxLevel 
    ? Math.min(bulkAmount, upgrade.maxLevel - upgrade.level)
    : bulkAmount;
  
  const cost = calculateBulkUpgradeCost(upgrade, effectiveBulkAmount);
  const canAfford = state.stardust >= cost && (!upgrade.maxLevel || upgrade.level < upgrade.maxLevel);
  
  const handleBuyUpgrade = () => {
    if (canAfford) {
      for (let i = 0; i < effectiveBulkAmount; i++) {
        dispatch({ type: 'BUY_UPGRADE', upgradeId: upgrade.id });
      }
      if (purchaseSound.current) {
        purchaseSound.current.currentTime = 0;
        purchaseSound.current.play().catch(() => {});
      }
    }
  };
  
  const getIcon = () => {
    switch (upgrade.icon) {
      case 'star':
        return <img src="/icons/star.png" alt="Star" className="w-10 h-10" />;
      case 'cloud':
        return <img src="/icons/cloud.png" alt="Cloud" className="w-10 h-10" onError={e => { e.currentTarget.src = '/icons/blackhole.png'; }} />;
      case 'orbit':
        return <img src="/icons/orbit.png" alt="Orbit" className="w-10 h-10" onError={e => { e.currentTarget.src = '/icons/galaxy.png'; }} />;
      case 'rocket':
        return <img src="/icons/rocket.png" alt="Rocket" className="w-10 h-10" onError={e => { e.currentTarget.src = '/icons/meteor.png'; }} />;
      default:
        return <img src="/icons/blackhole.png" alt="Fallback" className="w-10 h-10" />;
    }
  };

  const getCurrentEffect = () => {
    if (upgrade.level === 0) return 0;
    if (upgrade.type === 'event') {
      return upgrade.effect * upgrade.level * 100; // percent
    }
    return upgrade.effect * Math.pow(upgrade.effectMultiplier, upgrade.level - 1) * upgrade.level;
  };

  const getNextEffect = () => {
    const nextLevel = upgrade.level + effectiveBulkAmount;
    if (upgrade.type === 'event') {
      return upgrade.effect * nextLevel * 100; // percent
    }
    return upgrade.effect * Math.pow(upgrade.effectMultiplier, nextLevel - 1) * nextLevel;
  };

  return (
    <div 
      className={`
        p-4 rounded-lg relative
        ${canAfford 
          ? 'bg-indigo-900/70 hover:bg-indigo-800/80 cursor-pointer' 
          : 'bg-indigo-950/50 cursor-not-allowed opacity-70'}
        transition-colors
      `}
      onClick={handleBuyUpgrade}
    >
      <div className="flex items-start gap-4">
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center shrink-0
          ${upgrade.type === 'click'
            ? 'bg-purple-900/70'
            : 'bg-blue-900/70'}
        `}>
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-white text-lg">
              {upgrade.name}
            </h4>
            <span className="text-base font-medium text-indigo-200">
              Lvl {upgrade.level}{upgrade.maxLevel ? `/${upgrade.maxLevel}` : ''}
            </span>
          </div>
          
          <p className="text-indigo-200 mb-3 leading-snug">
            {upgrade.description}
          </p>
          
          <div className="space-y-1.5">
            <p className="text-base text-indigo-200">
              {upgrade.type === 'event' ? (
                <>
                  Current: +{getCurrentEffect().toFixed(2)}% event chance<br />
                  After {effectiveBulkAmount}x: +{getNextEffect().toFixed(2)}% event chance
                </>
              ) : upgrade.type === 'click' ? (
                <>
                  Current: +{getCurrentEffect().toFixed(2)} stardust/click<br />
                  After {effectiveBulkAmount}x: +{getNextEffect().toFixed(2)} stardust/click
                </>
              ) : (
                <>
                  Current: +{getCurrentEffect().toFixed(2)} stardust/sec<br />
                  After {effectiveBulkAmount}x: +{getNextEffect().toFixed(2)} stardust/sec
                </>
              )}
            </p>
            
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-indigo-800/30">
              <span className="text-base text-indigo-200">
                Cost ({effectiveBulkAmount}x):
              </span>
              <span className={`
                text-base font-medium
                ${canAfford ? 'text-green-400' : 'text-red-400'}
              `}>
                {formatNumber(cost)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeItem;