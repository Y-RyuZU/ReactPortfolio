'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { EASINGS, type EasingKey } from '../easings';
import { PSEUDOCODE } from '../pseudocode';

interface Props {
  easingKey: EasingKey | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function PseudocodeDialog({ easingKey, open, onOpenChange }: Props) {
  const entry = easingKey ? PSEUDOCODE[easingKey] : null;
  const easing = easingKey ? EASINGS[easingKey] : null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="easing-tome-dialog-overlay" />
        <Dialog.Content className="easing-tome-dialog-content">
          {entry && easing && easingKey && (
            <>
              <Dialog.Close asChild>
                <button className="dlg-close" aria-label="Close" type="button">✕</button>
              </Dialog.Close>

              <div className="dlg-eyebrow">◈ {entry.modelTag}</div>
              <Dialog.Title asChild>
                <h3 className="dlg-title">{easing.en}</h3>
              </Dialog.Title>
              <Dialog.Description asChild>
                <div className="dlg-sub">{easing.rpg} · {entry.modelLabel}</div>
              </Dialog.Description>

              <div className="dlg-section">
                <div className="dlg-section-label">✦ PER-FRAME PSEUDOCODE · 毎フレーム更新</div>
                <div className="dlg-note" style={{ marginBottom: 10 }}>
                  {entry.summary}
                </div>
                <pre className="dlg-code"><code>{entry.code}</code></pre>
              </div>

              {entry.afterNote && (
                <div className="dlg-section">
                  <div className="dlg-section-label">◇ USAGE · 使いどころ</div>
                  <div className="dlg-note">{entry.afterNote}</div>
                </div>
              )}

              <div className="dlg-section">
                <div className="dlg-section-label">◇ PARAMETRIC FORM (参考) · 従来のt∈[0,1]記法</div>
                <div className="dlg-note">
                  終着点が既知なら従来通り <code>pos = start + (end - start) × f(t)</code> で書けるが、
                  到達点を事前計算しないゲームロジックでは上記の毎フレーム更新の方が自然に収まる。
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
