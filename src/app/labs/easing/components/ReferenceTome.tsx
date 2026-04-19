'use client';

import { useState } from 'react';
import { EASINGS, EASING_KEYS, SIGILS, type EasingKey } from '../easings';
import PseudocodeDialog from './PseudocodeDialog';

export default function ReferenceTome() {
  const [active, setActive] = useState<EasingKey | null>(null);

  return (
    <div className="chapter">
      <div className="chapter-mark">
        <span className="num">VI</span>
        <span>CHAPTER SIX — 大全・総覧</span>
      </div>
      <h2 className="chapter-title">Easing大全 ── 関数名の一覧</h2>
      <p className="chapter-desc">
        全術式の名前を一枚で見渡す。名前をタップすれば、<strong>終着点を事前に計算しなくても毎フレーム更新で同じふるまいを作る擬似コード</strong>が開く。
      </p>

      <div className="tome-names-grid">
        {EASING_KEYS.map((k) => {
          const e = EASINGS[k];
          return (
            <button
              key={k}
              type="button"
              className="tome-name-card"
              onClick={() => setActive(k)}
              style={{ borderLeft: `6px solid ${e.color}` }}
            >
              <span className="tome-name-sigil" style={{ color: e.color, background: `${e.color}22` }}>
                {SIGILS[k]}
              </span>
              <span className="tome-name-body">
                <span className="tome-name-en">{e.en}</span>
                <span className="tome-name-jp">{e.rpg} · {e.jp}</span>
              </span>
              <span className="tome-name-hint">VIEW ▸</span>
            </button>
          );
        })}
      </div>

      <PseudocodeDialog
        easingKey={active}
        open={active !== null}
        onOpenChange={(v) => { if (!v) setActive(null); }}
      />
    </div>
  );
}
