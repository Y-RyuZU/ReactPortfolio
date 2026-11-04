'use client';

import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
const subscribe = (onChange: () => void) => {
  const preference = window.matchMedia(query);
  preference.addEventListener('change', onChange);
  return () => preference.removeEventListener('change', onChange);
};

/** Follow preference changes without requiring a page reload. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
