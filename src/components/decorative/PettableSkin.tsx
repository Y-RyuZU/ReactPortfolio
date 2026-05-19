'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SparkleParticles, usePettingSparkles } from './petting';

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

/**
 * Skin avatar inside a breakable GlassCard. While the glass is intact,
 * clicks shatter it (existing behaviour). Once the glass has been
 * broken — and only then — hovering the freed skin emits heart/sparkle
 * particles at the cursor and the avatar wiggles gently in response.
 * The break-first gating is intentional: you have to "free" the
 * character before you can pet them.
 */
export function PettableSkin({
    src,
    alt,
    width,
    height,
    sizeClass = 'w-32',
}: PettableSkinProps) {
    const reduced = useReducedMotion();
    const [isBroken, setIsBroken] = useState(false);
    const petActive = isBroken && !reduced;
    const { sparkles, handleMouseMove } = usePettingSparkles(petActive);

    return (
        <motion.div
            className={`relative ${petActive ? 'cursor-grab active:cursor-grabbing' : ''}`}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                whileHover={
                    petActive
                        ? {
                            rotate: [0, -3, 3, -2, 2, 0],
                            transition: {
                                duration: 0.9,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            },
                        }
                        : undefined
                }
            >
                <GlassCard
                    className="p-4"
                    showHighlight={false}
                    breakable={true}
                    onBreak={() => setIsBroken(true)}
                >
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

            <SparkleParticles sparkles={sparkles} />
        </motion.div>
    );
}
