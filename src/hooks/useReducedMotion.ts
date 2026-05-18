'use client';

import { useReducedMotion as useReducedMotionFM } from 'framer-motion';

/**
 * Re-export framer-motion's reduced-motion hook so callers don't depend on
 * framer-motion directly, and we can swap implementations later if needed.
 *
 * Returns `true` when the user has `prefers-reduced-motion: reduce` set.
 * `null` is treated as "unknown but likely false" — callers should treat
 * the value as falsy by default.
 */
export function useReducedMotion(): boolean {
  return useReducedMotionFM() ?? false;
}
