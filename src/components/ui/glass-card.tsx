'use client';

import * as React from "react"
import { useState, useRef, useEffect } from "react"

import {cn} from "@/lib/utils"
import { MinecraftGlassBorder } from "./minecraft-glass-border"
import { MinecraftGlassCracks } from "./minecraft-glass-cracks"
import { ParticlePortal } from "./particle-portal"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    showHighlight?: boolean;
    pixelSize?: number;
    breakable?: boolean;
    onBreak?: () => void;
}

const GlassCard = React.forwardRef<
    HTMLDivElement,
    GlassCardProps
>(({className, showHighlight = true, pixelSize = 10, breakable = false, onBreak, children, onClick, ...props}, ref) => {
    const [breakStage, setBreakStage] = useState(0);
    const [isBroken, setIsBroken] = useState(false);
    const [crackGridSize, setCrackGridSize] = useState({ width: 32, height: 32 });
    const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | undefined>();
    const [crackParticles, setCrackParticles] = useState<Array<{ x: number; y: number; color: string }>>([]);
    const [triggerParticles, setTriggerParticles] = useState(false);
    const [cardRect, setCardRect] = useState<DOMRect | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const breakTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Calculate grid size based on container size
    useEffect(() => {
        const updateGridSize = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const width = Math.floor(rect.width);
            const height = Math.floor(rect.height);

            setCrackGridSize({ width, height });
        };

        updateGridSize();

        const observer = new ResizeObserver(updateGridSize);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [pixelSize]);

    // Handle breaking animation completion
    useEffect(() => {
        if (breakStage === 10 && !isBroken) {
            // Get card position for particle animation
            if (containerRef.current) {
                setCardRect(containerRef.current.getBoundingClientRect());
            }
            // Trigger particle animation
            setTriggerParticles(true);

            // Wait for the shatter animation, then hide the card
            breakTimeoutRef.current = setTimeout(() => {
                setIsBroken(true);
                if (onBreak) {
                    onBreak();
                }
                // Reset particles after animation
                setTimeout(() => {
                    setTriggerParticles(false);
                }, 1500);
            }, 100); // Quick delay to start particle animation
        }

        return () => {
            if (breakTimeoutRef.current) {
                clearTimeout(breakTimeoutRef.current);
                breakTimeoutRef.current = null;
            }
        };
    }, [breakStage, isBroken, onBreak]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (breakable && containerRef.current && !isBroken) {
            const rect = containerRef.current.getBoundingClientRect();
            // Get click position in actual pixels relative to the card
            const x = Math.floor(e.clientX - rect.left);
            const y = Math.floor(e.clientY - rect.top);

            setClickPosition({ x, y });
            setBreakStage(prev => Math.min(prev + 1, 10));
        }

        // Call original onClick if provided
        if (!isBroken && onClick) {
            onClick(e);
        }
    };

    return (
        <div
            ref={(node) => {
                containerRef.current = node;
                if (typeof ref === 'function') {
                    ref(node);
                } else if (ref) {
                    ref.current = node;
                }
            }}
            className={cn(
                "relative",
                !isBroken && "bg-white/5 dark:bg-gray-900/20 backdrop-blur-sm",
                breakable && !isBroken && "cursor-pointer select-none",
                breakStage === 10 && !isBroken && "animate-pulse",
                className
            )}
            onClick={handleClick}
            style={{
                opacity: breakStage === 10 && !isBroken ? 0.95 : 1,
                transition: breakStage === 10 ? 'opacity 0.3s ease-out' : undefined
            }}
            {...props}
        >
            {!isBroken && (
                <MinecraftGlassBorder showHighlight={showHighlight} pixelSize={pixelSize} />
            )}
            {breakable && !isBroken && (
                <MinecraftGlassCracks
                    gridWidth={crackGridSize.width}
                    gridHeight={crackGridSize.height}
                    breakStage={breakStage}
                    clickX={clickPosition?.x}
                    clickY={clickPosition?.y}
                    onCracksGenerated={setCrackParticles}
                />
            )}
            {children}
            {/* Particle portal renders outside the card */}
            {breakable && (
                <ParticlePortal
                    isActive={triggerParticles}
                    sourceRect={cardRect}
                    particles={crackParticles}
                    pixelSize={pixelSize}
                    onAnimationComplete={() => setTriggerParticles(false)}
                />
            )}
        </div>
    );
})
GlassCard.displayName = "GlassCard"

const GlassCardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
GlassCardHeader.displayName = "GlassCardHeader"

const GlassCardTitle = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight", className)}
        {...props}
    />
))
GlassCardTitle.displayName = "GlassCardTitle"

const GlassCardDescription = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
GlassCardDescription.displayName = "GlassCardDescription"

const GlassCardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
GlassCardContent.displayName = "GlassCardContent"

const GlassCardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
GlassCardFooter.displayName = "GlassCardFooter"

export {GlassCard, GlassCardHeader, GlassCardFooter, GlassCardTitle, GlassCardDescription, GlassCardContent}
