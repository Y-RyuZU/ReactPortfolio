'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SectionRevealProps {
    children: ReactNode;
    delay?: number;
    y?: number;
    className?: string;
    /** Viewport margin shorthand: how far into view before the element fires. */
    margin?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function SectionReveal({
    children,
    delay = 0,
    y = 24,
    className,
    margin = '-15% 0px',
}: SectionRevealProps) {
    const reduced = useReducedMotion();

    const variants: Variants = reduced
        ? {
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.3, delay } },
        }
        : {
            hidden: { opacity: 0, y },
            show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay, ease: EASE },
            },
        };

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin }}
            variants={variants}
        >
            {children}
        </motion.div>
    );
}
