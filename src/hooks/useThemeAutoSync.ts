'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useMinecraftTime } from '@/contexts/MinecraftTimeContext';

/**
 * Hook that automatically synchronizes the theme with the Minecraft time
 * Dark theme for night periods, light theme for day periods
 */
export function useThemeAutoSync() {
  const { setTheme, resolvedTheme } = useTheme();
  const { currentTimeOfDay } = useMinecraftTime();

  useEffect(() => {
    // Define which time periods should use dark theme
    const darkTimePeriods = ['dusk', 'twilight', 'night', 'midnight'];
    const isDarkTime = darkTimePeriods.includes(currentTimeOfDay);

    // Determine the target theme based on time
    const targetTheme = isDarkTime ? 'dark' : 'light';

    // Only update if the theme is different from current
    if (resolvedTheme !== targetTheme) {
      setTheme(targetTheme);
    }
  }, [currentTimeOfDay, resolvedTheme, setTheme]);

  return {
    currentTheme: resolvedTheme,
    timeOfDay: currentTimeOfDay,
  };
}