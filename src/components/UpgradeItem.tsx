import React from 'react';
import { Star, Cloud, Orbit } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Upgrade } from '../context/GameContext';
import { calculateBulkUpgradeCost, formatNumber } from '../utils/gameUtils';

interface UpgradeItemProps {
  upgrade: Upgrade;
  bulkAmount: number;
}

const UpgradeItem: React.FC<UpgradeItemProps> = ({ upgrade, bulkAmount }) => {
  const { state, dispatch } = useGame();
  
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
    }
  };
  
  const getIcon = () => {
    switch (upgrade.icon) {
      case 'star':
        return <Star className="w-5 h-5" />;
      case 'cloud':
        return <Cloud className="w-5 h-5" />;
      case 'orbit':
        return <Orbit className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getCurrentEffect = () => {
    if (upgrade.level === 0) return 0;
    return upgrade.effect * Math.pow(upgrade.effectMultiplier, upgrade.level - 1) * upgrade.level;
  };

  const getNextEffect = () => {
    const nextLevel = upgrade.level + effectiveBulkAmount;
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
              Current: +{formatNumber(getCurrentEffect())} {upgrade.type === 'click' ? 'per click' : 'stardust/sec'}
            </p>
            <p className="text-base text-indigo-300">
              After {effectiveBulkAmount}x: +{formatNumber(getNextEffect())} {upgrade.type === 'click' ? 'per click' : 'stardust/sec'}
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