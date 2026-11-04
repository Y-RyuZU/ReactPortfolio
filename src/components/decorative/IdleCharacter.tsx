'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SparkleParticles, usePettingSparkles } from './petting';

type Pose = 'waving' | 'sitting';

interface IdleCharacterProps {
    pose: Pose;
    className?: string;
    width?: number;
    /** Flip horizontally — useful when the pose should face the page content. */
    flip?: boolean;
}

const POSE_CONFIG: Record<
    Pose,
    { src: string; alt: string; aspect: number; intrinsicW: number; intrinsicH: number }
> = {
    waving: {
        src: '/images/poses/wave.png',
        alt: 'Waving character',
        aspect: 673 / 915,
        intrinsicW: 673,
        intrinsicH: 915,
    },
    sitting: {
        src: '/images/poses/sit.png',
        alt: 'Sitting character',
        aspect: 572 / 837,
        intrinsicW: 572,
        intrinsicH: 837,
    },
};

const ENTRANCE_EASE = [0.34, 1.56, 0.64, 1] as const;

export function IdleCharacter({ pose, className, width = 180, flip }: IdleCharacterProps) {
    const reduced = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const visible = useInView(ref, { margin: '80px 0px' });
    const { src, alt, aspect, intrinsicW, intrinsicH } = POSE_CONFIG[pose];
    const height = Math.round(width / aspect);
    const { sparkles, handleMouseMove } = usePettingSparkles(!reduced);

    // Entrance: small back-out, fires once when scrolled into view.
    const initial = reduced ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.8 };
    const whileInView = reduced
        ? { opacity: 1, transition: { duration: 0.4 } }
        : {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.7, ease: ENTRANCE_EASE },
        };

    return (
        <motion.div
            ref={ref}
            className={`relative pointer-events-auto ${reduced ? '' : 'cursor-grab active:cursor-grabbing'} ${className ?? ''}`}
            initial={initial}
            whileInView={whileInView}
            whileHover={reduced ? undefined : { scale: 1.06, transition: { duration: 0.25, ease: 'easeOut' } }}
            viewport={{ once: true, margin: '-10% 0px' }}
            style={{ width, height }}
            onMouseMove={handleMouseMove}
        >
            <div
                className="mc-idle-character"
                data-pose={pose}
                data-animate={visible && !reduced || undefined}
                style={{ width: '100%', height: '100%', transform: flip ? 'scaleX(-1)' : undefined }}
            >
                <Image
                    src={src}
                    alt={alt}
                    width={intrinsicW}
                    height={intrinsicH}
                    sizes={`${width}px`}
                    className="mc-pixel select-none pointer-events-none w-full h-full object-contain"
                    draggable={false}
                />
            </div>
            <SparkleParticles sparkles={sparkles} />
        </motion.div>
    );
}
