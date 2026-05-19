'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PettableSkinProps {
    src: string;
    alt: string;
    /** Image intrinsic width — used by Next/Image. */
    width: number;
    /** Image intrinsic height — used by Next/Image. */
    height: number;
    /** Tailwind size class applied to the rendered image (e.g. 'w-32'). */
    sizeClass?: string;
}

interface Sparkle {
    id: number;
    x: number;
    y: number;
    glyph: string;
    drift: number;
}

const GLYPHS = ['♥', '♡', '✦', '✧'];

// Module-scoped so multiple instances don't collide on re-renders.
let nextSparkleId = 0;

/**
 * Skin avatar that responds to "petting" — moving the cursor over it spawns
 * heart/sparkle particles at the cursor location, and the card gently wiggles
 * while hovered. Still uses GlassCard with breakable=true so click → shatter
 * remains the secondary easter-egg interaction.
 */
export function PettableSkin({
    src,
    alt,
    width,
    height,
    sizeClass = 'w-32',
}: PettableSkinProps) {
    const reduced = useReducedMotion();
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);
    const lastSpawnRef = useRef(0);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (reduced) return;
            const now = performance.now();
            if (now - lastSpawnRef.current < 90) return; // throttle ≈11/s
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
        [reduced]
    );

    return (
        <motion.div
            className="relative cursor-grab active:cursor-grabbing"
            onMouseMove={handleMouseMove}
        >
            <motion.div
                whileHover={
                    reduced
                        ? undefined
                        : {
                            rotate: [0, -3, 3, -2, 2, 0],
                            transition: {
                                duration: 0.9,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            },
                        }
                }
            >
                <GlassCard className="p-4" showHighlight={false} breakable={true}>
                    <Image
                        src={src}
                        alt={alt}
                        width={width}
                        height={height}
                        className={`mc-pixel h-auto ${sizeClass} select-none`}
                        draggable={false}
                    />
                </GlassCard>
            </motion.div>

            {/* Heart / sparkle particles spawned at the cursor while petting */}
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
        </motion.div>
    );
}
