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
  type: 'click' | 'passive' | 'event';
  icon: string;
}

export interface AchievementState {
  id: string;
  unlocked: boolean;
  progress?: number;
}

export interface GameState {
  stardust: number;
  clickPower: number;
  passiveIncome: number;
  lastSaved: number;
  lastTick: number;
  upgrades: Record<string, Upgrade>;
  activeEvents: { id: string; name: string; duration: number; startedAt: number }[];
  eventChance: number;
  achievements: Record<string, AchievementState>;
  totalClicks: number;
  totalUpgradesBought: number;
  totalEventsTriggered: number;
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
  },
  eventBooster: {
    id: 'eventBooster',
    name: 'Event Booster',
    description: 'Increases the chance of rush events by 2% per level.',
    type: 'event',
    icon: 'rocket',
    baseCost: 1000,
    costMultiplier: 2.5,
    effect: 0.02,
    effectMultiplier: 1,
    level: 0,
    maxLevel: 10,
  },
  meteorMagnet: {
    id: 'meteorMagnet',
    name: 'Meteor Magnet',
    description: 'Further increases rush event chance by 3% per level.',
    type: 'event',
    icon: 'rocket',
    baseCost: 5000,
    costMultiplier: 3,
    effect: 0.03,
    effectMultiplier: 1,
    level: 0,
    maxLevel: 5,
  },
};

const initialAchievements: Record<string, AchievementState> = {
  'first-click': { id: 'first-click', unlocked: false },
  'hundred-clicks': { id: 'hundred-clicks', unlocked: false, progress: 0 },
  'meteor-event': { id: 'meteor-event', unlocked: false },
  'blackhole-event': { id: 'blackhole-event', unlocked: false },
};

