'use client';

import { useEffect, useRef, useState } from 'react';
import { EASINGS, type EasingKey } from '../easings';

type WeaponKey = 'axe' | 'arrow' | 'fireball';

interface WeaponConfig {
  name: string;
  en: string;
  glyph: string;
  svg: 'axe' | 'arrow' | 'fireball';
  spin: boolean;
  arcFactor: number;
}

const WEAPONS: Record<WeaponKey, WeaponConfig> = {
  axe:      { name: '戦斧',     en: 'Axe',      glyph: '🪓', svg: 'axe',      spin: true,  arcFactor: 1.0  },
  arrow:    { name: '魔弓の矢', en: 'Arrow',    glyph: '🏹', svg: 'arrow',    spin: false, arcFactor: 0.35 },
  fireball: { name: '火球術',   en: 'Fireball', glyph: '🔥', svg: 'fireball', spin: false, arcFactor: 0.6  },
};

const DUR = 1400;

function ProjectileSVG({ kind }: { kind: WeaponConfig['svg'] }) {
  if (kind === 'axe') {
    return (
      <svg viewBox="0 0 40 40" style={{ width: '100%', height: '100%' }}>
        <rect x="18" y="8" width="4" height="28" fill="#6b4423" stroke="#2a1d10" strokeWidth="1" rx="1" />
        <rect x="17" y="32" width="6" height="4" fill="#c89b3c" stroke="#2a1d10" strokeWidth="0.5" />
        <path d="M 12 4 Q 4 10 8 18 L 20 16 L 20 6 Z" fill="#c9d3e0" stroke="#2a1d10" strokeWidth="1.2" />
        <path d="M 28 4 Q 36 10 32 18 L 20 16 L 20 6 Z" fill="#e8eef5" stroke="#2a1d10" strokeWidth="1.2" />
        <circle cx="20" cy="10" r="1.5" fill="#c8962a" />
        <path d="M 14 8 L 17 12" stroke="#fff" strokeWidth="0.6" opacity="0.6" />
      </svg>
    );
  }
  if (kind === 'arrow') {
    return (
      <svg viewBox="0 0 60 20" style={{ width: '100%', height: '100%' }}>
        <rect x="12" y="8.5" width="34" height="3" fill="#8a5e1a" stroke="#2a1d10" strokeWidth="0.8" />
        <path d="M 6 10 L 14 6 L 14 14 Z" fill="#b8464d" stroke="#2a1d10" strokeWidth="0.8" />
        <path d="M 2 10 L 10 6 L 10 14 Z" fill="#c8962a" stroke="#2a1d10" strokeWidth="0.8" />
        <path d="M 46 8 L 58 10 L 46 12 Z" fill="#c9d3e0" stroke="#2a1d10" strokeWidth="1" />
        <path d="M 48 9 L 54 10 L 48 11 Z" fill="#fff" opacity="0.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 40" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="fball" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#fff2a0" />
          <stop offset="40%" stopColor="#ff9020" />
          <stop offset="100%" stopColor="#8b2a2a" />
        </radialGradient>
      </defs>
      <path d="M 4 24 Q 10 16 20 20" fill="none" stroke="#ff9020" strokeWidth="3" opacity="0.4" strokeLinecap="round" />
      <path d="M 2 28 Q 8 22 16 24" fill="none" stroke="#ffcc40" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      <circle cx="22" cy="20" r="13" fill="url(#fball)" stroke="#2a1d10" strokeWidth="0.8" />
      <circle cx="19" cy="17" r="5" fill="#fff2a0" opacity="0.8" />
      <circle cx="20" cy="19" r="2" fill="#fff" />
    </svg>
  );
}

function Hero({ acting }: { acting: boolean }) {
  return (
    <svg viewBox="0 0 60 100" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="30" cy="94" rx="18" ry="3" fill="#000" opacity="0.4" />
      <path d="M 14 50 Q 10 80 14 92 L 46 92 Q 50 80 46 50 Z" fill="#2d3561" stroke="#1a1f3d" strokeWidth="1.2" />
      <rect x="20" y="42" width="20" height="38" fill="#8b2a2a" stroke="#2a1d10" strokeWidth="1" />
      <rect x="19" y="60" width="22" height="4" fill="#c89b3c" stroke="#2a1d10" strokeWidth="0.8" />
      <rect x="28" y="60" width="4" height="4" fill="#8a5e1a" />
      <circle cx="30" cy="30" r="11" fill="#e8c8a0" stroke="#2a1d10" strokeWidth="1.2" />
      <path d="M 19 26 Q 19 16 30 14 Q 41 16 41 26 L 41 30 L 19 30 Z" fill="#8a8578" stroke="#2a1d10" strokeWidth="1.2" />
      <rect x="26" y="28" width="8" height="3" fill="#2a1d10" />
      <path d="M 26 26 L 30 16 L 34 26" fill="none" stroke="#c89b3c" strokeWidth="1" />
      <path d="M 28 14 Q 30 4 32 14" fill="#b8464d" stroke="#2a1d10" strokeWidth="0.8" />
      <rect x={acting ? 38 : 40} y={acting ? 40 : 46} width="6" height="18" fill="#8b2a2a" stroke="#2a1d10" strokeWidth="1" transform={acting ? 'rotate(-30 41 50)' : ''} />
    </svg>
  );
}

function Target({ hit }: { hit: boolean }) {
  return (
    <svg viewBox="0 0 60 100" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="30" cy="94" rx="18" ry="3" fill="#000" opacity="0.4" />
      <rect x="27" y="40" width="6" height="54" fill="#6b4423" stroke="#2a1d10" strokeWidth="1" />
      <circle cx="30" cy="40" r="22" fill="#f2e3c0" stroke="#2a1d10" strokeWidth="2" />
      <circle cx="30" cy="40" r="17" fill="#c9d3e0" stroke="#2a1d10" strokeWidth="1" />
      <circle cx="30" cy="40" r="12" fill="#f2e3c0" stroke="#2a1d10" strokeWidth="1" />
      <circle cx="30" cy="40" r="7" fill="#b8464d" stroke="#2a1d10" strokeWidth="1" />
      <circle cx="30" cy="40" r="2.5" fill="#2a1d10" />
      {hit && (
        <>
          <path d="M 8 40 L 2 36 M 8 40 L 2 44 M 8 40 L 4 40" stroke="#ffee88" strokeWidth="1.5" opacity="0.9" />
          <path d="M 52 40 L 58 36 M 52 40 L 58 44" stroke="#ffee88" strokeWidth="1.5" opacity="0.9" />
        </>
      )}
    </svg>
  );
}

function ImpactBurst() {
  return (
    <svg viewBox="0 0 80 80" style={{ width: '100%', height: '100%' }}>
      <circle cx="40" cy="40" r="22" fill="#ffee88" opacity="0.8" />
      <circle cx="40" cy="40" r="14" fill="#fff" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="40" y1="40" x2={40 + Math.cos((a * Math.PI) / 180) * 35} y2={40 + Math.sin((a * Math.PI) / 180) * 35} stroke="#ffee88" strokeWidth="3" strokeLinecap="round" />
      ))}
      <text x="40" y="14" fontFamily="Cinzel" fontSize="12" fontWeight="700" fill="#b8464d" textAnchor="middle" stroke="#2a1d10" strokeWidth="0.5">
        HIT!
      </text>
    </svg>
  );
}

