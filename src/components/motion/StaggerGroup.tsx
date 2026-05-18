'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface StaggerGroupProps {
    children: ReactNode;
    stagger?: number;
    delayChildren?: number;
    className?: string;
    /** Element type to render. Defaults to 'div'. */
    as?: 'div' | 'ul' | 'section';
    /** Set false to re-trigger on scroll-back. Default true. */
    once?: boolean;
    margin?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const CHILD: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: EASE },
    },
};

const CHILD_REDUCED: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.3 } },
};

export function StaggerGroup({
    children,
    stagger = 0.08,
    delayChildren = 0.1,
    className,
    as = 'div',
    once = true,
    margin = '-10% 0px',
}: StaggerGroupProps) {
    const parentVariants: Variants = {
        hidden: {},
        show: {
            transition: { staggerChildren: stagger, delayChildren },
        },
    };

    const sharedProps = {
        className,
        initial: 'hidden' as const,
        whileInView: 'show' as const,
        viewport: { once, margin },
        variants: parentVariants,
    };

    if (as === 'ul') return <motion.ul {...sharedProps}>{children}</motion.ul>;
    if (as === 'section') return <motion.section {...sharedProps}>{children}</motion.section>;
    return <motion.div {...sharedProps}>{children}</motion.div>;
}

interface StaggerItemProps {
    children: ReactNode;
    className?: string;
    /** Override per-item travel. Defaults to 20. */
    y?: number;
    as?: 'div' | 'li';
}

export function StaggerItem({ children, className, y, as = 'div' }: StaggerItemProps) {
    const reduced = useReducedMotion();
    const variants: Variants = reduced
        ? CHILD_REDUCED
        : y === undefined
        ? CHILD
        : {
            hidden: { opacity: 0, y, scale: 0.96 },
            show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.5, ease: EASE },
            },
        };

    if (as === 'li') {
        return (
            <motion.li className={className} variants={variants}>
                {children}
            </motion.li>
        );
    }
    return (
        <motion.div className={className} variants={variants}>
            {children}
        </motion.div>
    );
}
