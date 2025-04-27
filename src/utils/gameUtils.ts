import { Upgrade } from '../context/GameContext';

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
    size: Math.random() * 80 + 40,
    opacity: Math.random() * 0.7 + 0.3,
    delay: Math.random() * 20,
  }));
};