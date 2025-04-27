import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import GalaxyClicker from './GalaxyClicker';
import Background from './Background';
import UpgradesPanel from './UpgradesPanel';
import StardustCounter from './StardustCounter';
import { Store } from 'lucide-react';

const Game: React.FC = () => {
  const [showUpgrades, setShowUpgrades] = useState(false);
  
  return (
    <div className="relative w-full h-screen flex bg-transparent">
      <Background />
      
      <main className="flex-1 flex flex-col items-center justify-center relative z-20 bg-transparent">
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center bg-transparent">
          <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500">
            Cosmic Clicker
          </h1>
          
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
        </div>

        <div className="flex items-center justify-center w-full max-w-5xl px-4 gap-8 bg-transparent">
          <div className="w-1/4">
            <StardustCounter />
          </div>
          
          <div className="w-1/2">
            <GalaxyClicker />
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
    </div>
  );
};

export default Game;