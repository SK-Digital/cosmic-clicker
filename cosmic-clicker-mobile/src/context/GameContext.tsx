import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Interfaces ---
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

export interface MetaUpgrade {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel?: number;
  baseCost: number;
  costMultiplier: number;
  effect: number;
  unlockCondition: string;
}

export interface GameState {
  stardust: number;
  clickPower: number;
  passiveIncome: number;
  lastTick: number;
  upgrades: Record<string, Upgrade>;
  metaUpgrades: Record<string, MetaUpgrade>;
  totalClicks: number;
  totalUpgradesBought: number;
  prestigeCount: number;
  prestigeCurrency: number;
}

// --- Initial Upgrades (basic set, can expand later) ---
const initialUpgrades: Record<string, Upgrade> = {
  stellarEnhancement: {
    id: 'stellarEnhancement',
    name: 'Stellar Enhancement',
    description: 'Harness stellar energy to enhance your clicking power',
    level: 0,
    baseCost: 15,
    costMultiplier: 1.15,
    effect: 2,
    effectMultiplier: 1.12,
    type: 'click',
    icon: 'star',
  },
  starClusters: {
    id: 'starClusters',
    name: 'Star Clusters',
    description: 'Generate stardust automatically from star clusters',
    level: 0,
    baseCost: 25,
    costMultiplier: 1.18,
    effect: 1,
    effectMultiplier: 1.10,
    type: 'passive',
    icon: 'star',
  },
};

const initialMetaUpgrades: Record<string, MetaUpgrade> = {
  galacticSynergy: {
    id: 'galacticSynergy',
    name: 'Galactic Synergy',
    description: 'Boosts all upgrade effects by 10% per level',
    level: 0,
    baseCost: 10,
    costMultiplier: 2,
    effect: 0.1,
    maxLevel: 10,
    unlockCondition: 'prestige1',
  },
};

const initialState: GameState = {
  stardust: 0,
  clickPower: 1,
  passiveIncome: 0,
  lastTick: Date.now(),
  upgrades: initialUpgrades,
  metaUpgrades: initialMetaUpgrades,
  totalClicks: 0,
  totalUpgradesBought: 0,
  prestigeCount: 0,
  prestigeCurrency: 0,
};

// --- Helpers ---
const calculateUpgradeCost = (upgrade: Upgrade, metaUpgrades?: Record<string, MetaUpgrade>): number => {
  let cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level);
  // Meta-upgrade: cost reduction (if any)
  return Math.floor(cost);
};

const calculateClickPower = (upgrades: Record<string, Upgrade>, metaUpgrades?: Record<string, MetaUpgrade>): number => {
  let total = Object.values(upgrades)
    .filter(u => u.type === 'click' && u.level > 0)
    .reduce((sum, u) => {
      let effect = u.effect * Math.pow(u.effectMultiplier, u.level - 1) * u.level;
      // Meta-upgrade: effect boost
      if (metaUpgrades && metaUpgrades.galacticSynergy && metaUpgrades.galacticSynergy.level > 0) {
        effect *= 1 + 0.10 * metaUpgrades.galacticSynergy.level;
      }
      return sum + effect;
    }, 1);
  return total;
};

const calculatePassiveIncome = (upgrades: Record<string, Upgrade>, metaUpgrades?: Record<string, MetaUpgrade>): number => {
  let total = Object.values(upgrades)
    .filter(u => u.type === 'passive' && u.level > 0)
    .reduce((sum, u) => {
      let effect = u.effect * Math.pow(u.effectMultiplier, u.level - 1) * u.level;
      if (metaUpgrades && metaUpgrades.galacticSynergy && metaUpgrades.galacticSynergy.level > 0) {
        effect *= 1 + 0.10 * metaUpgrades.galacticSynergy.level;
      }
      return sum + effect;
    }, 0);
  return total;
};

// --- Actions ---
type GameAction =
  | { type: 'CLICK' }
  | { type: 'BUY_UPGRADE'; upgradeId: string; bulkAmount?: number }
  | { type: 'TICK' }
  | { type: 'LOAD_STATE'; payload: GameState };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...action.payload };
    case 'CLICK': {
      const clickPower = calculateClickPower(state.upgrades, state.metaUpgrades);
      return {
        ...state,
        stardust: state.stardust + clickPower,
        totalClicks: state.totalClicks + 1,
      };
    }
    case 'BUY_UPGRADE': {
      const upgrade = state.upgrades[action.upgradeId];
      if (!upgrade) return state;
      const bulk = action.bulkAmount ?? 1;
      let totalCost = 0;
      let affordableLevels = 0;
      let newLevel = upgrade.level;
      let maxLevel = upgrade.maxLevel ?? Infinity;
      // Calculate how many levels can be bought
      for (let i = 0; i < bulk && newLevel < maxLevel; i++) {
        const cost = calculateUpgradeCost({ ...upgrade, level: newLevel }, state.metaUpgrades);
        if (state.stardust - totalCost >= cost) {
          totalCost += cost;
          newLevel++;
          affordableLevels++;
        } else {
          break;
        }
      }
      if (affordableLevels === 0) return state;
      const newUpgrades = {
        ...state.upgrades,
        [action.upgradeId]: {
          ...upgrade,
          level: upgrade.level + affordableLevels,
        },
      };
      return {
        ...state,
        stardust: state.stardust - totalCost,
        upgrades: newUpgrades,
        clickPower: calculateClickPower(newUpgrades, state.metaUpgrades),
        passiveIncome: calculatePassiveIncome(newUpgrades, state.metaUpgrades),
        totalUpgradesBought: state.totalUpgradesBought + affordableLevels,
      };
    }
    case 'TICK': {
      const now = Date.now();
      const delta = (now - state.lastTick) / 1000;
      const passiveGain = state.passiveIncome * delta;
      return {
        ...state,
        stardust: state.stardust + passiveGain,
        lastTick: now,
      };
    }
    default:
      return state;
  }
};

// --- Context ---
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | undefined>(undefined);

const STORAGE_KEY = 'cosmicClickerMobileGameState';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  // Tick loop
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Defensive: merge with initialState to avoid missing keys
          dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...parsed } });
        }
      } catch (e) {
        // Ignore errors
      }
    })();
  }, []);

  // Save to AsyncStorage on state change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}; 