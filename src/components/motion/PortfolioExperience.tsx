'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import MinecraftBackground from '@/components/features/background/MinecraftBackground';
import { ScrollConstruction } from './ScrollConstruction';
import './portfolio-experience.css';

export function PortfolioExperience({ children }: { children: ReactNode }) {
  const [backgroundReady, setBackgroundReady] = useState(false);
  const [ready, setReady] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const onBackgroundReady = useCallback(() => setBackgroundReady(true), []);

  useEffect(() => {
    if (!backgroundReady) return;
    let cancelled = false;
    const sources = new Set([
      '/images/skin/Y_RyuZU.png',
      '/images/minecraft/item/feather.png',
      '/images/minecraft/block/glass.png',
    ]);
    // Only warm the first viewport. Offscreen cards retain their lazy loading.
    content.current?.querySelectorAll<HTMLImageElement>('img').forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) sources.add(img.currentSrc || img.src);
    });
    const images = Array.from(sources, async src => {
      const img = new window.Image();
      img.src = src;
      await img.decode().catch(() => undefined);
    });
    Promise.all([...images, document.fonts.ready]).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => { cancelled = true; };
  }, [backgroundReady]);

  return (
    <>
      <MinecraftBackground opacity={0.6} blur={0} onReady={onBackgroundReady} />
      <div className="experience-loader" data-loaded={ready} role="status" aria-hidden={ready}>
        <div className="experience-loading-mark" aria-hidden="true"><i /><i /><i /><i /></div>
        <span>ワールドを読み込み中</span>
        <div className="experience-loading-track" aria-hidden="true"><i /></div>
      </div>
      <div ref={content} className="experience-content flex flex-1 flex-col" data-scene-ready={ready}>
        <ScrollConstruction ready={ready}>{children}</ScrollConstruction>
      </div>
      <noscript><style>{'.experience-loader { display: none !important; } .experience-content { visibility: visible !important; }'}</style></noscript>
    </>
  );
}
