import React from 'react';
import { useGame } from '../context/GameContext';
import { formatNumber } from '../utils/gameUtils';

const StatsPanel: React.FC = () => {
  const { state } = useGame();
  
  // Calculate total stardust earned (current + spent)
  const totalSpent = Object.values(state.upgrades).reduce((total, upgrade) => {
    let spentOnUpgrade = 0;
    for (let i = 0; i < upgrade.level; i++) {
      spentOnUpgrade += Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, i));
    }
    return total + spentOnUpgrade;
  }, 0);
  
  const totalStardust = state.stardust + totalSpent;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Game Stats</h2>
      </div>
      
      <div className="overflow-y-auto flex-1">
        <div className="space-y-4">
          {/* Lifetime Stats */}
          <div className="bg-indigo-900/70 p-3 rounded-lg border border-indigo-700/40">
            <h3 className="text-base font-bold text-white mb-2">Lifetime Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/80">Total Clicks:</span>
                <span className="font-medium text-indigo-300">{state.totalClicks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Total Upgrades Bought:</span>
                <span className="font-medium text-indigo-300">{state.totalUpgradesBought}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Total Events Triggered:</span>
                <span className="font-medium text-indigo-300">{state.totalEventsTriggered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Total Stardust Earned:</span>
                <span className="font-medium text-indigo-300">{formatNumber(totalStardust)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Stardust Spent:</span>
                <span className="font-medium text-indigo-300">{formatNumber(totalSpent)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-900/50 p-3 rounded-lg">
            <h3 className="text-base font-medium text-white mb-2">Resources</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/80">Current Stardust:</span>
                <span className="font-medium text-indigo-300">{formatNumber(state.stardust)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Total Stardust Earned:</span>
                <span className="font-medium text-indigo-300">{formatNumber(totalStardust)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Stardust Spent:</span>
                <span className="font-medium text-indigo-300">{formatNumber(totalSpent)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-900/50 p-3 rounded-lg">
            <h3 className="text-base font-medium text-white mb-2">Production</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/80">Click Power:</span>
                <span className="font-medium text-purple-300">{formatNumber(state.clickPower)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Passive Income:</span>
                <span className="font-medium text-blue-300">{formatNumber(state.passiveIncome)}/sec</span>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-900/50 p-3 rounded-lg">
            <h3 className="text-base font-medium text-white mb-2">Upgrades</h3>
            <div className="space-y-2">
              {Object.values(state.upgrades).map(upgrade => (
                <div key={upgrade.id} className="flex justify-between">
                  <span className="text-white/80">{upgrade.name}:</span>
                  <span className="font-medium text-indigo-300">Level {upgrade.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;