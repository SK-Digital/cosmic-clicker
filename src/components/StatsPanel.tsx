import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { formatNumber } from '../utils/gameUtils';

const StatsPanel: React.FC = () => {
  const { state, dispatch } = useGame();
  const [showModal, setShowModal] = useState(false);
  const canPrestige = Math.floor(Math.sqrt((state.totalStardustEarned || 0) / 1_000_000)) > 0;
  const prestigeGain = Math.floor(Math.sqrt((state.totalStardustEarned || 0) / 1_000_000));
  
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
      {/* Prestige Stats */}
      <div className="bg-indigo-900/80 p-3 rounded-lg border border-indigo-700/40 mb-4">
        <h3 className="text-base font-bold text-yellow-300 mb-2 flex items-center gap-2">
          <img src="/icons/blackhole.png" alt="Prestige" className="w-6 h-6 inline-block" /> Prestige
        </h3>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-white/80">Prestige Count:</span>
            <span className="font-medium text-yellow-200">{state.prestigeCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">Cosmic Shards:</span>
            <span className="font-medium text-yellow-200">{state.prestigeCurrency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">Stardust Multiplier:</span>
            <span className="font-medium text-yellow-200">{(1 + state.prestigeCount * 0.1).toFixed(1)}x</span>
          </div>
        </div>
      </div>
      
      {/* Prestige Button */}
      {canPrestige && (
        <div className="flex flex-col items-center mb-4">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded shadow transition-colors"
            onClick={() => setShowModal(true)}
          >
            Prestige for {prestigeGain} Cosmic Shard{prestigeGain > 1 ? 's' : ''}
          </button>
        </div>
      )}
      {/* Prestige Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-indigo-900 p-8 rounded-xl shadow-2xl border-2 border-yellow-400 flex flex-col items-center max-w-xs">
            <h3 className="text-lg font-bold text-yellow-300 mb-2">Confirm Prestige</h3>
            <p className="text-white mb-4 text-center">Are you sure you want to prestige?<br />This will reset all progress except achievements and cosmic shards.<br /><span className='text-yellow-200 font-bold'>You will gain {prestigeGain} Cosmic Shard{prestigeGain > 1 ? 's' : ''}!</span></p>
            <div className="flex gap-4 mt-2">
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-4 rounded"
                onClick={() => { dispatch({ type: 'PRESTIGE' }); setShowModal(false); }}
              >
                Confirm
              </button>
              <button
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-1 px-4 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
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