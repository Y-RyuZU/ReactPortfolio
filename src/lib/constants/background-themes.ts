/**
 * Background theme system for dynamic backgrounds
 * 8つの時間帯に対応した背景画像を管理
 */

export type TimeOfDay =
  | 'dawn'      // 5:00-7:00  早朝（薄い青空、朝靄）
  | 'morning'   // 7:00-10:00 朝（明るい青空）
  | 'noon'      // 10:00-14:00 昼（真っ青な空）
  | 'afternoon' // 14:00-17:00 午後（やや黄みがかった空）
  | 'dusk'      // 17:00-19:00 夕方（オレンジ・赤の夕焼け）
  | 'twilight'  // 19:00-21:00 薄暮（紫がかった空）
  | 'night'     // 21:00-2:00  夜（星空、月）
  | 'midnight'; // 2:00-5:00   深夜（より暗い星空）

export interface BackgroundTheme {
  id: string;
  name: string;
  description?: string;
  backgrounds: Record<TimeOfDay, string>;
  // Optional: particle effects for each time
  particles?: Partial<Record<TimeOfDay, string[]>>;
  // Optional: ambient sounds
  ambientSounds?: Partial<Record<TimeOfDay, string>>;
}

/**
 * Get the time of day based on hour (0-23)
 */
export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 19) return 'dusk';
  if (hour >= 19 && hour < 21) return 'twilight';
  if (hour >= 21 || hour < 2) return 'night';
  return 'midnight'; // 2-5
}

/**
 * Default theme: Minecraft Overworld
 * Note: These are placeholder paths - actual images need to be added
 */
export const OVERWORLD_THEME: BackgroundTheme = {
  id: 'overworld',
  name: 'Overworld',
  description: 'Classic Minecraft overworld with day/night cycle',
  backgrounds: {
    dawn: '/images/backgrounds/overworld/dawn.jpg',
    morning: '/images/backgrounds/overworld/sunrise.jpg',
    noon: '/images/backgrounds/overworld/noon.jpg',
    afternoon: '/images/backgrounds/overworld/day.jpg',
    dusk: '/images/backgrounds/overworld/sunset.jpg',
    twilight: '/images/backgrounds/overworld/dusk.jpg',
    night: '/images/backgrounds/overworld/night.jpg',
    midnight: '/images/backgrounds/overworld/midnight.jpg',
  },
} as const satisfies BackgroundTheme;

/**
 * Future theme examples (not implemented yet)
 */
export const NETHER_THEME: BackgroundTheme = {
  id: 'nether',
  name: 'The Nether',
  description: 'Hellish dimension with lava and netherrack',
  backgrounds: {
    dawn: '/images/backgrounds/nether/default.jpg',
    morning: '/images/backgrounds/nether/default.jpg',
    noon: '/images/backgrounds/nether/default.jpg',
    afternoon: '/images/backgrounds/nether/default.jpg',
    dusk: '/images/backgrounds/nether/default.jpg',
    twilight: '/images/backgrounds/nether/default.jpg',
    night: '/images/backgrounds/nether/default.jpg',
    midnight: '/images/backgrounds/nether/default.jpg'
  }
};

export const END_THEME: BackgroundTheme = {
  id: 'end',
  name: 'The End',
  description: 'Void dimension with end stone and chorus plants',
  backgrounds: {
    dawn: '/images/backgrounds/end/default.jpg',
    morning: '/images/backgrounds/end/default.jpg',
    noon: '/images/backgrounds/end/default.jpg',
    afternoon: '/images/backgrounds/end/default.jpg',
    dusk: '/images/backgrounds/end/default.jpg',
    twilight: '/images/backgrounds/end/default.jpg',
    night: '/images/backgrounds/end/default.jpg',
    midnight: '/images/backgrounds/end/default.jpg'
  }
};

/**
 * Available themes registry
 */
export const BACKGROUND_THEMES: BackgroundTheme[] = [
  OVERWORLD_THEME,
  // NETHER_THEME, // Uncomment when images are ready
  // END_THEME,    // Uncomment when images are ready
];

export const DEFAULT_THEME = OVERWORLD_THEME;