interface ThrowLaneProps {
  label: string;
  labelJp: string;
  easingKey: EasingKey;
  weapon: WeaponConfig;
  playToken: number;
  arcFactor: number;
}

function ThrowLane({ label, labelJp, easingKey, weapon, playToken, arcFactor }: ThrowLaneProps) {
  const [pos, setPos] = useState(0);
  const [burst, setBurst] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const burstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (playToken === 0) return;
    setBurst(false);
    startRef.current = null;
    const ez = EASINGS[easingKey].fn;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / DUR);
      setPos(ez(t));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setBurst(true);
        burstTimerRef.current = setTimeout(() => setBurst(false), 700);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (burstTimerRef.current !== null) clearTimeout(burstTimerRef.current);
    };
  }, [playToken, easingKey]);

  const leftPct = 8 + pos * 80;
  const arcHeight = 120 * arcFactor;
  const rawT = pos;
  const dy = -4 * arcHeight * rawT * (1 - rawT);
  const rotation = weapon.spin ? pos * 720 : weapon.svg === 'arrow' ? -10 + (1 - rawT * 2) * 20 : 0;

  const color = EASINGS[easingKey].color;

  return (
    <div className="arena-lane">
      <div className="lane-label">
        {label} <span className="jp">{labelJp}</span>
      </div>
      <div className="ground" />
      <div className="hero-stand">
        <Hero acting={pos > 0 && pos < 0.2} />
      </div>
      <div className="target-stand">
        <Target hit={burst} />
      </div>
      <div className="projectile" style={{ left: `${leftPct}%`, bottom: `calc(60px + ${-dy}px)`, transform: 'translateX(-50%)' }}>
        <div
          style={{
            width: weapon.svg === 'arrow' ? 60 : 40,
            height: weapon.svg === 'arrow' ? 20 : 40,
            transform: `rotate(${rotation}deg)`,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
          }}
        >
          <ProjectileSVG kind={weapon.svg} />
        </div>
      </div>
      <div className="impact-burst" style={{ opacity: burst ? 1 : 0 }}>
        {burst && <ImpactBurst />}
      </div>
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', width: '100%', height: '100%', zIndex: 1 }} preserveAspectRatio="none">
        <line x1="0%" y1="85%" x2="100%" y2="85%" stroke={color} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />
      </svg>
    </div>
  );
}

