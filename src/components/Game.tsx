import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { rushEvents } from '../context/GameContext';
import GalaxyClicker from './GalaxyClicker';
import Background from './Background';
import UpgradesPanel from './UpgradesPanel';
import StardustCounter from './StardustCounter';
import { Store, Rocket } from 'lucide-react';
import RushEventsPanel from './RushEventsPanel';
import RushEventAnimation from './RushEventAnimation';
import { getActiveEventMultiplier } from '../context/GameContext';

const Game: React.FC = () => {
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showRushEvents, setShowRushEvents] = useState(false);
  const { dispatch, state } = useGame();
  const activeEvent = state.activeEvents.length > 0 ? state.activeEvents[0] : null;
  const eventMultiplier = getActiveEventMultiplier(state.activeEvents);
  
  return (
    <div className="relative w-full h-screen flex bg-transparent">
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
            <button 
              onClick={() => setShowRushEvents(!showRushEvents)}
              className={`p-3 rounded-full bg-indigo-900/60 hover:bg-indigo-800/80 text-white transition-colors`}
            >
              <Rocket className="w-6 h-6 text-white" strokeWidth={2} />
            </button>
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
            {import.meta.env.DEV && state.activeEvents.length === 0 && (
              <div className="flex gap-1">
                <button
                  className="p-2 rounded bg-indigo-700 text-white text-xs hover:bg-indigo-600"
                  onClick={() => dispatch({ type: 'START_EVENT', event: { id: 'meteorShower', name: 'Meteor Shower', duration: 30, startedAt: Date.now() } })}
                >
                  Trigger Meteor Shower
                </button>
                <button
                  className="p-2 rounded bg-indigo-700 text-white text-xs hover:bg-indigo-600"
                  onClick={() => dispatch({ type: 'START_EVENT', event: { id: 'meteorShower', name: 'Meteor Shower', duration: 3, startedAt: Date.now() } })}
                >
                  Trigger Short Meteor Shower
                </button>
                <button
                  className="p-2 rounded bg-indigo-700 text-white text-xs hover:bg-indigo-600"
                  onClick={() => dispatch({ type: 'START_EVENT', event: { id: 'blackHoleRift', name: 'Black Hole Rift', duration: 30, startedAt: Date.now() } })}
                >
                  Trigger Black Hole Rift
                </button>
              </div>
            )}
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
    </div>
  );
};

export default Game;