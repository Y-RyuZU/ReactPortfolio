import { useTheme } from 'next-themes';
import { useEffect, useState, useMemo } from 'react';

/**
 * Hook for managing theme configuration and Minecraft-style theming
 * テーマ設定とMinecraft風テーマを管理するフック
 */

export interface MinecraftStyleConfig {
  gridPattern: {
    light: string;
    dark: string;
  };
  colors: {
    stone: string;
    xp: string;
    enchant: string;
  };
  animations: {
    enabled: boolean;
    duration: string;
  };
}

export interface UseThemeConfigReturn {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme: string | undefined;
  mounted: boolean;
  isLight: boolean;
  isDark: boolean;
  minecraftStyles: MinecraftStyleConfig;
  toggleTheme: () => void;
}

const defaultMinecraftStyles: MinecraftStyleConfig = {
  gridPattern: {
    light: 'opacity-[0.03]',
    dark: 'opacity-[0.05]',
  },
  colors: {
    stone: 'var(--mc-stone)',
    xp: 'var(--mc-xp)',
    enchant: 'var(--mc-enchant)',
  },
  animations: {
    enabled: true,
    duration: '300ms',
  },
};

export function useThemeConfig(): UseThemeConfigReturn {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = useMemo(() => resolvedTheme === 'light', [resolvedTheme]);
  const isDark = useMemo(() => resolvedTheme === 'dark', [resolvedTheme]);

  const minecraftStyles = useMemo(() => {
    return {
      ...defaultMinecraftStyles,
      gridPattern: {
        ...defaultMinecraftStyles.gridPattern,
        current: isDark
          ? defaultMinecraftStyles.gridPattern.dark
          : defaultMinecraftStyles.gridPattern.light,
      },
    };
  }, [isDark]);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(isDark ? 'light' : 'dark');
  };

  return {
    theme,
    setTheme,
    resolvedTheme,
    mounted,
    isLight,
    isDark,
    minecraftStyles,
    toggleTheme,
  };
}

/**
 * Hook for getting CSS variables based on theme
 */
export function useThemeVariables() {
  const { resolvedTheme } = useTheme();
  const [variables, setVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateVariables = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);

      const themeVars = {
        background: computedStyle.getPropertyValue('--background').trim(),
        foreground: computedStyle.getPropertyValue('--foreground').trim(),
        primary: computedStyle.getPropertyValue('--primary').trim(),
        secondary: computedStyle.getPropertyValue('--secondary').trim(),
        accent: computedStyle.getPropertyValue('--accent').trim(),
        muted: computedStyle.getPropertyValue('--muted').trim(),
        border: computedStyle.getPropertyValue('--border').trim(),
        mcStone: computedStyle.getPropertyValue('--mc-stone').trim(),
        mcXp: computedStyle.getPropertyValue('--mc-xp').trim(),
        mcEnchant: computedStyle.getPropertyValue('--mc-enchant').trim(),
      };

      setVariables(themeVars);
    };

    // Update variables when theme changes
    updateVariables();

    // Small delay to ensure CSS variables are updated
    const timeout = setTimeout(updateVariables, 100);

    return () => clearTimeout(timeout);
  }, [resolvedTheme]);

  return variables;
}