export default function ThrowArena() {
  const [weaponKey, setWeaponKey] = useState<WeaponKey>('axe');
  const [playToken, setPlayToken] = useState(0);

  useEffect(() => {
    const h = setTimeout(() => setPlayToken((x) => x + 1), 200);
    return () => clearTimeout(h);
  }, [weaponKey]);

  const weapon = WEAPONS[weaponKey];

  return (
    <div className="chapter">
      <div className="chapter-mark">
        <span className="num">II</span>
        <span>CHAPTER TWO — 投擲武器の試練</span>
      </div>
      <h2 className="chapter-title">直線と曲線 ── 戦士が放つ一投の違い</h2>

      <div className="spacer-sm" />

      <div className="arena">
        <ThrowLane label="LINEAR"   labelJp="兵士の行軍 · 直線"   easingKey="linear"       weapon={weapon} playToken={playToken} arcFactor={weapon.arcFactor * 0.3} />
        <ThrowLane label="EASE OUT" labelJp="放たれし矢 · 減速"   easingKey="easeOutQuad"  weapon={weapon} playToken={playToken} arcFactor={weapon.arcFactor}       />
        <ThrowLane label="EASE IN"  labelJp="隕石落下 · 加速"     easingKey="easeInCubic"  weapon={weapon} playToken={playToken} arcFactor={weapon.arcFactor * 0.5} />

        <div className="arena-controls">
          <span className="group-label">⚔ WEAPON</span>
          <div className="weapon-pick">
            {(Object.keys(WEAPONS) as WeaponKey[]).map((k) => (
              <button key={k} className={weaponKey === k ? 'active' : ''} onClick={() => setWeaponKey(k)} type="button">
                <span style={{ fontSize: 16 }}>{WEAPONS[k].glyph}</span>
                <span>{WEAPONS[k].name}</span>
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <button className="rune-button" onClick={() => setPlayToken((x) => x + 1)} type="button">
            ⚡ CAST AGAIN
            <span className="sparkle">✦</span>
          </button>
        </div>
      </div>

      <div className="lore-plaque" style={{ marginTop: 20 }}>
        <span className="badge">◈ LESSON</span>
        <span className="text">
          投擲の現実感は<strong style={{ color: 'var(--gold-bright)' }}>到達直前の減速</strong>と<strong style={{ color: 'var(--gold-bright)' }}>放射直後の初速</strong>、そして重力による<strong style={{ color: 'var(--gold-bright)' }}>弧の高さ</strong>で決まる。Linearだけでは「矢が空中を滑って行く」違和感が拭えない。
        </span>
      </div>
    </div>
  );
}
