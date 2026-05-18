'use client';

import { animate, useInView, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MotionNumberProps {
    /** Final integer to count up to. */
    value: number;
    /** Optional static suffix appended after the animated integer (e.g. ".04"). */
    suffix?: string;
    duration?: number;
    delay?: number;
    className?: string;
}

/**
 * Counts an integer up from 0 to `value` once when scrolled into view.
 * For dates like "2025.04" pass value=2025 + suffix=".04" so the count-up
 * only animates the year and the month stays readable throughout.
 */
export function MotionNumber({
    value,
    suffix = '',
    duration = 1.2,
    delay = 0,
    className,
}: MotionNumberProps) {
    const reduced = useReducedMotion();
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-10% 0px' });
    const mv = useMotionValue(reduced ? value : 0);
    const display = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);

    useEffect(() => {
        if (!inView || reduced) return;
        const controls = animate(mv, value, {
            duration,
            delay,
            ease: [0.22, 1, 0.36, 1],
        });
        return () => controls.stop();
    }, [inView, reduced, value, duration, delay, mv]);

    useEffect(() => {
        if (!ref.current) return;
        ref.current.textContent = display.get();
        const unsub = display.on('change', (v) => {
            if (ref.current) ref.current.textContent = v;
        });
        return unsub;
    }, [display]);

    const initial = reduced ? `${value}${suffix}` : `0${suffix}`;

    return (
        <span ref={ref} className={className}>
            {initial}
        </span>
    );
}
