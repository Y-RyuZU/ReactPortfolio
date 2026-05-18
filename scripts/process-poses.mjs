/**
 * Strip green-screen background from pose PNGs and emit transparent assets
 * to public/images/.
 *
 * Inputs (overridable via $env:POSE_SRC):
 *   <POSE_SRC>/1.png  →  public/images/ryuzu.png      (replaces existing skin)
 *   <POSE_SRC>/2.png  →  public/images/poses/wave.png
 *   <POSE_SRC>/3.png  →  public/images/poses/sit.png
 *
 * Algorithm:
 *   1. Read RGBA pixels.
 *   2. Hard-key bright greens (G dominates by a wide margin) → alpha 0.
 *   3. Soften residual greenscreen halo by reducing the green channel
 *      where green still exceeds red+blue, and feathering alpha.
 *   4. sharp.trim() removes the resulting transparent border.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const DEFAULT_SRC =
  'C:/Users/RyuZU Y/Downloads/4GySWpSr777sYrgruwpEFwvxKRL4l4sq5ZiRlTH0/thanks/おまけのポーズ集';
const srcDir = process.env.POSE_SRC || DEFAULT_SRC;

const jobs = [
  { input: '1.png', output: 'public/images/ryuzu.png' },
  { input: '2.png', output: 'public/images/poses/wave.png' },
  { input: '3.png', output: 'public/images/poses/sit.png' },
];

/** Remove green background + soften residual halo, in-place on RGBA buffer. */
function keyOutGreen(buf) {
  const len = buf.length;
  for (let i = 0; i < len; i += 4) {
    const r = buf[i];
    const g = buf[i + 1];
    const b = buf[i + 2];

    // Hard key: bright, dominant green → fully transparent.
    if (g > 170 && r < 140 && b < 140 && g - Math.max(r, b) > 40) {
      buf[i + 3] = 0;
      continue;
    }

    // Soft halo: pixel still has green tint — dial back green and feather alpha.
    const greenExcess = g - Math.max(r, b);
    if (greenExcess > 20) {
      const newG = Math.max(r, b) + Math.floor(greenExcess * 0.2);
      buf[i + 1] = newG;
      // Reduce alpha proportionally for the worst greens (gives clean edges).
      if (greenExcess > 60) {
        const a = buf[i + 3];
        buf[i + 3] = Math.max(0, a - (greenExcess - 60) * 3);
      }
    }
  }
}

async function processOne({ input, output }) {
  const inAbs = path.join(srcDir, input);
  const outAbs = path.join(repoRoot, output);
  await mkdir(path.dirname(outAbs), { recursive: true });

  const { data, info } = await sharp(inAbs)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  keyOutGreen(data);

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
    .png({ compressionLevel: 9 })
    .toFile(outAbs);

  console.log(`✓ ${input} → ${output}`);
}

for (const job of jobs) {
  await processOne(job);
}
console.log('Done.');
