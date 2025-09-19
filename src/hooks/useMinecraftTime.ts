'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getTimeOfDay, type TimeOfDay } from '@/lib/constants/background-themes';

interface UseMinecraftTimeReturn {
  currentTimeOfDay: TimeOfDay;
  currentHour: number;
  currentMinute: number;
  isManualMode: boolean;
  setManualTime: (hour: number, minute?: number) => void;
  toggleManualMode: () => void;
  resetToSystemTime: () => void;
  timeProgress: number; // 0-1 for smooth transitions between time periods
  formattedTime: string; // HH:MM format
}

/**
 * Hook for managing Minecraft-style time with manual override capability
 */
export function useMinecraftTime(): UseMinecraftTimeReturn {
  const [systemTime, setSystemTime] = useState(() => new Date());
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualHour, setManualHour] = useState(() => new Date().getHours());
  const [manualMinute, setManualMinute] = useState(() => new Date().getMinutes());

  // Update system time every minute
  useEffect(() => {
    if (!isManualMode) {
      const interval = setInterval(() => {
        setSystemTime(new Date());
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [isManualMode]);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('minecraft-time-mode');
    const savedHour = localStorage.getItem('minecraft-time-hour');
    const savedMinute = localStorage.getItem('minecraft-time-minute');

    if (savedMode === 'manual' && savedHour) {
      setIsManualMode(true);
      setManualHour(parseInt(savedHour, 10));
      if (savedMinute) {
        setManualMinute(parseInt(savedMinute, 10));
      }
    } else {
      // Clear any stale data if not in manual mode
      localStorage.removeItem('minecraft-time-mode');
      localStorage.removeItem('minecraft-time-hour');
      localStorage.removeItem('minecraft-time-minute');
    }
  }, []);

  const currentHour = useMemo(() => {
    if (isManualMode) return manualHour;
    // Use browser's local time
    return systemTime.getHours();
  }, [isManualMode, manualHour, systemTime]);

  const currentMinute = useMemo(() => {
    if (isManualMode) return manualMinute;
    // Use browser's local time
    return systemTime.getMinutes();
  }, [isManualMode, manualMinute, systemTime]);

  const currentTimeOfDay = useMemo(() => {
    return getTimeOfDay(currentHour);
  }, [currentHour]);

  // Calculate progress within current time period (0-1)
  const timeProgress = useMemo(() => {
    const totalMinutes = currentHour * 60 + currentMinute;

    // Define time period boundaries in minutes
    const boundaries = {
      dawn: { start: 5 * 60, end: 7 * 60 },      // 5:00-7:00
      morning: { start: 7 * 60, end: 10 * 60 },  // 7:00-10:00
      noon: { start: 10 * 60, end: 14 * 60 },    // 10:00-14:00
      afternoon: { start: 14 * 60, end: 17 * 60 }, // 14:00-17:00
      dusk: { start: 17 * 60, end: 19 * 60 },    // 17:00-19:00
      twilight: { start: 19 * 60, end: 21 * 60 }, // 19:00-21:00
      night: { start: 21 * 60, end: 26 * 60 },   // 21:00-2:00 (26:00)
      midnight: { start: 2 * 60, end: 5 * 60 },  // 2:00-5:00
    };

    const period = boundaries[currentTimeOfDay];

    // Handle night period crossing midnight
    if (currentTimeOfDay === 'night') {
      const adjustedMinutes = totalMinutes < 2 * 60 ? totalMinutes + 24 * 60 : totalMinutes;
      return (adjustedMinutes - period.start) / (period.end - period.start);
    }

    return (totalMinutes - period.start) / (period.end - period.start);
  }, [currentHour, currentMinute, currentTimeOfDay]);

  const formattedTime = useMemo(() => {
    const h = currentHour.toString().padStart(2, '0');
    const m = currentMinute.toString().padStart(2, '0');
    return `${h}:${m}`;
  }, [currentHour, currentMinute]);

  const setManualTime = useCallback((hour: number, minute: number = 0) => {
    const validHour = Math.max(0, Math.min(23, hour));
    const validMinute = Math.max(0, Math.min(59, minute));

    setManualHour(validHour);
    setManualMinute(validMinute);
    setIsManualMode(true);

    // Save to localStorage
    localStorage.setItem('minecraft-time-mode', 'manual');
    localStorage.setItem('minecraft-time-hour', validHour.toString());
    localStorage.setItem('minecraft-time-minute', validMinute.toString());
  }, []);

  const toggleManualMode = useCallback(() => {
    const newMode = !isManualMode;
    setIsManualMode(newMode);

    if (newMode) {
      // Switching to manual mode - use current system time as starting point
      const now = new Date();
      setManualHour(now.getHours());
      setManualMinute(now.getMinutes());
      localStorage.setItem('minecraft-time-mode', 'manual');
      localStorage.setItem('minecraft-time-hour', now.getHours().toString());
      localStorage.setItem('minecraft-time-minute', now.getMinutes().toString());
    } else {
      // Switching to system time
      localStorage.setItem('minecraft-time-mode', 'system');
      localStorage.removeItem('minecraft-time-hour');
      localStorage.removeItem('minecraft-time-minute');
    }
  }, [isManualMode]);

  const resetToSystemTime = useCallback(() => {
    setIsManualMode(false);
    localStorage.setItem('minecraft-time-mode', 'system');
    localStorage.removeItem('minecraft-time-hour');
    localStorage.removeItem('minecraft-time-minute');
  }, []);

  return {
    currentTimeOfDay,
    currentHour,
    currentMinute,
    isManualMode,
    setManualTime,
    toggleManualMode,
    resetToSystemTime,
    timeProgress,
    formattedTime,
  };
}