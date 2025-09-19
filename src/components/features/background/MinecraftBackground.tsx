'use client';

import { useState, useEffect, useMemo } from 'react';
import { useMinecraftTime } from '@/contexts/MinecraftTimeContext';
import { DEFAULT_THEME, type BackgroundTheme, type TimeOfDay } from '@/lib/constants/background-themes';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MinecraftBackgroundProps {
    theme?: BackgroundTheme;
    opacity?: number;
    blur?: number;
    parallax?: boolean;
    className?: string;
}

/**
 * Dynamic background component that changes based on time of day
 * Supports 8 different time periods with smooth transitions
 */
export default function MinecraftBackground({
  theme = DEFAULT_THEME,
  opacity = 0.6,
  blur = 0,
  parallax = false,
  className
}: MinecraftBackgroundProps) {
  const { currentTimeOfDay, timeProgress } = useMinecraftTime();
  const [mounted, setMounted] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<TimeOfDay>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Preload adjacent time period images for smooth transitions
  useEffect(() => {
    if (!mounted) return;

    const timeOrder: TimeOfDay[] = [
      'dawn', 'morning', 'noon', 'afternoon',
      'dusk', 'twilight', 'night', 'midnight'
    ];

    const currentIndex = timeOrder.indexOf(currentTimeOfDay);
    const prevIndex = (currentIndex - 1 + timeOrder.length) % timeOrder.length;
    const nextIndex = (currentIndex + 1) % timeOrder.length;

    const imagesToPreload = [
      currentTimeOfDay,
      timeOrder[prevIndex],
      timeOrder[nextIndex]
    ];

    imagesToPreload.forEach((timeOfDay) => {
      if (!loadedImages.has(timeOfDay)) {
        const img = new window.Image();
        img.src = theme.backgrounds[timeOfDay];
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, timeOfDay]));
        };
      }
    });
  }, [currentTimeOfDay, theme.backgrounds, loadedImages, mounted]);

  // Determine if it's dark or light based on time of day
  const isDarkTime = useMemo(() => {
    // Avoid hydration mismatch - default to light theme until mounted
    if (!mounted) return false;
    return ['dusk', 'twilight', 'night', 'midnight'].includes(currentTimeOfDay);
  }, [currentTimeOfDay, mounted]);

  return (
    <div
      className={cn(
        'fixed inset-0 -z-10 overflow-hidden',
        className
      )}
      style={{
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        transform: parallax ? 'translateZ(-1px) scale(1.5)' : undefined,
      }}
    >
      {/* Render all background images with opacity transitions */}
      {mounted ? (
        // After hydration: show dynamic backgrounds
        Object.entries(theme.backgrounds).map(([timeOfDay, src]) => {
          const isActive = timeOfDay === currentTimeOfDay;
          const isLoaded = loadedImages.has(timeOfDay as TimeOfDay);

          return (
            <div
              key={timeOfDay}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000 ease-in-out',
                isActive ? 'opacity-100' : 'opacity-0'
              )}
            >
              {isLoaded || isActive ? (
                <Image
                  src={src}
                  alt={`${timeOfDay} background`}
                  fill
                  sizes="100vw"
                  priority={isActive}
                  quality={90}
                  className="object-cover"
                />
              ) : null}
            </div>
          );
        })
      ) : (
        // Before hydration: show default noon background
        <div className="absolute inset-0">
          <Image
            src={theme.backgrounds.noon}
            alt="default background"
            fill
            sizes="100vw"
            priority
            quality={90}
            className="object-cover"
          />
        </div>
      )}

      {/* Overlay gradient for better text readability */}
      <div
        className={cn(
          'absolute inset-0',
          'bg-gradient-to-b',
          isDarkTime
            ? 'from-black/20 via-black/10 to-black/20'
            : 'from-white/10 via-transparent to-white/10'
        )}
      />

      {/* Time transition overlay - subtle gradient based on progress */}
      {mounted && (
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-in-out pointer-events-none"
          style={{
            opacity: Math.sin(timeProgress * Math.PI) * 0.05,
            background: `linear-gradient(to bottom,
              transparent 0%,
              rgba(255, 200, 100, ${timeProgress * 0.05}) 50%,
              transparent 100%)`
          }}
        />
      )}
    </div>
  );
}
