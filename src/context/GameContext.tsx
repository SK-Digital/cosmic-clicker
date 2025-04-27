import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { calculateUpgradeCost } from '../utils/gameUtils';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel?: number;
  baseCost: number;
  costMultiplier: number;
  effect: number;
  effectMultiplier: number;
  type: 'click' | 'passive';
  icon: string;
}

export interface GameState {
  stardust: number;
  clickPower: number;
  passiveIncome: number;
  lastSaved: number;
  lastTick: number;
  upgrades: Record<string, Upgrade>;
}

const initialUpgrades: Record<string, Upgrade> = {
  stellarEnhancement: {
    id: 'stellarEnhancement',
    name: 'Stellar Enhancement',
    description: 'Harness stellar energy to enhance your clicking power',
    level: 0,
    baseCost: 15,
    costMultiplier: 1.12,
    effect: 2,
    effectMultiplier: 1.15,
    type: 'click',
    icon: 'star',
  },
  gravitationalAmplifier: {
    id: 'gravitationalAmplifier',
    name: 'Gravitational Amplifier',
    description: 'Amplify your clicks with gravitational force',
    level: 0,
    baseCost: 100,
    costMultiplier: 1.15,
    effect: 5,
    effectMultiplier: 1.2,
    type: 'click',
    icon: 'orbit',
  },
  supernovaBoost: {
    id: 'supernovaBoost',
    name: 'Supernova Boost',
    description: 'Channel the power of supernovas into your clicks',
    level: 0,
    baseCost: 500,
    costMultiplier: 1.18,
    effect: 15,
    effectMultiplier: 1.25,
    type: 'click',
    icon: 'star',
  },
  cosmicResonance: {
    id: 'cosmicResonance',
    name: 'Cosmic Resonance',
    description: 'Harmonize with the universe for enhanced clicking power',
    level: 0,
    baseCost: 2500,
    costMultiplier: 1.2,
    effect: 50,
    effectMultiplier: 1.3,
    type: 'click',
    icon: 'star',
  },
  quantumAlignment: {
    id: 'quantumAlignment',
    name: 'Quantum Alignment',
    description: 'Align quantum particles for maximum click efficiency',
    level: 0,
    baseCost: 10000,
    costMultiplier: 1.25,
    effect: 200,
    effectMultiplier: 1.35,
    type: 'click',
    icon: 'star',
  },
  starClusters: {
    id: 'starClusters',
    name: 'Star Clusters',
    description: 'Generate stardust automatically from star clusters',
    level: 0,
    baseCost: 25,
    costMultiplier: 1.1,
    effect: 1,
    effectMultiplier: 1.12,
    type: 'passive',
    icon: 'star',
  },
  nebulaHarvesters: {
    id: 'nebulaHarvesters',
    name: 'Nebula Harvesters',
    description: 'Collect stardust from space nebulae',
    level: 0,
    baseCost: 250,
    costMultiplier: 1.12,
    effect: 5,
    effectMultiplier: 1.15,
    type: 'passive',
    icon: 'cloud',
  },
  blackHoleExtractors: {
    id: 'blackHoleExtractors',
    name: 'Black Hole Extractors',
    description: 'Extract massive amounts of stardust from black holes',
    level: 0,
    baseCost: 1000,
    costMultiplier: 1.15,
    effect: 25,
    effectMultiplier: 1.18,
    type: 'passive',
    icon: 'orbit',
  },
  galacticCondensers: {
    id: 'galacticCondensers',
    name: 'Galactic Condensers',
    description: 'Condense galactic matter into pure stardust',
    level: 0,
    baseCost: 5000,
    costMultiplier: 1.18,
    effect: 100,
    effectMultiplier: 1.2,
    type: 'passive',
    icon: 'star',
  },
  cosmicVortexes: {
    id: 'cosmicVortexes',
    name: 'Cosmic Vortexes',
    description: 'Create space-time vortexes that generate stardust',
    level: 0,
    baseCost: 25000,
    costMultiplier: 1.2,
    effect: 500,
    effectMultiplier: 1.25,
    type: 'passive',
    icon: 'star',
  }
};