const initialState: GameState = {
  stardust: 0,
  clickPower: 1,
  passiveIncome: 0,
  lastSaved: Date.now(),
  lastTick: Date.now(),
  upgrades: initialUpgrades,
  activeEvents: [],
  eventChance: calculateEventChance(initialUpgrades),
  achievements: initialAchievements,
  totalClicks: 0,
  totalUpgradesBought: 0,
  totalEventsTriggered: 0,
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

// Helper function to calculate event chance from upgrades
function calculateEventChance(upgrades: Record<string, Upgrade>): number {
  return Object.values(upgrades)
    .filter(u => u.type === 'event')
    .reduce((sum, u) => sum + u.effect * u.level, 0);
}

// Define rush events
const rushEvents = [
  {
    id: 'meteorShower',
    name: 'Meteor Shower',
    baseChance: 0.7, // 70% of eventChance
    duration: 30, // seconds
    multiplier: 2, // 2x production
    description: 'A flurry of meteors increases all production!',
    icon: 'meteor',
  },
  {
    id: 'blackHoleRift',
    name: 'Black Hole Rift',
    baseChance: 0.3, // 30% of eventChance
    duration: 30, // seconds
    multiplier: 4, // 4x production
    description: 'A black hole rift supercharges your stardust gain!',
    icon: 'blackhole',
  },
];

// Helper to get current event multiplier
function getActiveEventMultiplier(activeEvents: { id: string; name: string; duration: number; startedAt: number }[]): number {
  if (!activeEvents || activeEvents.length === 0) return 1;
  return activeEvents.reduce((mult: number, event: { id: string; name: string; duration: number; startedAt: number }) => {
    const def = rushEvents.find(e => e.id === event.id);
    return mult * (def ? def.multiplier : 1);
  }, 1);
}

type GameAction =
  | { type: 'CLICK' }
  | { type: 'ADD_STARDUST'; amount: number }
  | { type: 'BUY_UPGRADE'; upgradeId: string }
  | { type: 'TICK' }
  | { type: 'LOAD_GAME'; state: GameState }
  | { type: 'START_EVENT'; event: { id: string; name: string; duration: number; startedAt: number } }
  | { type: 'END_EVENT'; eventId: string; startedAt: number }
  | { type: 'ACHIEVEMENT_PROGRESS'; id: string; progress?: number; unlock?: boolean };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'CLICK': {
      const eventMultiplier = getActiveEventMultiplier(state.activeEvents);
      const achievements = { ...state.achievements };
      const newTotalClicks = (state.totalClicks || 0) + 1;
      if (!achievements['first-click'].unlocked) {
        achievements['first-click'] = { ...achievements['first-click'], unlocked: true };
      }
      if (!achievements['hundred-clicks'].unlocked) {
        const progress = newTotalClicks;
        if (progress >= 100) {
          achievements['hundred-clicks'] = { ...achievements['hundred-clicks'], unlocked: true, progress: 100 };
        } else {
          achievements['hundred-clicks'] = { ...achievements['hundred-clicks'], progress };
        }
      }
      return {
        ...state,
        stardust: state.stardust + state.clickPower * eventMultiplier,
        achievements,
        totalClicks: newTotalClicks,
      };
    }
    case 'ADD_STARDUST': {
      return {
        ...state,
        stardust: state.stardust + action.amount,
      };
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
      return {
        ...state,
        stardust: state.stardust - cost,
        clickPower: calculateClickPower(newUpgrades),
        passiveIncome: calculatePassiveIncome(newUpgrades),
        upgrades: newUpgrades,
        lastSaved: Date.now(),
        eventChance: calculateEventChance(newUpgrades),
        totalUpgradesBought: (state.totalUpgradesBought || 0) + 1,
      };
    }
    case 'TICK': {
      const eventMultiplier = getActiveEventMultiplier(state.activeEvents);
      const now = Date.now();
      const deltaTime = (now - state.lastTick) / 1000;
      const passiveGain = state.passiveIncome * eventMultiplier * deltaTime;
      const newState = {
        ...state,
        stardust: state.stardust + passiveGain,
        lastTick: now,
      };
      // Check for expired events
      newState.activeEvents.forEach(event => {
        if (event.startedAt + event.duration * 1000 < now) {
          newState.activeEvents = newState.activeEvents.filter(e => e.id !== event.id);
        }
      });
      return newState;
    }
    case 'LOAD_GAME': {
      // If loading from old save, fallback to 0 for totalClicks
      const totalClicks = (action.state as any).totalClicks ?? 0;
      const totalUpgradesBought = (action.state as any).totalUpgradesBought ?? 0;
      const totalEventsTriggered = (action.state as any).totalEventsTriggered ?? 0;
      // Recalculate achievement progress from totalClicks
      const achievements = { ...action.state.achievements };
      if (achievements['hundred-clicks']) {
        const progress = totalClicks;
        if (progress >= 100) {
          achievements['hundred-clicks'] = { ...achievements['hundred-clicks'], unlocked: true, progress: 100 };
        } else {
          achievements['hundred-clicks'] = { ...achievements['hundred-clicks'], progress };
        }
      }
      return {
        ...action.state,
        clickPower: calculateClickPower(action.state.upgrades),
        passiveIncome: calculatePassiveIncome(action.state.upgrades),
        lastTick: Date.now(),
        lastSaved: Date.now(),
        eventChance: calculateEventChance(action.state.upgrades),
        totalClicks,
        totalUpgradesBought,
        totalEventsTriggered,
        achievements,
      };
    }
    case 'START_EVENT': {
      const achievements = { ...state.achievements };
      if (action.event.id === 'meteorShower' && !achievements['meteor-event'].unlocked) {
        achievements['meteor-event'] = { ...achievements['meteor-event'], unlocked: true };
      }
      if (action.event.id === 'blackHoleRift' && !achievements['blackhole-event'].unlocked) {
        achievements['blackhole-event'] = { ...achievements['blackhole-event'], unlocked: true };
      }
      return {
        ...state,
        activeEvents: [...state.activeEvents, action.event],
        lastSaved: Date.now(),
        achievements,
        totalEventsTriggered: (state.totalEventsTriggered || 0) + 1,
      };
    }
    case 'END_EVENT': {
      const newActiveEvents = state.activeEvents.filter(event => !(event.id === action.eventId && event.startedAt === action.startedAt));
      return {
        ...state,
        activeEvents: newActiveEvents,
        lastSaved: Date.now(),
      };
    }
    case 'ACHIEVEMENT_PROGRESS': {
      const achievements = { ...state.achievements };
      if (action.unlock) {
        achievements[action.id] = { ...achievements[action.id], unlocked: true };
      } else if (typeof action.progress === 'number') {
        achievements[action.id] = { ...achievements[action.id], progress: action.progress };
      }
      return { ...state, achievements };
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
      // Check for expired events
      const now = Date.now();
      state.activeEvents.forEach(event => {
        if (event.startedAt + event.duration * 1000 < now) {
          dispatch({ type: 'END_EVENT', eventId: event.id, startedAt: event.startedAt });
        }
      });
    }, 100);
    return () => clearInterval(tickInterval);
  }, [state.activeEvents]);
  
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
  
  // Periodically check for rush event trigger
  useEffect(() => {
    if (state.activeEvents.length > 0) return; // Only one event at a time
    const interval = setInterval(() => {
      if (state.activeEvents.length > 0) return;
      if (state.eventChance > 0 && Math.random() < state.eventChance) {
        // Weighted random event selection
        const totalWeight = rushEvents.reduce((sum, e) => sum + e.baseChance, 0);
        let r = Math.random() * totalWeight;
        let chosen = rushEvents[0];
        for (const event of rushEvents) {
          if (r < event.baseChance) {
            chosen = event;
            break;
          }
          r -= event.baseChance;
        }
        const event = {
          id: chosen.id,
          name: chosen.name,
          duration: chosen.duration,
          startedAt: Date.now(),
        };
        dispatch({ type: 'START_EVENT', event });
      }
    }, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, [state.eventChance, state.activeEvents.length]);
  
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

export { rushEvents, getActiveEventMultiplier };