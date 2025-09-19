'use client';

import React, { useState, useEffect, useRef } from 'react';

interface MinecraftGlassBorderProps {
  className?: string;
  style?: React.CSSProperties;
  pixelSize?: number; // Size of one logical pixel in actual pixels
  showHighlight?: boolean; // Show diagonal highlights and shadows
}

export function MinecraftGlassBorder({
  className = '',
  style = {},
  pixelSize = 10, // Default: 1 logical pixel = 10x10 actual pixels
  showHighlight = true // Default: show highlights
}: MinecraftGlassBorderProps) {
  // Minecraft glass block colors from the actual texture
  const colors = {
    lightest: '#D0EAE9',  // Brightest highlight
    light: '#A8D0D9',     // Light blue-green
    medium: '#8BC1CD',    // Main frame color
    dark: '#7BAEB7',      // Darkest shadow
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const containerRef = useRef<SVGSVGElement>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [gridSize, setGridSize] = useState({ width: 16, height: 16 });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isInitialized, setIsInitialized] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const updateGridSize = () => {
      if (!containerRef.current?.parentElement) return;

      const rect = containerRef.current.parentElement.getBoundingClientRect();
      const width = Math.floor(rect.width / pixelSize);
      const height = Math.floor(rect.height / pixelSize);

      setGridSize({ width, height });
      setIsInitialized(true);
    };

    updateGridSize();

    const observer = new ResizeObserver(updateGridSize);
    if (containerRef.current?.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }

    return () => observer.disconnect();
  }, [pixelSize]);

  // Generate border pixels
  const borderPixels = [];

  // Top border - all lightest color
  for (let x = 0; x < gridSize.width; x++) {
    borderPixels.push(
      <rect key={`top-${x}`} x={x} y={0} width={1.02} height={1.02} fill={colors.lightest} />
    );
  }

  // Bottom border - complex pattern
  for (let x = 0; x < gridSize.width; x++) {
    const pos = x % 16;
    let color = colors.medium; // default for positions 3-13

    // Positions 1,2,14,15 are 1 tone darker (light)
    if (pos === 1 || pos === 2 || pos === 14 || pos === 15) {
      color = colors.light;
    }
    // Position 0 might be a corner, use light
    if (pos === 0) {
      color = colors.light;
    }

    borderPixels.push(
      <rect key={`bottom-${x}`} x={x} y={gridSize.height - 1} width={1.02} height={1.02} fill={color} />
    );
  }

  // Left border - mostly lightest with specific darker pixels
  for (let y = 1; y < gridSize.height - 1; y++) {
    const pos = y % 16;
    let color = colors.lightest; // base color

    // Positions 12,14,15 are 1 tone darker
    if (pos === 12 || pos === 14 || pos === 15) {
      color = colors.light;
    }

    borderPixels.push(
      <rect key={`left-${y}`} x={0} y={y} width={1.02} height={1.02} fill={color} />
    );
  }

  // Right border - complex pattern
  for (let y = 1; y < gridSize.height - 1; y++) {
    const pos = y % 16;
    let color = colors.medium; // default for positions 3-13 (2 tones darker)

    // Positions 1,2,14,15 are 1 tone darker (light)
    if (pos === 1 || pos === 2 || pos === 14 || pos === 15) {
      color = colors.light;
    }
    // Positions 3,4,5,6 are the darkest
    else if (pos === 3 || pos === 4 || pos === 5 || pos === 6) {
      color = colors.dark;
    }
    // Position 0 might need special handling
    else if (pos === 0) {
      color = colors.light;
    }

    borderPixels.push(
      <rect key={`right-${y}`} x={gridSize.width - 1} y={y} width={1.02} height={1.02} fill={color} />
    );
  }

  return (
    <svg
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        imageRendering: 'pixelated',
        opacity: isInitialized ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out',
        zIndex: 10,
        ...style
      }}
      viewBox={`0 0 ${gridSize.width} ${gridSize.height}`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dynamic border pixels */}
      {borderPixels}

      {/* Conditional highlights based on showHighlight prop */}
      {showHighlight && (
        <>
          {/* Top-left diagonal highlight - right-upward diagonal */}
          {/* Position (4,2), (3,3), (2,4) */}
          <rect x="4" y="2" width="1.02" height="1.02" fill={colors.lightest} />
          <rect x="3" y="3" width="1.02" height="1.02" fill={colors.lightest} />
          <rect x="2" y="4" width="1.02" height="1.02" fill={colors.lightest} />

          {/* Bottom-right shadow - based on 16x16 positions */}
          {/* Position (12,13), (13,12) relative to 16x16 */}
          {gridSize.width > 14 && gridSize.height > 14 && (
            <>
              <rect x={gridSize.width - 4} y={gridSize.height - 3} width="1.02" height="1.02" fill={colors.dark} />
              <rect x={gridSize.width - 3} y={gridSize.height - 4} width="1.02" height="1.02" fill={colors.dark} />
            </>
          )}
        </>
      )}
    </svg>
  );
}

export default MinecraftGlassBorder;