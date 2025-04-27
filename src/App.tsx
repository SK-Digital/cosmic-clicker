import React from 'react';
import Game from './components/Game';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <div className="min-h-screen overflow-hidden relative bg-[#0E0B3D]">
      <GameProvider>
        <Game />
      </GameProvider>
    </div>
  );
}

export default App;