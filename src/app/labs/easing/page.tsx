import type { Metadata } from 'next';
import './easing-tome.css';
import { LoopProvider } from './LoopContext';
import LoopToggle from './components/LoopToggle';
import ThrowArena from './components/ThrowArena';
import RotationArena from './components/RotationArena';
import ReferenceTome from './components/ReferenceTome';

export const metadata: Metadata = {
  title: 'Easingの魔導書 — Tome of Easing',
  description: '剣と魔法の世界観で学ぶ、ゲームアニメーションのためのEasing関数ガイド。投擲、回転、スプリング、反発まで、毎フレームの物理更新として解説する。',
};

export default function EasingTomePage() {
  return (
    <LoopProvider>
      <div className="easing-tome">
        <div className="app">
          <header className="crest-header">
            <div className="crest-subtitle">◆ Codex Animatus ◆ A Tome on the Art of Motion ◆</div>
            <h1 className="crest-title">
              The Tome of <span className="accent">Easing</span>
            </h1>
            <div className="crest-jp">
              <span className="float-sigil">✦</span>&nbsp;&nbsp; Easingの魔導書 &nbsp;&nbsp;<span className="float-sigil">✦</span>
            </div>
            <div className="crest-divider">
              <span className="line" />
              <span>❖</span>
              <span className="line" />
            </div>
            <div
              style={{
                marginTop: 20,
                maxWidth: 680,
                marginLeft: 'auto',
                marginRight: 'auto',
                color: 'var(--parchment-dark)',
                lineHeight: 1.8,
                fontSize: 15,
              }}
            >
              ゲームアニメーションにおいて、Easing関数を意識するだけで表現は劇的に豊かになる。
              <br />
              この古書は、直線的な動きと曲線的な動きの違いを、剣と魔法の世界で解き明かす。
            </div>
          </header>

          <div className="scroll">
            <div className="scroll-header">
              <div className="scroll-icon">🏹</div>
              <div className="scroll-title-block">
                <div className="scroll-title">THE WARRIOR&apos;S THROW</div>
                <div className="scroll-title-jp">戦士の投擲術</div>
              </div>
              <LoopToggle />
            </div>
            <ThrowArena />
          </div>

          <div className="spacer" />

          <div className="scroll">
            <div className="scroll-header">
              <div className="scroll-icon">⚔</div>
              <div className="scroll-title-block">
                <div className="scroll-title">SWING &amp; ROTATION</div>
                <div className="scroll-title-jp">剣と斧の回転動作</div>
              </div>
              <LoopToggle />
            </div>
            <RotationArena />
          </div>

          <div className="spacer" />

          <div className="scroll">
            <div className="scroll-header">
              <div className="scroll-icon">📖</div>
              <div className="scroll-title-block">
                <div className="scroll-title">THE GRAND CODEX</div>
                <div className="scroll-title-jp">Easing大全 — 総覧</div>
              </div>
              <LoopToggle />
            </div>
            <ReferenceTome />
          </div>

          <footer className="footer-scroll">
            ◈ Finis Codicis ◈ 魔導書・完 ◈ May Thy Animations Gain Soul ◈
          </footer>
        </div>
      </div>
    </LoopProvider>
  );
}
