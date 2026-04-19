'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { EASINGS, EASING_KEYS, SIGILS, type EasingKey } from '../easings';

const DURATION = 1800;
const REST = 600;

export default function CurveVisualizer() {
  const [selected, setSelected] = useState<EasingKey>('easeOutBack');
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = (now - startRef.current) % (DURATION + REST);
      if (elapsed > DURATION) setT(1);
      else setT(elapsed / DURATION);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [selected]);

  const easing = EASINGS[selected];

  const W = 500;
  const H = 380;
  const PAD = 30;

  const path = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = i / 100;
      const y = easing.fn(x);
      const px = PAD + x * (W - PAD * 2);
      const py = H - PAD - y * (H - PAD * 2);
      pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    }
    return 'M ' + pts.join(' L ');
  }, [easing]);

  const curT = Math.min(1, t);
  const curY = easing.fn(curT);
  const dotX = PAD + curT * (W - PAD * 2);
  const dotY = H - PAD - curY * (H - PAD * 2);
  const orbPct = curY * 100;

  return (
    <div className="chapter">
      <div className="chapter-mark">
        <span className="num">I</span>
        <span>CHAPTER ONE — 魔導書の基礎</span>
      </div>
      <h2 className="chapter-title">Easingとは、動きに「生命」を吹き込む魔法</h2>

      <div className="graph-panel">
        <div>
          <div className="graph-stage">
            <svg className="graph-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
              <text x={PAD} y={H - 8} fontFamily="Cinzel" fontSize="11" fill="#c89b3c" opacity="0.7">TIME →</text>
              <text x={PAD - 22} y={PAD + 4} fontFamily="Cinzel" fontSize="11" fill="#c89b3c" opacity="0.7" transform={`rotate(-90 ${PAD - 22} ${PAD + 4})`}>VALUE →</text>

              <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={PAD} stroke="rgba(200,150,42,0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x={W - PAD - 90} y={PAD + 18} fontFamily="Cinzel" fontSize="10" fill="rgba(200,150,42,0.5)" letterSpacing="2">LINEAR REF</text>

              <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#c89b3c" strokeWidth="1.5" opacity="0.6" />
              <line x1={PAD} y1={H - PAD} x2={PAD} y2={PAD} stroke="#c89b3c" strokeWidth="1.5" opacity="0.6" />

              <path d={path} fill="none" stroke={easing.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 6px ${easing.color})` }} />

              <line x1={dotX} y1={H - PAD} x2={dotX} y2={dotY} stroke={easing.color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <line x1={PAD} y1={dotY} x2={dotX} y2={dotY} stroke={easing.color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

              <circle cx={dotX} cy={dotY} r="10" fill={easing.color} style={{ filter: `drop-shadow(0 0 12px ${easing.color})` }} />
              <circle cx={dotX} cy={dotY} r="4" fill="#fff" />

              <text x={PAD - 5} y={H - PAD + 14} fontFamily="VT323" fontSize="14" fill="#8a8578" textAnchor="end">0</text>
              <text x={W - PAD + 5} y={H - PAD + 14} fontFamily="VT323" fontSize="14" fill="#8a8578">1</text>
              <text x={PAD - 8} y={PAD + 4} fontFamily="VT323" fontSize="14" fill="#8a8578" textAnchor="end">1</text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 16,
              background: '#1a1208',
              border: '2px solid var(--border-dark)',
              borderRadius: 4,
              padding: '20px 20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 10, left: 20, fontFamily: 'Cinzel, serif', fontSize: 10, letterSpacing: '0.3em', color: 'var(--parchment-dark)', opacity: 0.7 }}>
              REAL-TIME DEMONSTRATION
            </div>
            <div
              style={{
                position: 'relative',
                height: 40,
                marginTop: 18,
                background: 'repeating-linear-gradient(90deg, rgba(200,150,42,0.15) 0 4px, transparent 4px 12px)',
                borderTop: '1px solid rgba(200,150,42,0.3)',
                borderBottom: '1px solid rgba(200,150,42,0.3)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `calc(${orbPct}% - 16px)`,
                  transform: 'translateY(-50%)',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 30% 30%, #fff, ${easing.color} 70%)`,
                  boxShadow: `0 0 24px ${easing.color}, 0 0 8px ${easing.color}`,
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: 'VT323, monospace', fontSize: 14, color: '#8a8578' }}>
              <span>◆ START</span>
              <span>t = {curT.toFixed(2)}  value = {curY.toFixed(2)}</span>
              <span>GOAL ◆</span>
            </div>
          </div>
        </div>

        <div className="spell-list">
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 10, letterSpacing: '0.3em', color: 'var(--parchment-dark)', padding: '4px 4px 8px', opacity: 0.7 }}>
            ✦ SELECT A TECHNIQUE
          </div>
          {EASING_KEYS.map((k) => {
            const e = EASINGS[k];
            const active = selected === k;
            return (
              <button key={k} className={`spell-option ${active ? 'active' : ''}`} onClick={() => setSelected(k)} type="button">
                <span className="spell-sigil" style={{ color: e.color, background: `${e.color}22` }}>
                  {SIGILS[k]}
                </span>
                <span className="spell-names">
                  <div className="spell-rpg">{e.rpg}</div>
                  <div className="spell-tech">{e.en}</div>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="lore-plaque">
        <span className="badge">◈ LORE</span>
        <span className="text">
          <strong>『{easing.rpg}』</strong>
          ({easing.rpgEn}) ──── {easing.desc}
        </span>
      </div>
    </div>
  );
}