const initialState: GameState = {
  stardust: 0,
  clickPower: 1,
  passiveIncome: 0,
  lastSaved: Date.now(),
  lastTick: Date.now(),
  upgrades: initialUpgrades
};

const calculatePassiveIncome = (upgrades: Record<string, Upgrade>): number => {
  return Object.values(upgrades)
    .filter(upgrade => upgrade.type === 'passive' && upgrade.level > 0)
    .reduce((total, upgrade) => {
      const baseEffect = upgrade.effect * Math.pow(upgrade.effectMultiplier, upgrade.level - 1);
      return total + baseEffect * upgrade.level;
    }, 0);
};

const calculateClickPower = (upgrades: Record<string, Upgrade>): number => {
  return Object.values(upgrades)
    .filter(upgrade => upgrade.type === 'click' && upgrade.level > 0)
    .reduce((total, upgrade) => {
      const baseEffect = upgrade.effect * Math.pow(upgrade.effectMultiplier, upgrade.level - 1);
      return total + baseEffect * upgrade.level;
    }, 1);
};

type GameAction =
  | { type: 'CLICK' }
  | { type: 'ADD_STARDUST'; amount: number }
  | { type: 'BUY_UPGRADE'; upgradeId: string }
  | { type: 'TICK' }
  | { type: 'LOAD_GAME'; state: GameState };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'CLICK': {
      const newState = {
        ...state,
        stardust: state.stardust + state.clickPower,
      };
      
      localStorage.setItem('cosmicClickerGameState', JSON.stringify(newState));
      return newState;
    }
    
    case 'ADD_STARDUST': {
      const newState = {
        ...state,
        stardust: state.stardust + action.amount,
      };
      localStorage.setItem('cosmicClickerGameState', JSON.stringify(newState));
      return newState;
    }
    
    case 'BUY_UPGRADE': {
      const upgrade = state.upgrades[action.upgradeId];
      if (!upgrade) return state;
      
      const cost = calculateUpgradeCost(upgrade);
      if (state.stardust < cost) return state;
      
      const newUpgrades = {
        ...state.upgrades,
        [action.upgradeId]: {
          ...upgrade,
          level: upgrade.level + 1,
        },
      };

      const newState = {
        ...state,
        stardust: state.stardust - cost,
        clickPower: calculateClickPower(newUpgrades),
        passiveIncome: calculatePassiveIncome(newUpgrades),
        upgrades: newUpgrades,
        lastSaved: Date.now(),
      };
      
      localStorage.setItem('cosmicClickerGameState', JSON.stringify(newState));
      return newState;
    }
    
    case 'TICK': {
      const now = Date.now();
      const deltaTime = (now - state.lastTick) / 1000;
      const passiveGain = state.passiveIncome * deltaTime;
      
      const newState = {
        ...state,
        stardust: state.stardust + passiveGain,
        lastTick: now,
      };
      
      if (now - state.lastSaved > 10000) {
        localStorage.setItem('cosmicClickerGameState', JSON.stringify(newState));
      }
      
      return newState;
    }
    
    case 'LOAD_GAME': {
      const newState = {
        ...action.state,
        clickPower: calculateClickPower(action.state.upgrades),
        passiveIncome: calculatePassiveIncome(action.state.upgrades),
        lastTick: Date.now(),
        lastSaved: Date.now(),
      };
      return newState;
    }
    
    default:
      return state;
  }
};

const GameContext = createContext<{ state: GameState; dispatch: React.Dispatch<GameAction> } | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  useEffect(() => {
    const savedState = localStorage.getItem('cosmicClickerGameState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_GAME', state: parsedState });
      } catch (error) {
        console.error('Failed to load game state:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('cosmicClickerGameState', JSON.stringify(state));
  }, [state]);
  
  useEffect(() => {
    const tickInterval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 100);
    
    return () => clearInterval(tickInterval);
  }, []);
  
  useEffect(() => {
    const now = Date.now();
    const timeDiff = (now - state.lastSaved) / 1000;
    
    if (timeDiff > 5) {
      const offlineGain = state.passiveIncome * timeDiff;
      if (offlineGain > 0) {
        dispatch({ type: 'ADD_STARDUST', amount: offlineGain });
      }
    }
  }, [state.lastSaved, state.passiveIncome]);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};