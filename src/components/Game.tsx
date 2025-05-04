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

const SETTINGS_KEY = 'cosmicClickerSettings';

const Game: React.FC = () => {
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showRushEvents, setShowRushEvents] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrestige, setShowPrestige] = useState(false);
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

  // Accessibility: apply settings as classes on root div
  useEffect(() => {
    const applyAccessibility = () => {
      let settings = { highContrast: false, colorblind: false, reducedMotion: false };
      try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) settings = { ...settings, ...JSON.parse(saved) };
      } catch {}
      const root = document.documentElement;
      root.classList.toggle('high-contrast', !!settings.highContrast);
      root.classList.toggle('colorblind', !!settings.colorblind);
      root.classList.toggle('reduced-motion', !!settings.reducedMotion);
    };
    applyAccessibility();
    window.addEventListener('settingsChanged', applyAccessibility);
    return () => window.removeEventListener('settingsChanged', applyAccessibility);
  }, []);

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
          {/* Hide icons when any overlay is open */}
          {!(showUpgrades || showRushEvents || showAchievements || showStats || showSettings || showPrestige) && (
            <div className="flex gap-2">
              <div className="relative group">
                <button 
                  onClick={() => setShowRushEvents(!showRushEvents)}
                  className={`p-3 rounded-full bg-indigo-900/60 hover:bg-indigo-800/80 text-white transition-colors`}
                >
                  <img src="/icons/rocket.png" alt="Rush Events" className="w-10 h-10" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-indigo-900/95 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Rush Events
                </div>
              </div>
              {/* Prestige Button */}
              <div className="relative group">
                <button
                  onClick={() => setShowPrestige(true)}
                  className="p-3 rounded-full bg-indigo-900/60 hover:bg-indigo-800/80 text-white transition-colors"
                  title="Prestige"
                >
                  <img src="/icons/prestige.png" alt="Prestige" className="w-10 h-10" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-indigo-900/95 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Prestige
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
                  <img src="/icons/shop.png" alt="Upgrades" className="w-10 h-10" />
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
                  <img src="/icons/achievements.png" alt="Achievements" className="w-10 h-10" />
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
                  <img src="/icons/stats.png" alt="Lifetime Stats" className="w-10 h-10" />
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
                  <img src="/icons/setting.png" alt="Settings" className="w-10 h-10" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-indigo-900/95 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Settings
                </div>
              </div>
            </div>
          )}
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
      {/* Prestige Modal */}
      {showPrestige && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" data-testid="prestige-modal">
          <div className="bg-indigo-900 p-8 rounded-xl shadow-2xl border-2 border-indigo-500 flex flex-col items-center max-w-xs">
            <h3 className="text-lg font-bold text-purple-300 mb-2 flex items-center gap-2">
              <img src="/icons/prestige.png" alt="Prestige" className="w-8 h-8" /> Prestige
            </h3>
            <div className="space-y-2 mb-4 w-full">
              <div className="flex justify-between w-full">
                <span className="text-white/80">Prestige Count:</span>
                <span className="font-medium text-purple-200" data-testid="prestige-count">{state.prestigeCount}</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-white/80">Cosmic Shards:</span>
                <span className="font-medium text-purple-200" data-testid="prestige-cosmic-shards">{state.prestigeCurrency}</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-white/80">Stardust Multiplier:</span>
                <span className="font-medium text-purple-200">{(1 + state.prestigeCount * 0.1).toFixed(1)}x</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-white/80">Next Prestige:</span>
                <span className="font-medium text-purple-200">{Math.floor(Math.sqrt((state.totalStardustEarned || 0) / 1_000_000))} Cosmic Shard{Math.floor(Math.sqrt((state.totalStardustEarned || 0) / 1_000_000)) !== 1 ? 's' : ''}</span>
              </div>
              <div className="text-xs text-purple-100 mt-2">Earn 1 Cosmic Shard for every 1,000,000 total stardust earned (sqrt scaling). All progress except achievements and cosmic shards will be reset.</div>
            </div>
            <div className="flex gap-4 mt-2">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded shadow"
                disabled={Math.floor(Math.sqrt((state.totalStardustEarned || 0) / 1_000_000)) < 1}
                onClick={() => { dispatch({ type: 'PRESTIGE' }); setShowPrestige(false); }}
                data-testid="prestige-confirm-btn"
              >
                Prestige
              </button>
              <button
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-6 rounded shadow"
                onClick={() => setShowPrestige(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;