'use client';

import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Shared "petting" interaction primitives — used by both PettableSkin
 * (the glass-card avatar in About) and IdleCharacter (the free-floating
 * wave / sit poses). Cursor movement over the element spawns heart and
 * sparkle glyphs at the cursor; the host component decides what extra
 * reaction to layer on (wiggle, scale, etc.).
 */

const GLYPHS = ['♥', '♡', '✦', '✧'];

interface Sparkle {
    id: number;
    x: number;
    y: number;
    glyph: string;
    drift: number;
}

// Module-scoped so unique ids hold across many concurrent instances.
let nextSparkleId = 0;

/**
 * Returns a mouse-move handler that spawns short-lived sparkle particles
 * at the cursor (throttled), plus the active particles to render.
 * Pass `enabled=false` to silently ignore movement (e.g. before the
 * glass has been broken, or under reduced-motion).
 */
export function usePettingSparkles(enabled: boolean) {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);
    const lastSpawnRef = useRef(0);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            if (!enabled) return;
            const now = performance.now();
            if (now - lastSpawnRef.current < 90) return; // ≈11 spawns/sec
            lastSpawnRef.current = now;

            const rect = e.currentTarget.getBoundingClientRect();
            const id = nextSparkleId++;
            const sparkle: Sparkle = {
                id,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
                drift: (Math.random() - 0.5) * 28,
            };
            setSparkles((prev) => [...prev.slice(-9), sparkle]);
            window.setTimeout(() => {
                setSparkles((prev) => prev.filter((s) => s.id !== id));
            }, 950);
        },
        [enabled]
    );

    return { sparkles, handleMouseMove };
}

interface SparkleParticlesProps {
    sparkles: Sparkle[];
}

/**
 * Overlay layer that renders the active sparkle particles produced by
 * {@link usePettingSparkles}. Drop it as a sibling of your content,
 * inside a `position: relative` container.
 */
export function SparkleParticles({ sparkles }: SparkleParticlesProps) {
    return (
        <AnimatePresence>
            {sparkles.map((s) => (
                <motion.span
                    key={s.id}
                    className="pointer-events-none absolute z-30 text-pink-500 dark:text-pink-400 text-xl font-bold select-none drop-shadow-[0_0_4px_rgba(244,114,182,0.7)]"
                    style={{ left: s.x, top: s.y, translateX: '-50%', translateY: '-50%' }}
                    initial={{ opacity: 0, scale: 0.3, y: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.3, 1.2, 0.4],
                        x: s.drift,
                        y: -55,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    aria-hidden="true"
                >
                    {s.glyph}
                </motion.span>
            ))}
        </AnimatePresence>
    );
}
