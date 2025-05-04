import React from 'react';
import { useGame } from '../context/GameContext';

export const achievementDefs = [
  {
    id: 'first-click',
    name: 'First Click',
    description: 'Click the galaxy for the first time.',
    icon: <img src="/icons/clicker.png" alt="First Click" width={48} height={48} />,
    goal: 1,
  },
  {
    id: 'hundred-clicks',
    name: 'Click Novice',
    description: 'Reach 100 total clicks.',
    icon: <img src="/icons/clicker.png" alt="Click Novice" width={48} height={48} />,
    goal: 100,
  },
  {
    id: 'meteor-event',
    name: 'Meteor Watcher',
    description: 'Trigger a Meteor Shower event.',
    icon: <img src="/icons/meteor.png" alt="Meteor Event" width={48} height={48} />,
    goal: 1,
  },
  {
    id: 'blackhole-event',
    name: 'Into the Void',
    description: 'Trigger a Black Hole Rift event.',
    icon: <img src="/icons/blackhole.png" alt="Black Hole Event" width={48} height={48} />,
    goal: 1,
  },
  // Add more as needed
];

const AchievementsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state } = useGame();
  return (
    <div className="h-full flex flex-col bg-indigo-900/80 rounded-r-2xl shadow-2xl p-6 text-white max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Achievements</h2>
        <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">×</button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        {achievementDefs.map(def => {
          const ach = state.achievements[def.id];
          const progress = ach?.progress ?? (ach?.unlocked ? def.goal : 0);
          return (
            <div key={def.id} className={`flex items-center gap-4 p-3 rounded-xl bg-indigo-800/60 shadow ${ach?.unlocked ? 'opacity-100' : 'opacity-60'}`}>
              <div className="w-16 h-16 flex items-center justify-center">{def.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-lg text-white truncate">{def.name}</div>
                <div className="text-indigo-200 text-sm truncate">{def.description}</div>
                {def.goal && def.goal > 1 && (
                  <div className="w-full bg-indigo-700/40 rounded h-2 mt-2">
                    <div className="bg-white/80 h-2 rounded" style={{ width: `${Math.min(100, (progress / def.goal) * 100)}%` }} />
                  </div>
                )}
              </div>
              {ach?.unlocked && <span className="ml-2 text-green-400 font-bold">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsPanel; 