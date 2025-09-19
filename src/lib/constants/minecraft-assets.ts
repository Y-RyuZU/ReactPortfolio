import type { ProficiencyLevel } from '@/lib/types/skill';

export interface MinecraftAsset {
  frame: string;
  ingot: string;
  gear?: string;
  color: string;
  borderColor: string;
  bgGradient: string;
  shadowColor: string;
}

// Minecraft assets by proficiency level (ore block version)
export const PROFICIENCY_ASSETS: Record<ProficiencyLevel, MinecraftAsset> = {
  expert: {
    frame: 'diamond',
    ingot: '/images/minecraft/block/deepslate_diamond_ore.png', // Deepslate diamond ore
    gear: '/images/minecraft/item/diamond_gear.png', // Use when diamond_gear is added
    color: 'hsl(var(--mc-diamond))',
    borderColor: 'border-cyan-500 dark:border-cyan-400',
    bgGradient: 'from-cyan-100 to-cyan-200 dark:from-cyan-900 dark:to-cyan-800',
    shadowColor: 'shadow-cyan-300 dark:shadow-cyan-700',
  },
  advanced: {
    frame: 'gold',
    ingot: '/images/minecraft/block/gold_ore.png', // Gold ore
    color: 'hsl(var(--mc-gold))',
    borderColor: 'border-yellow-500 dark:border-yellow-400',
    bgGradient: 'from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800',
    shadowColor: 'shadow-yellow-300 dark:shadow-yellow-700',
  },
  intermediate: {
    frame: 'iron',
    ingot: '/images/minecraft/block/iron_ore.png', // Iron ore
    color: 'hsl(var(--mc-iron))',
    borderColor: 'border-gray-400 dark:border-gray-500',
    bgGradient: 'from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800',
    shadowColor: 'shadow-gray-300 dark:shadow-gray-700',
  },
  beginner: {
    frame: 'coal',
    ingot: '/images/minecraft/block/coal_ore.png', // Coal ore
    gear: '/images/minecraft/item/coal.png',
    color: 'hsl(var(--mc-stone))',
    borderColor: 'border-gray-600 dark:border-gray-700',
    bgGradient: 'from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700',
    shadowColor: 'shadow-gray-400 dark:shadow-gray-800',
  },
} as const;

// 熟練度の表示名
export const PROFICIENCY_LABELS: Record<ProficiencyLevel, string> = {
  expert: 'Expert',
  advanced: 'Advanced',
  intermediate: 'Intermediate',
  beginner: 'Beginner',
} as const;

// 熟練度の日本語表示名
export const PROFICIENCY_LABELS_JA: Record<ProficiencyLevel, string> = {
  expert: 'エキスパート',
  advanced: '上級',
  intermediate: '中級',
  beginner: '初級',
} as const;