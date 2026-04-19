'use client';

import { useEffect, useRef, useState } from 'react';
import { EASINGS, EASING_KEYS, SIGILS, type EasingKey } from '../easings';
import { PSEUDOCODE } from '../pseudocode';

const DUR = 1600;
const PAUSE = 500;

function TomeGraph({ easingKey, pos }: { easingKey: EasingKey; pos: number }) {
  const e = EASINGS[easingKey];
  const W = 200;
  const H = 120;
  const PAD = 14;

  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const x = i / 80;
    const y = e.fn(x);
    const px = PAD + x * (W - PAD * 2);
    const py = H - PAD - y * (H - PAD * 2);
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  const path = 'M ' + pts.join(' L ');

  const curT = Math.min(1, pos);
  const curY = e.fn(curT);
  const dotX = PAD + curT * (W - PAD * 2);
  const dotY = H - PAD - curY * (H - PAD * 2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={PAD} stroke="rgba(200,150,42,0.2)" strokeDasharray="2 3" strokeWidth="1" />
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#c89b3c" strokeWidth="1" opacity="0.5" />
      <line x1={PAD} y1={H - PAD} x2={PAD} y2={PAD} stroke="#c89b3c" strokeWidth="1" opacity="0.5" />
      <path d={path} fill="none" stroke={e.color} strokeWidth="2.5" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 3px ${e.color})` }} />
      <line x1={dotX} y1={H - PAD} x2={dotX} y2={dotY} stroke={e.color} strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" />
      <line x1={PAD} y1={dotY} x2={dotX} y2={dotY} stroke={e.color} strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" />
      <circle cx={dotX} cy={dotY} r="5" fill={e.color} style={{ filter: `drop-shadow(0 0 6px ${e.color})` }} />
      <circle cx={dotX} cy={dotY} r="2" fill="#fff" />
      <text x={PAD - 2} y={H - PAD + 10} fontFamily="VT323" fontSize="10" fill="#8a8578" textAnchor="end">0</text>
      <text x={W - PAD + 2} y={H - PAD + 10} fontFamily="VT323" fontSize="10" fill="#8a8578">1</text>
      <text x={PAD - 3} y={PAD + 4} fontFamily="VT323" fontSize="10" fill="#8a8578" textAnchor="end">1</text>
    </svg>
  );
}

function TomeDemo({ easingKey, pos }: { easingKey: EasingKey; pos: number }) {
  const e = EASINGS[easingKey];
  const leftPct = 10 + pos * 80;
  const arc = -50 * pos * (1 - pos) * 4;
  const rotation = pos * 540;

  const trail = Array.from({ length: 12 }, (_, i) => {
    const tp = (i + 1) / 13;
    const vp = e.fn(tp);
    const lp = 10 + vp * 80;
    const ap = -50 * vp * (1 - vp) * 4;
    return { lp, ap };
  });

  return (
    <>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 18,
          background: 'repeating-linear-gradient(90deg, #3d2817 0 6px, #2a1d10 6px 8px)',
          borderTop: `1px solid ${e.color}66`,
        }}
      />
      <div style={{ position: 'absolute', bottom: 18, left: '6%', width: 2, height: 40, background: e.color, opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: 18, right: '6%', width: 2, height: 40, background: e.color, opacity: 0.5 }} />
      {trail.map((pt, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${pt.lp}%`,
            bottom: `calc(50% + ${-pt.ap}px)`,
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: e.color,
            opacity: 0.25,
            transform: 'translate(-50%, 50%)',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: `${leftPct}%`,
          bottom: `calc(50% + ${-arc}px)`,
          transform: `translate(-50%, 50%) rotate(${rotation}deg)`,
          width: 28,
          height: 28,
        }}
      >
        <svg viewBox="0 0 28 28" style={{ width: '100%', height: '100%', filter: `drop-shadow(0 0 6px ${e.color})` }}>
          <path d="M 14 2 L 17 11 L 26 14 L 17 17 L 14 26 L 11 17 L 2 14 L 11 11 Z" fill={e.color} stroke="#2a1d10" strokeWidth="1" />
          <circle cx="14" cy="14" r="2.5" fill="#fff" />
        </svg>
      </div>
    </>
  );
}

function TomeRow({ easingKey, pos }: { easingKey: EasingKey; pos: number }) {
  const [expanded, setExpanded] = useState(false);
  const e = EASINGS[easingKey];
  const pc = PSEUDOCODE[easingKey];

  return (
    <div className="tome-row" style={{ borderLeft: `6px solid ${e.color}` }}>
      <div className="tome-row-head">
        <span className="tome-row-sigil" style={{ color: e.color, background: `${e.color}22` }}>
          {SIGILS[easingKey]}
        </span>
        <span className="tome-row-names">
          <span className="tome-row-en">{e.en}</span>
          <span className="tome-row-jp">{e.rpg} · {pc.modelLabel}</span>
        </span>
        <button
          type="button"
          className="tome-row-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? '▾ HIDE CODE' : '▸ SHOW CODE'}
        </button>
      </div>

      <div className="tome-row-anim">
        <div className="tome-graph-cell">
          <TomeGraph easingKey={easingKey} pos={pos} />
        </div>
        <div className="tome-demo-cell">
          <TomeDemo easingKey={easingKey} pos={pos} />
        </div>
      </div>

      <div className={`tome-row-code ${expanded ? 'open' : ''}`} aria-hidden={!expanded}>
        <div className="tome-code-inner">
          <div className="tome-code-eyebrow">◈ {pc.modelTag} · 毎フレーム更新</div>
          <div className="tome-code-summary">{pc.summary}</div>
          <pre className="tome-code"><code>{pc.code}</code></pre>
          {pc.afterNote && <div className="tome-code-note">※ {pc.afterNote}</div>}
        </div>
      </div>
    </div>
  );
}

export default function ReferenceTome() {
  const [pos, setPos] = useState(0);
  const [, setTick] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = (now - startRef.current) % (DUR + PAUSE);
      setPos(elapsed > DUR ? 1 : elapsed / DUR);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="chapter">
      <div className="chapter-mark">
        <span className="num">VI</span>
        <span>CHAPTER SIX — 大全・総覧</span>
      </div>
      <h2 className="chapter-title">Easing大全 ── 曲線・挙動・コードの一覧</h2>

      <div style={{ textAlign: 'right', marginBottom: 8 }}>
        <button className="rune-button" onClick={() => { startRef.current = null; setTick((n) => n + 1); }} type="button">
          ↻ RECAST
        </button>
      </div>

      <div className="tome-grid">
        {EASING_KEYS.map((k) => (
          <TomeRow key={k} easingKey={k} pos={pos} />
        ))}
      </div>
    </div>
  );
}
