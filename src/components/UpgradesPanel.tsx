import React, { useState } from 'react';
import { MousePointer, Star, X, Stars } from 'lucide-react';
import { useGame } from '../context/GameContext';
import UpgradeItem from './UpgradeItem';

interface TabConfig {
  id: string;
  icon: React.ReactNode;
  tooltip: string;
}

const TABS: TabConfig[] = [
  { id: 'click', icon: <MousePointer className="w-5 h-5" />, tooltip: 'Click Power' },
  { id: 'passive', icon: <Stars className="w-5 h-5" />, tooltip: 'Passive Income' },
];

const BULK_OPTIONS = [1, 5, 10, 25];

interface UpgradesPanelProps {
  onClose: () => void;
}

const UpgradesPanel: React.FC<UpgradesPanelProps> = ({ onClose }) => {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState('click');
  const [bulkAmount, setBulkAmount] = useState(1);
  
  const clickUpgrades = Object.values(state.upgrades).filter(u => u.type === 'click');
  const passiveUpgrades = Object.values(state.upgrades).filter(u => u.type === 'passive');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'click':
        return (
          <div className="space-y-3 p-4">
            {clickUpgrades.map(upgrade => (
              <UpgradeItem 
                key={upgrade.id} 
                upgrade={upgrade} 
                bulkAmount={bulkAmount}
              />
            ))}
          </div>
        );
      
      case 'passive':
        return (
          <div className="space-y-3 p-4">
            {passiveUpgrades.map(upgrade => (
              <UpgradeItem 
                key={upgrade.id} 
                upgrade={upgrade} 
                bulkAmount={bulkAmount}
              />
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-indigo-800/50">
        <div className="flex gap-4">
          {TABS.map(tab => (
            <div key={tab.id} className="relative group">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`
                  p-2 rounded-lg transition-colors
                  ${activeTab === tab.id
                    ? 'bg-indigo-900/60 text-white'
                    : 'text-white/70 hover:bg-indigo-900/40'}
                `}
              >
                {tab.icon}
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-indigo-900/95 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                {tab.tooltip}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="p-2 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4 border-b border-indigo-800/50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70">Bulk Purchase:</span>
          <div className="flex gap-1">
            {BULK_OPTIONS.map(amount => (
              <button
                key={amount}
                onClick={() => setBulkAmount(amount)}
                className={`
                  px-2 py-1 text-xs rounded
                  ${bulkAmount === amount
                    ? 'bg-indigo-700 text-white'
                    : 'bg-indigo-900/60 text-white/70 hover:bg-indigo-800/60'}
                  transition-colors
                `}
              >
                {amount}x
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default UpgradesPanel;