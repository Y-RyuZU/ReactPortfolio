import type { CSSProperties } from 'react';

const faces = [
  { name: 'front', u: 4, v: 4, w: 3, h: 12 },
  { name: 'back', u: 11, v: 4, w: 3, h: 12 },
  { name: 'left', u: 0, v: 4, w: 4, h: 12 },
  { name: 'right', u: 7, v: 4, w: 4, h: 12 },
  { name: 'top', u: 4, v: 0, w: 3, h: 4 },
  { name: 'bottom', u: 7, v: 0, w: 3, h: 4 },
];

/** Six UV-mapped faces, plus the independent outer sleeve layer. No cutout. */
export function MinecraftHand({ left = false }: { left?: boolean }) {
  return (
    <span className="mc-arm-rig" aria-hidden="true">
      {[false, true].map(sleeve => (
        <span className={`mc-arm-cuboid ${sleeve ? 'mc-arm-sleeve' : ''}`} key={String(sleeve)}>
          {faces.map(face => (
            <span
              key={face.name}
              className={`mc-arm-face mc-face-${face.name}`}
              style={{
                backgroundSize: `${64 / face.w * 100}% ${64 / face.h * 100}%`,
                backgroundPosition: `${(face.u + (left ? sleeve ? 48 : 32 : 40)) / (64 - face.w) * 100}% ${(face.v + (left ? 48 : sleeve ? 32 : 16)) / (64 - face.h) * 100}%`,
              } as CSSProperties}
            />
          ))}
        </span>
      ))}
    </span>
  );
}

export function HeldBlock() {
  return (
    <span className="builder-cube" aria-hidden="true">
      {faces.map(face => <i className={`mc-block-face mc-face-${face.name}`} key={face.name} />)}
    </span>
  );
}
