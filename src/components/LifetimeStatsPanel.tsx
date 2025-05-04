import React from 'react';
import { useGame } from '../context/GameContext';
import { formatNumber } from '../utils/gameUtils';

const LifetimeStatsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state, user } = useGame();
  const totalSpent = Object.values(state.upgrades).reduce((total, upgrade) => {
    let spentOnUpgrade = 0;
    for (let i = 0; i < upgrade.level; i++) {
      spentOnUpgrade += Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, i));
    }
    return total + spentOnUpgrade;
  }, 0);
  const totalStardust = state.stardust + totalSpent;
  const username = user?.user_metadata?.username || (user ? user.email : 'Guest');
  const isGuest = !user;
  return (
    <div className="h-full flex flex-col bg-indigo-900/80 rounded-r-2xl shadow-2xl p-6 text-white max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Lifetime Stats</h2>
        <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">×</button>
      </div>
      {/* User Profile Section */}
      <div className="flex items-center gap-4 mb-6 bg-indigo-900/80 p-3 rounded-lg border border-indigo-700/40">
        {/* Placeholder avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 flex items-center justify-center text-2xl font-bold text-indigo-200">
          {username[0]?.toUpperCase() || 'G'}
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg text-indigo-200">{username}</div>
          {!isGuest && <div className="text-indigo-300 text-xs">{user.email}</div>}
          {isGuest && (
            <div className="text-pink-200 text-xs mt-1">Sign up to save your progress, join leaderboards, and more!</div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Prestige Stats */}
        <div className="bg-indigo-900/80 p-3 rounded-lg border border-indigo-700/40 mb-4">
          <h3 className="text-base font-bold text-purple-300 mb-2 flex items-center gap-2">
            <img src="/icons/prestige.png" alt="Prestige" className="w-6 h-6 inline-block" /> Prestige
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-white/80">Prestige Count:</span>
              <span className="font-medium text-purple-200">{state.prestigeCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Cosmic Shards:</span>
              <span className="font-medium text-purple-200">{state.prestigeCurrency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Stardust Multiplier:</span>
              <span className="font-medium text-purple-200">{(1 + state.prestigeCount * 0.1).toFixed(1)}x</span>
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default LifetimeStatsPanel; 