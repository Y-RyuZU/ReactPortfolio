'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  vx: number; // velocity x
  vy: number; // velocity y
  rotation: number;
  scale: number;
}

interface MinecraftGlassParticlesProps {
  gridWidth: number;
  gridHeight: number;
  triggerBreak: boolean;
  particles?: Array<{ x: number; y: number; color: string }>;
  onAnimationComplete?: () => void;
}

export function MinecraftGlassParticles({
  gridWidth,
  gridHeight,
  triggerBreak,
  particles = [],
  onAnimationComplete
}: MinecraftGlassParticlesProps) {
  const [animatedParticles, setAnimatedParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (triggerBreak && particles.length > 0 && !isAnimating) {
      setIsAnimating(true);

      // Convert crack pixels to animated particles
      const newParticles = particles.map((p, index) => ({
        id: `particle-${index}`,
        x: p.x,
        y: p.y,
        color: p.color,
        vx: (Math.random() - 0.5) * 4, // Random horizontal velocity
        vy: Math.random() * -3 - 1,     // Upward initial velocity
        rotation: Math.random() * 720 - 360, // Random rotation
        scale: 1
      }));

      setAnimatedParticles(newParticles);

      // Clean up after animation
      setTimeout(() => {
        setIsAnimating(false);
        setAnimatedParticles([]);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 1000); // Animation duration
    }
  }, [triggerBreak, particles, isAnimating, onAnimationComplete]);

  if (!isAnimating || animatedParticles.length === 0) return null;

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        imageRendering: 'pixelated',
        zIndex: 12, // Above the cracks
      }}
      viewBox={`0 0 ${gridWidth} ${gridHeight}`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes scatter {
            0% {
              opacity: 1;
              transform: translate(0, 0) rotate(0deg) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.2);
            }
          }

          .particle {
            animation: scatter 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
        `}
      </style>

      {animatedParticles.map((particle) => {
        // Calculate final position with gravity effect
        const tx = particle.vx * 20; // Horizontal displacement
        const ty = particle.vy * 20 + 15; // Vertical with gravity

        return (
          <rect
            key={particle.id}
            className="particle"
            x={particle.x}
            y={particle.y}
            width={1.02}
            height={1.02}
            fill={particle.color}
            style={{
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              '--rot': `${particle.rotation}deg`,
              transformOrigin: `${particle.x + 0.5}px ${particle.y + 0.5}px`
            } as React.CSSProperties}
          />
        );
      })}
    </svg>
  );
}

export default MinecraftGlassParticles;