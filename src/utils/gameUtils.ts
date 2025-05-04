import { Upgrade } from '../context/GameContext';
import { supabase } from './supabaseClient';
import { GameState } from '../context/GameContext';

export const formatNumber = (num: number): string => {
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(0);
};

export const calculateUpgradeCost = (upgrade: Upgrade): number => {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
};

export const calculateBulkUpgradeCost = (upgrade: Upgrade, amount: number): number => {
  let totalCost = 0;
  for (let i = 0; i < amount; i++) {
    totalCost += calculateUpgradeCost({
      ...upgrade,
      level: upgrade.level + i
    });
  }
  return totalCost;
};

export const calculateUpgradeEffect = (upgrade: Upgrade, amount: number = 1): number => {
  const nextLevel = upgrade.level + amount;
  const nextEffect = upgrade.effect * Math.pow(upgrade.effectMultiplier, nextLevel - 1) * nextLevel;
  const currentEffect = upgrade.level === 0 ? 0 : 
    upgrade.effect * Math.pow(upgrade.effectMultiplier, upgrade.level - 1) * upgrade.level;
  
  return nextEffect - currentEffect;
};

export const canAffordUpgrade = (stardust: number, upgrade: Upgrade, amount: number = 1): boolean => {
  return stardust >= calculateBulkUpgradeCost(upgrade, amount);
};

export const generateRandomStars = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.8 + 0.2,
    animationDelay: Math.random() * 5,
  }));
};

export const generateRandomMeteors = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    angle: Math.random() * 45 + 45,
    speed: Math.random() * 10 + 5,
    size: Math.random() * 2 + 2,
    opacity: Math.random() * 0.7 + 0.3,
    delay: Math.random() * 20,
  }));
};

export const LOCAL_SAVE_KEY = 'cosmicClickerGameState';

export async function saveGameToCloud(userId: string, state: GameState) {
  const { error } = await supabase
    .from('game_saves')
    .upsert({ user_id: userId, save_data: state, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  return error;
}

export async function loadGameFromCloud(userId: string): Promise<GameState | null> {
  const { data, error } = await supabase
    .from('game_saves')
    .select('save_data')
    .eq('user_id', userId)
    .single();
  if (error || !data) return null;
  return data.save_data as GameState;
}

export function saveGameToLocal(state: GameState) {
  localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(state));
}

export function loadGameFromLocal(): GameState | null {
  const saved = localStorage.getItem(LOCAL_SAVE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

// Fetch top N users by totalStardustEarned for leaderboard
export async function fetchLeaderboardTopN(limit = 20) {
  const { data, error } = await supabase
    .from('game_saves')
    .select('user_id, save_data')
    .order('save_data->totalStardustEarned', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  // Map to leaderboard entries
  return data.map(row => {
    const save = row.save_data || {};
    return {
      username: save.username || row.user_id?.slice(0, 8) || 'Unknown',
      totalStardustEarned: save.totalStardustEarned || 0,
      prestigeCount: save.prestigeCount || 0,
      userId: row.user_id,
    };
  });
}