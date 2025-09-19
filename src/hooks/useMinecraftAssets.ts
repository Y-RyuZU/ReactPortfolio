import { useMemo } from 'react';
import type { ProficiencyLevel } from '@/lib/types/skill';
import { PROFICIENCY_ASSETS, PROFICIENCY_LABELS } from '@/lib/constants/minecraft-assets';

/**
 * Hook for managing Minecraft-style assets and mappings
 * Minecraft風アセットとマッピングを管理するフック
 */

export interface MinecraftAssetConfig {
  ingot: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  shadowColor: string;
}

export interface UseMinecraftAssetsReturn {
  getProficiencyAsset: (level: ProficiencyLevel) => MinecraftAssetConfig;
  getProficiencyLabel: (level: ProficiencyLevel) => string;
  getProficiencyWidth: (level: ProficiencyLevel) => string;
  getCategoryItem: (category: string) => string;
  getSkillSizeClasses: (size: 'sm' | 'md' | 'lg') => SkillSizeClasses;
  minecraftAnimations: {
    enchant: string;
    sparkle: string;
    xpOrb: string;
    hover: string;
  };
}

interface SkillSizeClasses {
  container: string;
  icon: string;
  ingot: string;
  text: string;
  badge: string;
}

// Achievement items mapping for project categories
const achievementItems: Record<string, string> = {
  'realtime-system': '/images/minecraft/item/comparator.png',
  'tool': '/images/minecraft/item/diamond_pickaxe.png',
  'startup': '/images/minecraft/item/emerald.png',
  'web': '/images/minecraft/item/compass_00.png',
  'mobile': '/images/minecraft/item/map.png',
  'game': '/images/minecraft/item/diamond_sword.png',
  'ai': '/images/minecraft/item/ender_eye.png',
  'backend': '/images/minecraft/item/command_block_minecart.png',
  'frontend': '/images/minecraft/item/painting.png',
  'infrastructure': '/images/minecraft/block/iron_block.png',
};

// Skill card size configurations
const skillSizeClasses: Record<'sm' | 'md' | 'lg', SkillSizeClasses> = {
  sm: {
    container: 'w-32 h-36 sm:w-36 sm:h-40 min-w-[128px]',
    icon: 'w-10 h-10 sm:w-12 sm:h-12',
    ingot: 'w-14 h-14 sm:w-16 sm:h-16',
    text: 'text-xs sm:text-sm',
    badge: 'text-[10px] sm:text-xs',
  },
  md: {
    container: 'w-36 h-40 sm:w-40 sm:h-44 lg:w-44 lg:h-48 min-w-[144px]',
    icon: 'w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16',
    ingot: 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24',
    text: 'text-sm sm:text-sm lg:text-base',
    badge: 'text-xs sm:text-xs lg:text-sm',
  },
  lg: {
    container: 'w-40 h-44 sm:w-44 sm:h-48 lg:w-48 lg:h-52 xl:w-52 xl:h-56 min-w-[160px]',
    icon: 'w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20',
    ingot: 'w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32',
    text: 'text-sm sm:text-base lg:text-base xl:text-lg',
    badge: 'text-xs sm:text-sm lg:text-sm xl:text-base',
  },
};

export function useMinecraftAssets(): UseMinecraftAssetsReturn {
  const getProficiencyAsset = useMemo(
    () => (level: ProficiencyLevel) => {
      return PROFICIENCY_ASSETS[level] || PROFICIENCY_ASSETS.beginner;
    },
    []
  );

  const getProficiencyLabel = useMemo(
    () => (level: ProficiencyLevel) => {
      return PROFICIENCY_LABELS[level] || 'Unknown';
    },
    []
  );

  const getProficiencyWidth = useMemo(
    () => (level: ProficiencyLevel) => {
      const widthMap: Record<ProficiencyLevel, string> = {
        expert: '100%',
        advanced: '75%',
        intermediate: '50%',
        beginner: '25%',
      };
      return widthMap[level] || '0%';
    },
    []
  );

  const getCategoryItem = useMemo(
    () => (category: string) => {
      return achievementItems[category] || '/images/minecraft/item/iron_ingot.png';
    },
    []
  );

  const getSkillSizeClasses = useMemo(
    () => (size: 'sm' | 'md' | 'lg') => {
      return skillSizeClasses[size];
    },
    []
  );

  const minecraftAnimations = useMemo(
    () => ({
      enchant: 'mc-enchant-glow',
      sparkle: 'mc-ore-sparkle',
      xpOrb: 'mc-xp-orb',
      hover: 'hover:scale-[1.02] transition-all duration-300',
    }),
    []
  );

  return {
    getProficiencyAsset,
    getProficiencyLabel,
    getProficiencyWidth,
    getCategoryItem,
    getSkillSizeClasses,
    minecraftAnimations,
  };
}

/**
 * Hook for getting opacity and saturation based on proficiency
 */
export function useProficiencyStyles(proficiency: ProficiencyLevel) {
  return useMemo(() => {
    const styleMap: Record<ProficiencyLevel, { opacity: string; saturate: string }> = {
      beginner: { opacity: 'opacity-85', saturate: 'saturate-[0.75]' },
      intermediate: { opacity: 'opacity-90', saturate: 'saturate-[0.85]' },
      advanced: { opacity: 'opacity-95', saturate: 'saturate-[0.95]' },
      expert: { opacity: 'opacity-100', saturate: 'saturate-100' },
    };

    return styleMap[proficiency] || styleMap.beginner;
  }, [proficiency]);
}