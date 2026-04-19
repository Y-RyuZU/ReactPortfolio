'use client';

import { useEffect, useRef, useState } from 'react';
import { EASINGS, type EasingKey } from '../easings';

type WeaponKind = 'sword' | 'axe';
type Mode = 'sword' | 'axe' | 'spin';

interface WeaponDims {
  w: number;
  h: number;
}

const WEAPON_DIMS: Record<WeaponKind, WeaponDims> = {
  sword: { w: 60, h: 180 },
  axe:   { w: 70, h: 160 },
};

function SwordShape({ dims }: { dims: WeaponDims }) {
  return (
    <svg viewBox="0 0 60 180" width={dims.w} height={dims.h}>
      <circle cx="30" cy="168" r="6" fill="#c8962a" stroke="#2a1d10" strokeWidth="1.2" />
      <circle cx="30" cy="168" r="2.5" fill="#8a5e1a" />
      <rect x="27" y="144" width="6" height="22" fill="#4a3420" stroke="#2a1d10" strokeWidth="1" />
      <path d="M 27 146 L 33 146 M 27 152 L 33 152 M 27 158 L 33 158 M 27 164 L 33 164" stroke="#2a1d10" strokeWidth="0.6" />
      <rect x="14" y="138" width="32" height="6" fill="#c8962a" stroke="#2a1d10" strokeWidth="1.2" rx="1" />
      <circle cx="18" cy="141" r="1.6" fill="#8a5e1a" />
      <circle cx="42" cy="141" r="1.6" fill="#8a5e1a" />
      <path d="M 26 138 L 34 138 L 33 20 L 30 10 L 27 20 Z" fill="url(#bladeGrad)" stroke="#2a1d10" strokeWidth="1.2" />
      <line x1="30" y1="20" x2="30" y2="134" stroke="#2a1d10" strokeWidth="0.8" opacity="0.5" />
      <defs>
        <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#8a8578" />
          <stop offset="50%"  stopColor="#f2f5fa" />
          <stop offset="100%" stopColor="#8a8578" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="80" r="2" fill="#6bb6ff" opacity="0.8" />
    </svg>
  );
}

