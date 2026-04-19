'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface LoopCtx {
  looping: boolean;
  setLooping: (v: boolean) => void;
  toggle: () => void;
}

const LoopContext = createContext<LoopCtx | null>(null);

export function LoopProvider({ children }: { children: ReactNode }) {
  const [looping, setLooping] = useState(true);
  const toggle = useCallback(() => setLooping((v) => !v), []);
  const value = useMemo(() => ({ looping, setLooping, toggle }), [looping, toggle]);
  return <LoopContext.Provider value={value}>{children}</LoopContext.Provider>;
}

export function useLoop(): LoopCtx {
  const ctx = useContext(LoopContext);
  if (!ctx) throw new Error('useLoop must be used inside <LoopProvider>');
  return ctx;
}
