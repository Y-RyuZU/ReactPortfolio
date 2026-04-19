'use client';

import { useLoop } from '../LoopContext';

export default function LoopToggle() {
  const { looping, toggle } = useLoop();
  return (
    <div className="loop-toggle-wrap">
      <button
        type="button"
        className={`rune-button loop-toggle ${looping ? 'on' : 'off'}`}
        onClick={toggle}
        aria-pressed={looping}
        aria-label={looping ? 'Stop continuous animation loop' : 'Start continuous animation loop'}
      >
        {looping ? '◉ LOOP · ON' : '◎ LOOP · OFF'}
      </button>
    </div>
  );
}
