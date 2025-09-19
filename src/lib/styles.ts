/**
 * 共通スタイルユーティリティ
 * 一貫性のあるデザインのための共通クラス
 */

import { type ClassValue } from 'clsx';

export const styles = {
  // Container & Layout
  container: 'container mx-auto px-4 max-w-6xl',
  section: {
    base: '', // Padding controlled by page layout
    primary: '', // Padding controlled by page layout
    secondary: 'bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-950/10 dark:to-transparent', // Subtle gradient only
    withBorder: 'border-t border-gray-200/50 dark:border-gray-800/50',
    large: '', // Padding controlled by page layout
    divider: 'relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-px after:bg-gradient-to-r after:from-transparent after:via-gray-300 dark:after:via-gray-700 after:to-transparent',
  },
  pageWrapper: 'min-h-screen flex flex-col',

  // Cards
  card: {
    base: 'bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg',
    hover: 'hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200',
    padding: 'p-6',
    interactive: 'bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200',
  },

  // Typography
  heading: {
    h1: 'text-4xl md:text-5xl font-medium tracking-tight text-gray-900 dark:text-white',
    h2: 'text-3xl md:text-4xl font-medium tracking-tight text-gray-900 dark:text-white',
    h3: 'text-xl md:text-2xl font-medium tracking-tight text-gray-900 dark:text-white',
    h4: 'text-lg md:text-xl font-medium tracking-tight text-gray-900 dark:text-white',
    section: 'text-3xl md:text-4xl font-medium tracking-tight text-gray-900 dark:text-white mb-4',
  },

  text: {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-800 dark:text-gray-400',
    muted: 'text-gray-700 dark:text-gray-500',
    small: 'text-sm text-gray-800 dark:text-gray-400',
  },

  // Buttons & Links
  button: {
    base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    primary: 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100',
    secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    size: {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-11 px-6',
    },
  },

  // Badges
  badge: {
    base: 'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors',
    default: 'border border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white',
    secondary: 'border border-gray-200 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300',
  },

  // Borders
  border: {
    default: 'border-gray-200 dark:border-gray-700',
    muted: 'border-gray-100 dark:border-gray-800',
  },

  // Effects
  glow: {
    subtle: 'shadow-sm',
    default: 'shadow-md',
    strong: 'shadow-lg',
  },

  // Animations
  transition: {
    default: 'transition-all duration-200 ease-in-out',
    fast: 'transition-all duration-150 ease-in-out',
    slow: 'transition-all duration-300 ease-in-out',
  },
} as const;

// Helper function to combine styles
export function combineStyles(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}