function AxeShape({ dims }: { dims: WeaponDims }) {
  return (
    <svg viewBox="0 0 80 180" width={dims.w} height={dims.h}>
      <rect x="36" y="30" width="8" height="148" fill="#6b4423" stroke="#2a1d10" strokeWidth="1.2" />
      <path d="M 36 60 L 44 60 M 36 90 L 44 90 M 36 120 L 44 120 M 36 150 L 44 150" stroke="#2a1d10" strokeWidth="0.6" />
      <rect x="34" y="164" width="12" height="14" fill="#c8962a" stroke="#2a1d10" strokeWidth="1.2" rx="1" />
      <path d="M 20 8 Q 4 24 12 46 L 40 38 L 40 12 Z" fill="url(#axeGrad)" stroke="#2a1d10" strokeWidth="1.4" />
      <path d="M 60 8 Q 76 24 68 46 L 40 38 L 40 12 Z" fill="url(#axeGrad)" stroke="#2a1d10" strokeWidth="1.4" />
      <rect x="32" y="10" width="16" height="32" fill="#c8962a" stroke="#2a1d10" strokeWidth="1" />
      <rect x="34" y="14" width="12" height="4" fill="#8a5e1a" />
      <rect x="34" y="24" width="12" height="4" fill="#8a5e1a" />
      <rect x="34" y="34" width="12" height="4" fill="#8a5e1a" />
      <defs>
        <linearGradient id="axeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#8a8578" />
          <stop offset="50%"  stopColor="#f2f5fa" />
          <stop offset="100%" stopColor="#8a8578" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function WeaponGlyph({ kind, dims }: { kind: WeaponKind; dims: WeaponDims }) {
  return kind === 'sword' ? <SwordShape dims={dims} /> : <AxeShape dims={dims} />;
}

function RotatedWeapon({
  angle,
  weapon,
  dims,
  opacity = 1,
  ghost = false,
}: {
  angle: number;
  weapon: WeaponKind;
  dims: WeaponDims;
  opacity?: number;
  ghost?: boolean;
}) {
  const halfW = dims.w / 2;
  return (
    <div
      style={{
        position: 'absolute',
        left: -halfW,
        bottom: 0,
        width: dims.w,
        height: dims.h,
        transformOrigin: 'center bottom',
        transform: `rotate(${angle}deg)`,
        pointerEvents: 'none',
        opacity,
        filter: ghost ? 'blur(1px)' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
      }}
    >
      <WeaponGlyph kind={weapon} dims={dims} />
    </div>
  );
}

interface RotLaneProps {
  label: string;
  labelJp: string;
  easingKey: EasingKey;
  weapon: WeaponKind;
  playToken: number;
  startAngle: number;
  endAngle: number;
}

function RotLane({ label, labelJp, easingKey, weapon, playToken, startAngle, endAngle }: RotLaneProps) {
  const [t, setT] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DUR = 1400;

  useEffect(() => {
    setDone(false);
    startRef.current = null;
    const ez = EASINGS[easingKey].fn;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const rawT = Math.min(1, elapsed / DUR);
      setT(ez(rawT));
      if (rawT < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playToken, easingKey]);

  const angle = startAngle + (endAngle - startAngle) * t;
  const color = EASINGS[easingKey].color;
  const dims = WEAPON_DIMS[weapon];

  const trailSteps = 8;
  const trail = Array.from({ length: trailSteps }, (_, i) => {
    const ti = ((i + 1) / trailSteps) * t;
    return startAngle + (endAngle - startAngle) * ti;
  });

  return (
    <div className="rot-lane">
      <div className="rot-lane-header">
        <div>
          <div className="rot-lane-label">{label}</div>
          <div className="rot-lane-sublabel" style={{ color }}>{labelJp}</div>
        </div>
        <div className="rot-angle-readout" style={{ borderColor: color, color }}>
          {angle.toFixed(0)}°
        </div>
      </div>
      <div className="rot-stage">
        <svg className="rot-protractor" viewBox="-100 -100 200 100" preserveAspectRatio="xMidYMax meet">
          <path d="M -80 0 A 80 80 0 0 1 80 0" fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" strokeDasharray="2 3" />
          {[-90, -45, 0, 45, 90].map((deg) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            return (
              <text key={deg} x={Math.cos(rad) * 88} y={Math.sin(rad) * 88} fontFamily="VT323" fontSize="8" fill={color} opacity="0.5" textAnchor="middle">
                {deg}°
              </text>
            );
          })}
        </svg>

        <div className="rot-pivot" style={{ borderColor: color, color }} />

        <div className="rot-pivot-anchor">
          {trail.map((a, i) => (
            <RotatedWeapon
              key={i}
              angle={a}
              weapon={weapon}
              dims={dims}
              opacity={((i + 1) / trailSteps) * 0.25}
              ghost
            />
          ))}
          <RotatedWeapon angle={angle} weapon={weapon} dims={dims} />
        </div>

        {done && (
          <div className="rot-hit-flash" style={{ background: `radial-gradient(circle, ${color}88, transparent 70%)` }} />
        )}
      </div>
    </div>
  );
}

interface ModeConfig {
  title: string;
  tech: string;
  desc: string;
  start: number;
  end: number;
  weapon: WeaponKind;
  contenders: EasingKey[];
}

const CONFIG: Record<Mode, ModeConfig> = {
  sword: {
    title: '剣の抜刀',
    tech: 'SWORD DRAW',
    desc: '鞘から抜き放つ瞬間。Ease Out Backで「シャキン」と一度通り過ぎて戻ると、鋭い決まり方になる。',
    start: -90,
    end: 0,
    weapon: 'sword',
    contenders: ['linear', 'easeOutQuad', 'easeOutBack'],
  },
  axe: {
    title: '戦斧の振り下ろし',
    tech: 'AXE CLEAVE',
    desc: 'Ease Inで終端に向けて加速。重力と質量を感じ、着弾の衝撃が跳ね上がる。',
    start: -90,
    end: 90,
    weapon: 'axe',
    contenders: ['linear', 'easeInCubic', 'easeInQuad'],
  },
  spin: {
    title: '回転斬り',
    tech: 'SPIN ATTACK',
    desc: '一周する動作でもEasingは効く。In-Outで両端が静かになり、溜め→解放のドラマが生まれる。',
    start: 0,
    end: 360,
    weapon: 'sword',
    contenders: ['linear', 'easeInOutCubic', 'easeOutElastic'],
  },
};

export default function RotationArena() {
  const [mode, setMode] = useState<Mode>('sword');
  const [playToken, setPlayToken] = useState(0);

  useEffect(() => {
    const h = setTimeout(() => setPlayToken((x) => x + 1), 200);
    return () => clearTimeout(h);
  }, [mode]);

  const c = CONFIG[mode];

  return (
    <div className="chapter">
      <div className="chapter-mark">
        <span className="num">III</span>
        <span>CHAPTER THREE — 近接武器の動作術</span>
      </div>
      <h2 className="chapter-title">回転とスイング ── 剣と斧の軌跡</h2>
      <p className="chapter-desc">
        投擲だけがアニメーションではない。<strong>剣の抜刀、斧の振り下ろし、回転斬り</strong> ── 近接武器の動きも、角度の時間変化にEasingを当てるだけで、生命感が宿る。
      </p>

      <div className="rot-mode-picker">
        {(Object.keys(CONFIG) as Mode[]).map((k) => (
          <button key={k} className={`rot-mode-btn ${mode === k ? 'active' : ''}`} onClick={() => setMode(k)} type="button">
            <div className="rot-mode-jp">{CONFIG[k].title}</div>
            <div className="rot-mode-tech">{CONFIG[k].tech}</div>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="rune-button" onClick={() => setPlayToken((x) => x + 1)} type="button">
          ⚔ STRIKE AGAIN
        </button>
      </div>

      <div className="rot-arena">
        {c.contenders.map((k) => (
          <RotLane
            key={k}
            label={EASINGS[k].en.toUpperCase()}
            labelJp={EASINGS[k].rpg}
            easingKey={k}
            weapon={c.weapon}
            playToken={playToken}
            startAngle={c.start}
            endAngle={c.end}
          />
        ))}
      </div>

      <div className="lore-plaque" style={{ marginTop: 16 }}>
        <span className="badge">◈ LESSON</span>
        <span className="text">{c.desc}</span>
      </div>
    </div>
  );
}
