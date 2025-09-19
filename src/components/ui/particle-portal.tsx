'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Particle {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  rotation: number;
  delay: number;
  size: number;
}

interface ParticlePortalProps {
  isActive: boolean;
  sourceRect: DOMRect | null;
  particles: Array<{ x: number; y: number; color: string }>;
  pixelSize: number;
  onAnimationComplete?: () => void;
}

export function ParticlePortal({
  isActive,
  sourceRect,
  particles,
  pixelSize,
  onAnimationComplete
}: ParticlePortalProps) {
  const [mounted, setMounted] = useState(false);
  const [animatedParticles, setAnimatedParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  const cancelAnimation = (resetState: boolean = true) => {
    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (isAnimatingRef.current) {
      isAnimatingRef.current = false;
    }

    if (resetState) {
      setIsAnimating(false);
      setAnimatedParticles([]);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isActive || !sourceRect || particles.length === 0) {
      cancelAnimation();
      return () => cancelAnimation(false);
    }

    // Restart animation when crack particles get regenerated
    cancelAnimation();

    isAnimatingRef.current = true;
    setIsAnimating(true);

    const colorPalette = [
      'rgba(255, 255, 255, 0.95)',
      'rgba(220, 245, 255, 0.9)',
      'rgba(188, 232, 255, 0.88)'
    ];

    const baseParticles = particles.slice(0, 400);
    const baseCount = baseParticles.length || 1;
    const totalParticles = Math.min(260, Math.max(baseCount * 3, 150));

    const newParticles = Array.from({ length: totalParticles }, (_, index) => {
      const source = baseParticles.length > 0 ? baseParticles[index % baseCount] : { x: 0, y: 0 };
      const jitterRange = 6 + Math.random() * 8;
      const jitterX = (Math.random() - 0.5) * jitterRange;
      const jitterY = (Math.random() - 0.5) * jitterRange;

      // Use crack coordinates directly without scaling
      const startX = sourceRect.left + source.x + jitterX;
      const startY = sourceRect.top + source.y + jitterY;

      const angle = Math.random() * Math.PI * 2;
      const velocity = 340 + Math.random() * 360;
      const upwardBoost = 260 + Math.random() * 160;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - upwardBoost;
      const gravity = 320 + Math.random() * 140;
      const endX = startX + vx;
      const endY = startY + vy * 0.6 + gravity;

      const size = pixelSize * (0.95 + Math.random() * 0.55);

      return {
        id: `particle-${index}`,
        startX,
        startY,
        endX,
        endY,
        color: colorPalette[index % colorPalette.length],
        rotation: Math.random() * 1440 - 720,
        delay: Math.random() * 0.12,
        size
      };
    });

    setAnimatedParticles(newParticles);

    // Clean up after animation
    animationTimeoutRef.current = window.setTimeout(() => {
      cancelAnimation();
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 2100); // Match animation duration

    return () => cancelAnimation(false);
  }, [isActive, sourceRect, particles, pixelSize, onAnimationComplete]);

  if (!mounted || !isAnimating || animatedParticles.length === 0) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {animatedParticles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.startX,
            top: particle.startY,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            imageRendering: 'pixelated',
            borderRadius: particle.size * 0.25,
            boxShadow: `0 0 ${pixelSize * 1.2}px ${particle.color}`,
            animation: `particleScatter 2.2s cubic-bezier(0.18, 0, 0.35, 1) ${particle.delay}s forwards`,
            '--end-x': `${particle.endX - particle.startX}px`,
            '--end-y': `${particle.endY - particle.startY}px`,
            '--rotation': `${particle.rotation}deg`,
          } as React.CSSProperties}
        />
      ))}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes particleScatter {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y)) rotate(var(--rotation)) scale(0);
            opacity: 0;
          }
        }
      `}} />
    </div>,
    document.body
  );
}

export default ParticlePortal;
