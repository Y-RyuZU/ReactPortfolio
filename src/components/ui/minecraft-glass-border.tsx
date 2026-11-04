'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

interface MinecraftGlassBorderProps {
  className?: string;
  style?: React.CSSProperties;
  pixelSize?: number;
  showHighlight?: boolean;
}

export function MinecraftGlassBorder({ className = '', style = {}, pixelSize = 10, showHighlight = true }: MinecraftGlassBorderProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const [grid, setGrid] = useState({ width: 16, height: 16, ready: false });

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;
    const update = () => {
      const rect = parent.getBoundingClientRect();
      const width = Math.max(2, Math.floor(rect.width / pixelSize));
      const height = Math.max(2, Math.floor(rect.height / pixelSize));
      setGrid(previous => previous.ready && previous.width === width && previous.height === height ? previous : { width, height, ready: true });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [pixelSize]);

  // Merge equal-color pixels into paths. Eight independently placeable segments
  // retain the original texture without thousands of individual SVG rect nodes.
  const segments = useMemo(() => {
    const groups = Array.from({ length: 8 }, () => new Map<string, string[]>());
    const add = (segment: number, x: number, y: number, color: string) => {
      const path = groups[segment].get(color) || [];
      path.push(`M${x} ${y}h1.02v1.02h-1.02z`);
      groups[segment].set(color, path);
    };
    const lightest = '#D0EAE9';
    const light = '#A8D0D9';
    const medium = '#8BC1CD';
    const dark = '#7BAEB7';
    for (let x = 0; x < grid.width; x++) {
      const pos = x % 16;
      add(x < grid.width / 2 ? 4 : 5, x, 0, lightest);
      add(x < grid.width / 2 ? 0 : 1, x, grid.height - 1, pos < 3 || pos > 13 ? light : medium);
    }
    for (let y = 1; y < grid.height - 1; y++) {
      const pos = y % 16;
      add(y > grid.height / 2 ? 2 : 3, 0, y, pos === 12 || pos === 14 || pos === 15 ? light : lightest);
      const right = pos < 3 || pos > 13 ? light : pos <= 6 ? dark : medium;
      add(y < grid.height / 2 ? 6 : 7, grid.width - 1, y, right);
    }
    return groups.map(group => Array.from(group, ([fill, pieces]) => ({ fill, d: pieces.join('') })));
  }, [grid.width, grid.height]);

  return (
    <svg
      ref={containerRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', imageRendering: 'pixelated', opacity: grid.ready ? 1 : 0, transition: 'opacity 0.2s ease-in-out', zIndex: 10, ...style }}
      viewBox={`0 0 ${grid.width} ${grid.height}`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {segments.map((paths, segment) => (
        <g data-build-frame={segment} key={segment}>
          {paths.map(path => <path key={path.fill} {...path} />)}
        </g>
      ))}
      {showHighlight && <>
        <path d="M4 2h1.02v1.02H4zM3 3h1.02v1.02H3zM2 4h1.02v1.02H2z" fill="#D0EAE9" />
        {grid.width > 14 && grid.height > 14 && <path d={`M${grid.width - 4} ${grid.height - 3}h1.02v1.02h-1.02zM${grid.width - 3} ${grid.height - 4}h1.02v1.02h-1.02z`} fill="#7BAEB7" />}
      </>}
    </svg>
  );
}

export default MinecraftGlassBorder;
