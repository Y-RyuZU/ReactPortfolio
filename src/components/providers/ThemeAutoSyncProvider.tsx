'use client';

import { useThemeAutoSync } from '@/hooks/useThemeAutoSync';

/**
 * Provider component that ensures theme is automatically synchronized with time
 * This should be placed inside both ThemeProvider and MinecraftTimeProvider
 */
export function ThemeAutoSyncProvider({ children }: { children: React.ReactNode }) {
  // Activate the theme auto-sync hook
  useThemeAutoSync();

  // Simply pass through children - the hook handles all the logic
  return <>{children}</>;
}