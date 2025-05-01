import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { rushEvents } from '../context/GameContext';
import GalaxyClicker from './GalaxyClicker';
import Background from './Background';
import UpgradesPanel from './UpgradesPanel';
import StardustCounter from './StardustCounter';
import { Store, Rocket, Settings } from 'lucide-react';
import RushEventsPanel from './RushEventsPanel';
import RushEventAnimation from './RushEventAnimation';
import { getActiveEventMultiplier } from '../context/GameContext';
import AchievementsPanel from './AchievementsPanel';
import AchievementToast from './AchievementToast';
import { achievementDefs } from './AchievementsPanel';
import LifetimeStatsPanel from './LifetimeStatsPanel';
import { BarChart3 } from 'lucide-react';
import SettingsPanel from './SettingsPanel';

const Game: React.FC = () => {
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showRushEvents, setShowRushEvents] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { dispatch, state } = useGame();
  const activeEvent = state.activeEvents.length > 0 ? state.activeEvents[0] : null;
  const eventMultiplier = getActiveEventMultiplier(state.activeEvents);
  
  // --- Achievement Toast Logic ---
  const [toasts, setToasts] = useState<{ id: string }[]>([]);
  const prevAchievementsRef = React.useRef(state.achievements);
  React.useEffect(() => {
    const prev = prevAchievementsRef.current;
    const newToasts: { id: string }[] = [];
    for (const id in state.achievements) {
      if (
        state.achievements[id].unlocked &&
        (!prev[id]?.unlocked)
      ) {
        newToasts.push({ id });
      }
    }
    if (newToasts.length > 0) {
      setToasts((old) => [...old, ...newToasts]);
    }
    prevAchievementsRef.current = state.achievements;
  }, [state.achievements]);

  React.useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((old) => old.slice(1));
    }, 3500);
    return () => clearTimeout(timer);
  }, [toasts]);
  // --- End Achievement Toast Logic ---

  return (
    <div className="relative w-full h-screen flex bg-transparent">
      {/* Toast notification container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-4 items-end pointer-events-none">
        {toasts.map(({ id }) => {
          const def = achievementDefs.find((a) => a.id === id);
          if (!def) return null;
          return (
            <AchievementToast
              key={id}
              icon={def.icon}
              name={def.name}
              description={def.description}
            />
          );
        })}
      </div>
      <Background />
      {/* Meteor Shower as full-screen overlay */}
      {activeEvent && activeEvent.id === 'meteorShower' && (
        <RushEventAnimation
          key={activeEvent.id + '-' + activeEvent.startedAt}
          event={activeEvent}
        />
      )}
      <main className="flex-1 flex flex-col items-center justify-center relative z-20 bg-transparent">
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center bg-transparent">
          <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500">
            Cosmic Clicker
          </h1>
          <div className="flex gap-2">
            <div className="relative group">
              <button 
                onClick={() => setShowRushEvents(!showRushEvents)}
                className={`p-3 rounded-full bg-indigo-900/60 hover:bg-indigo-800/80 text-white transition-colors`}
              >
                <Rocket className="w-6 h-6 text-white" strokeWidth={2} />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-indigo-900/95 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                Rush Events
              </div>
            </div>
            <div className="relative group">
              <button 
                onClick={() => setShowUpgrades(!showUpgrades)}
                className={`
                  p-3 rounded-full 
                  ${showUpgrades 
                    ? 'bg-indigo-700 text-white' 
                    : 'bg-indigo-900/60 hover:bg-indigo-800/80'} 
                  transition-colors
                `}
              >
                <Store className="w-6 h-6" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-indigo-900/95 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                Upgrades
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={() => setShowAchievements(true)}
                className="p-3 rounded-full bg-indigo-900/60 hover:bg-indigo-800/80 text-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="12" y="8" width="24" height="16" rx="4" />
                  <path d="M16 8V4h16v4" />
                  <path d="M24 24v8" />
                  <circle cx="24" cy="40" r="4" />
                  <path d="M12 12c-4 0-4 8 0 8" />
                  <path d="M36 12c4 0 4 8 0 8" />
                </svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-indigo-900/95 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                Achievements
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={() => setShowStats(true)}
                className="p-3 rounded-full bg-indigo-900/60 hover:bg-indigo-800/80 text-white transition-colors"
                title="Lifetime Stats"
              >
                <BarChart3 className="w-6 h-6" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-indigo-900/95 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                Lifetime Stats
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={() => setShowSettings(true)}
                className="p-3 rounded-full bg-indigo-900/60 hover:bg-indigo-800/80 text-white transition-colors"
                title="Settings"
              >
                <Settings className="w-6 h-6" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-indigo-900/95 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                Settings
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center w-full max-w-5xl px-4 gap-8 bg-transparent">
          <div className="w-1/4">
            <StardustCounter eventMultiplier={eventMultiplier} />
          </div>
          <div className="w-1/2 relative flex items-center justify-center">
            {/* Black Hole as background layer behind the clicker */}
            {activeEvent && activeEvent.id === 'blackHoleRift' && (
              <RushEventAnimation
                key={activeEvent.id + '-' + activeEvent.startedAt}
                event={activeEvent}
                localCenter={true}
                backgroundLayer={true}
              />
            )}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <GalaxyClicker eventMultiplier={eventMultiplier} />
            </div>
          </div>
        </div>
      </main>

      <div 
        className={`
          fixed right-0 top-0 bottom-0 z-30 w-80
          bg-indigo-900/90
          transform transition-transform duration-300 ease-in-out
          ${showUpgrades ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <UpgradesPanel onClose={() => setShowUpgrades(false)} />
      </div>

      <div 
        className={`
          fixed left-0 top-0 bottom-0 z-30 w-80
          bg-indigo-900/90
          transform transition-transform duration-300 ease-in-out
          ${showRushEvents ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <RushEventsPanel onClose={() => setShowRushEvents(false)} />
      </div>

      {showAchievements && (
        <div className="fixed right-0 top-0 bottom-0 z-40 w-96 max-w-full">
          <AchievementsPanel onClose={() => setShowAchievements(false)} />
        </div>
      )}
      {showStats && (
        <div className="fixed right-0 top-0 bottom-0 z-40 w-96 max-w-full">
          <LifetimeStatsPanel onClose={() => setShowStats(false)} />
        </div>
      )}
      {showSettings && (
        <div className="fixed right-0 top-0 bottom-0 z-40 w-96 max-w-full">
          <SettingsPanel onClose={() => setShowSettings(false)} />
        </div>
      )}
    </div>
  );
};

export default Game;