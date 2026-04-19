'use client';

import { useEffect, useRef, useState } from 'react';
import { EASINGS, type EasingKey } from '../easings';
import { useLoop } from '../LoopContext';

const DUR = 1800;

function DuelTrack({ easingKey, glyph, token, color }: { easingKey: EasingKey; glyph: string; token: number; color: string }) {
  const { looping } = useLoop();
  const [pos, setPos] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!looping) return;
    startRef.current = null;
    const ez = EASINGS[easingKey].fn;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = (now - startRef.current) % DUR;
      setPos(ez(elapsed / DUR));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [easingKey, token, looping]);

  return (
    <div className="duel-track">
      <div
        className="duel-mover"
        style={{
          left: `calc(12px + ${pos * 88}%)`,
          transform: 'translateY(-50%) translateX(-50%)',
          background: `linear-gradient(180deg, ${color}, ${color}88)`,
          boxShadow: `0 0 14px ${color}`,
        }}
      >
        {glyph}
      </div>
    </div>
  );
}

interface Scenario {
  title: string;
  tech: string;
  glyph: string;
  linear: EasingKey;
  eased: EasingKey;
  note: string;
}

const SCENARIOS: Scenario[] = [
  { title: 'メニュー出現',     tech: 'MENU POP-IN',     glyph: '📜', linear: 'linear', eased: 'easeOutBack',    note: 'Linearだと冷たい。Ease Out Backで一度行き過ぎて戻ると「カチッ」と決まる。' },
  { title: '剣の振り下ろし',   tech: 'SWORD SWING',     glyph: '⚔', linear: 'linear', eased: 'easeInCubic',    note: 'Ease Inで終端に向けて加速。振り下ろしの重みが出る。' },
  { title: '宝箱オープン',     tech: 'TREASURE OPEN',   glyph: '💎', linear: 'linear', eased: 'easeOutElastic', note: 'Elasticでバネのように震える。驚きと報酬感が倍増。' },
  { title: 'コイン収集',       tech: 'COIN COLLECT',    glyph: '◉', linear: 'linear', eased: 'easeOutBounce',  note: 'Bounceで床に落ちて跳ねる。物理的な「質量」を感じる。' },
  { title: '魔法チャージ',     tech: 'MANA CHARGE',     glyph: '✦', linear: 'linear', eased: 'easeInQuad',     note: 'Ease Inで徐々に加速。溜めの緊張感が生まれる。' },
  { title: 'カメラパン',       tech: 'CAMERA PAN',      glyph: '◈', linear: 'linear', eased: 'easeInOutCubic', note: '両端で減速。酔わず、かつ劇的。映画的カメラワークの基本。' },
];

export default function DuelPanel() {
  const [token, setToken] = useState(0);

  return (
    <div className="chapter">
      <div className="chapter-mark">
        <span className="num">V</span>
        <span>CHAPTER FIVE — 術の決闘</span>
      </div>
      <h2 className="chapter-title">Linear vs Easing ── 一対一の勝負</h2>

      <div style={{ textAlign: 'right', marginBottom: 12 }}>
        <button className="rune-button" onClick={() => setToken((x) => x + 1)} type="button">
          ⚔ REMATCH
        </button>
      </div>

      <div className="compare-panel">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr 1fr',
            gap: 16,
            padding: '0 0 12px',
            borderBottom: '2px solid var(--gold-deep)',
            fontFamily: 'Cinzel, serif',
            fontSize: 10,
            letterSpacing: '0.3em',
            color: 'var(--gold-bright)',
          }}
        >
          <span>SCENE</span>
          <span style={{ textAlign: 'center' }}>◇ LINEAR ◇</span>
          <span style={{ textAlign: 'center' }}>◆ EASED ◆</span>
        </div>
        {SCENARIOS.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr 1fr',
              gap: 16,
              alignItems: 'center',
              padding: '14px 0',
              borderBottom: i === SCENARIOS.length - 1 ? 'none' : '1px dashed rgba(200,150,42,0.2)',
            }}
          >
            <div className="duel-label">
              <div className="jp">{s.title}</div>
              <div className="tech">{s.tech}</div>
            </div>
            <DuelTrack easingKey={s.linear} glyph={s.glyph} token={token} color="#8a8578" />
            <DuelTrack easingKey={s.eased}  glyph={s.glyph} token={token} color={EASINGS[s.eased].color} />
            <div
              style={{
                gridColumn: '2 / 4',
                marginTop: 6,
                fontSize: 12,
                color: 'var(--parchment-dark)',
                opacity: 0.75,
                fontStyle: 'italic',
                paddingLeft: 4,
              }}
            >
              ※ {s.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
