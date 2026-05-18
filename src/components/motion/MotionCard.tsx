'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MotionCardProps {
    children: ReactNode;
    className?: string;
    /** Disable lift effect (e.g. for non-interactive contexts). */
    lift?: boolean;
}

export function MotionCard({ children, className, lift = true }: MotionCardProps) {
    const reduced = useReducedMotion();
    const enabled = lift && !reduced;

    return (
        <motion.div
            className={className}
            whileHover={
                enabled
                    ? { y: -4, scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }
                    : undefined
            }
            whileTap={enabled ? { scale: 0.98 } : undefined}
        >
            {children}
        </motion.div>
    );
}
