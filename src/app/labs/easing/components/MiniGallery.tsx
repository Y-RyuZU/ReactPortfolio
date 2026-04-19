'use client';

import { useEffect, useRef, useState } from 'react';
import { EASINGS, EASING_KEYS, SIGILS, type EasingKey } from '../easings';

const DUR = 1400;
const PAUSE = 500;

function MiniDemo({ easingKey, loopToken }: { easingKey: EasingKey; loopToken: number }) {
  const [pos, setPos] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const ez = EASINGS[easingKey].fn;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = (now - startRef.current) % (DUR + PAUSE);
      if (elapsed > DUR) setPos(1);
      else setPos(ez(elapsed / DUR));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [easingKey, loopToken]);

  const e = EASINGS[easingKey];
  const leftPct = 5 + pos * 85;

  return (
    <div className="mini-stage">
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '5%',
          right: '5%',
          height: 1,
          background: `repeating-linear-gradient(90deg, ${e.color}66 0 4px, transparent 4px 10px)`,
          opacity: 0.6,
        }}
      />
      <div style={{ position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)', left: '5%',  color: e.color, fontSize: 10 }}>◆</div>
      <div style={{ position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)', left: '90%', color: e.color, fontSize: 10 }}>◆</div>
      <div className="mini-orb" style={{ left: `${leftPct}%`, color: e.color }} />
    </div>
  );
}

export default function MiniGallery() {
  const [token, setToken] = useState(0);

  return (
    <div className="chapter">
      <div className="chapter-mark">
        <span className="num">IV</span>
        <span>CHAPTER FOUR — 術式一覧</span>
      </div>
      <h2 className="chapter-title">魔導書・全八術の鑑</h2>

      <div style={{ textAlign: 'right', marginBottom: 8 }}>
        <button className="rune-button" onClick={() => setToken((x) => x + 1)} type="button">
          ↻ CAST ALL
        </button>
      </div>

      <div className="card-grid">
        {EASING_KEYS.map((k) => {
          const e = EASINGS[k];
          return (
            <div key={k} className="mini-card">
              <div className="mini-card-header">
                <span className="mini-card-sigil" style={{ color: e.color, background: `${e.color}22` }}>
                  {SIGILS[k]}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mini-card-title">{e.rpg}</div>
                  <div className="mini-card-subtitle">{e.en}</div>
                </div>
              </div>
              <MiniDemo easingKey={k} loopToken={token} />
              <div className="mini-card-desc">{e.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
