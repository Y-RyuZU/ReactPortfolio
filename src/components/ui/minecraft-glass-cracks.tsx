'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface CrackPixel {
  x: number;
  y: number;
  depth: number;
}

interface MinecraftGlassCracksProps {
  gridWidth: number;
  gridHeight: number;
  breakStage: number; // 0-10 (0 = no cracks, 10 = fully broken)
  clickX?: number;
  clickY?: number;
  onCracksGenerated?: (cracks: Array<{ x: number; y: number; color: string }>) => void;
}

const crackColorsLight = ['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.4)'];
const crackColorsDark = ['rgba(250,250,250,0.9)', 'rgba(215,235,240,0.75)', 'rgba(185,210,220,0.6)', 'rgba(160,185,200,0.45)'];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 0xffffffff;
    return value / 0xffffffff;
  };
}

function createCrackPattern(
  stage: number,
  gridWidth: number,
  gridHeight: number,
  clickX: number | undefined,
  clickY: number | undefined,
  previousCracks: Map<string, CrackPixel>,
  impactPoints: Array<{ x: number; y: number; stage: number }>
): { cracks: CrackPixel[]; impactPoints: Array<{ x: number; y: number; stage: number }> } {
  if (stage === 0) return { cracks: [], impactPoints: [] };

  // Use click position or center for primary impact
  const primaryX = clickX ?? Math.floor(gridWidth / 2);
  const primaryY = clickY ?? Math.floor(gridHeight / 2);

  // Create seeded random generator for consistency
  const random = seededRandom(primaryX * 73856093 + primaryY * 19349663);

  // Start with all previous cracks
  const cracks = new Map(previousCracks);

  // Manage impact points
  const currentImpactPoints = [...impactPoints];

  // Add primary impact point if this is the first stage
  if (stage === 1 && currentImpactPoints.length === 0) {
    currentImpactPoints.push({ x: primaryX, y: primaryY, stage: 1 });
  }

  // Helper to add a crack pixel with stage-based coloring
  const addCrack = (x: number, y: number, baseDepth: number = 0) => {
    if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return;

    // Calculate depth based on stage (starts light, gets darker)
    const stageDepth = Math.max(0, 3 - Math.floor((stage - 1) / 3));
    // Combine with base depth (impact point priority)
    const finalDepth = Math.min(3, Math.max(stageDepth, baseDepth));

    const key = `${x},${y}`;
    const existing = cracks.get(key);
    // Only update if this is darker (lower depth value) or new
    if (!existing || finalDepth < existing.depth) {
      cracks.set(key, { x, y, depth: finalDepth });
    }
  };

  // Generate organic crack using random walk (adjusted for 6px blocks)
  const generateOrganicCrack = (
    startX: number,
    startY: number,
    baseAngle: number,
    length: number,
    depth: number = 0,
    wobbleFactor: number = 0.3,
    seedOffset: number = 0
  ) => {
    let currentX = startX;
    let currentY = startY;
    let currentAngle = baseAngle;

    for (let step = 0; step < length; step++) {
      // Add wobble to angle for organic movement
      const wobble = (seededRandom(seedOffset + step * 7)() - 0.5) * wobbleFactor;
      currentAngle += wobble;

      // Move in current direction (6-8 pixels per step for pixel art style)
      const stepSize = 6 + seededRandom(seedOffset + step * 11)() * 2;
      currentX += Math.cos(currentAngle) * stepSize;
      currentY += Math.sin(currentAngle) * stepSize;

      // Add the crack pixel
      const rx = Math.round(currentX / 6) * 6; // Snap to 6px grid
      const ry = Math.round(currentY / 6) * 6;
      addCrack(rx, ry, depth);

      // Reduced branching for cleaner look
      if (stage >= 6 && step > 4 && seededRandom(seedOffset + step * 13)() < 0.05 + (stage - 6) * 0.01) {
        const branchAngle = currentAngle + (seededRandom(seedOffset + step * 17)() > 0.5 ? Math.PI / 3 : -Math.PI / 3);
        const branchLength = Math.floor(length * 0.3);
        generateOrganicCrack(
          currentX,
          currentY,
          branchAngle,
          branchLength,
          Math.min(depth + 1, 3),
          wobbleFactor * 1.2,
          seedOffset + step * 1000
        );
      }
    }
  };

  // Add secondary impact points earlier for better distribution
  if (stage === 3 && currentImpactPoints.length === 1) {
    const angle1 = Math.PI / 3 + random() * Math.PI / 6; // More controlled angle
    const distance = 25 + random() * 10;
    const x1 = Math.round((primaryX + Math.cos(angle1) * distance) / 6) * 6;
    const y1 = Math.round((primaryY + Math.sin(angle1) * distance) / 6) * 6;
    if (x1 > 0 && x1 < gridWidth && y1 > 0 && y1 < gridHeight) {
      currentImpactPoints.push({ x: x1, y: y1, stage: 3 });
    }
  }

  if (stage === 5 && currentImpactPoints.length <= 2) {
    const angle2 = -Math.PI / 3 + random() * Math.PI / 6; // Opposite side
    const distance = 30 + random() * 10;
    const x2 = Math.round((primaryX + Math.cos(angle2) * distance) / 6) * 6;
    const y2 = Math.round((primaryY + Math.sin(angle2) * distance) / 6) * 6;
    if (x2 > 0 && x2 < gridWidth && y2 > 0 && y2 < gridHeight) {
      currentImpactPoints.push({ x: x2, y: y2, stage: 5 });
    }
  }

  // Add more impact points at stage 6-8
  if (stage === 6 && currentImpactPoints.length <= 3) {
    const angle3 = Math.PI + random() * Math.PI / 4;
    const distance = 35 + random() * 15;
    const x3 = Math.round((primaryX + Math.cos(angle3) * distance) / 6) * 6;
    const y3 = Math.round((primaryY + Math.sin(angle3) * distance) / 6) * 6;
    if (x3 > 0 && x3 < gridWidth && y3 > 0 && y3 < gridHeight) {
      currentImpactPoints.push({ x: x3, y: y3, stage: 6 });
    }
  }

  if (stage === 8 && currentImpactPoints.length <= 5) {
    for (let i = 0; i < 2; i++) {
      const angle = (Math.PI * 2 * i / 2) + Math.PI / 2 + random() * Math.PI / 6;
      const distance = 40 + random() * 20;
      const x = Math.round((primaryX + Math.cos(angle) * distance) / 6) * 6;
      const y = Math.round((primaryY + Math.sin(angle) * distance) / 6) * 6;
      if (x > 0 && x < gridWidth && y > 0 && y < gridHeight) {
        currentImpactPoints.push({ x, y, stage: 8 });
      }
    }
  }

  // Generate cracks from each impact point
  currentImpactPoints.forEach((impact, impactIndex) => {
    // Skip if this impact point was added after the current stage
    if (impact.stage > stage) return;

    // Calculate parameters based on when this impact was added
    const stagesSinceImpact = stage - impact.stage + 1;
    const impactDepth = impactIndex === 0 ? 0 : Math.min(Math.floor(impactIndex / 2), 2);

    // Balanced crack counts for primary and secondary impacts
    const crackCount = impactIndex === 0
      ? Math.min(3 + Math.floor(stagesSinceImpact / 3), 5)  // 3-5 for primary
      : Math.min(3 + Math.floor(stagesSinceImpact / 3), 4);  // 3-4 for secondary

    // Adjust lengths - shorter primary, longer secondary
    const baseLength = impactIndex === 0
      ? 2 + stagesSinceImpact * 1.5  // Shorter: 2-17 steps for primary
      : 3 + stagesSinceImpact * 1.2; // Longer: 3-15 steps for secondary

    const wobbleFactor = 0.15 + (stagesSinceImpact / 10) * 0.15;

    // Add impact point center
    const snapX = Math.round(impact.x / 6) * 6;
    const snapY = Math.round(impact.y / 6) * 6;
    addCrack(snapX, snapY, impactDepth);

    // Generate cracks radiating from this impact point
    for (let i = 0; i < crackCount; i++) {
      const angle = (Math.PI * 2 * i) / crackCount + random() * 0.3;
      const length = baseLength + random() * stagesSinceImpact;
      generateOrganicCrack(
        snapX,
        snapY,
        angle,
        length,
        impactDepth,
        wobbleFactor,
        impactIndex * 10000 + i * 1000
      );
    }
  });

  return { cracks: Array.from(cracks.values()), impactPoints: currentImpactPoints };
}

export function MinecraftGlassCracks({
  gridWidth,
  gridHeight,
  breakStage,
  clickX,
  clickY,
  onCracksGenerated,
}: MinecraftGlassCracksProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const previousCracksRef = useRef<Map<string, CrackPixel>>(new Map());
  const initialClickRef = useRef<{ x: number; y: number } | null>(null);
  const impactPointsRef = useRef<Array<{ x: number; y: number; stage: number }>>([]);
  const emittedStageRef = useRef<number>(0);
  const pixelSize = 6; // Minecraft-style pixel size

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Generate cracks with cumulative behavior
  const cracks = useMemo(() => {
    // Remember the first click position
    if (breakStage === 1 && clickX !== undefined && clickY !== undefined) {
      initialClickRef.current = { x: clickX, y: clickY };
      impactPointsRef.current = []; // Reset impact points on new break sequence
    }

    // Reset on stage 0
    if (breakStage === 0) {
      initialClickRef.current = null;
      previousCracksRef.current = new Map();
      impactPointsRef.current = [];
      return [];
    }

    // Use the initial click position for all crack generation
    const crackOriginX = initialClickRef.current?.x ?? clickX;
    const crackOriginY = initialClickRef.current?.y ?? clickY;

    const result = createCrackPattern(
      breakStage,
      gridWidth,
      gridHeight,
      crackOriginX,
      crackOriginY,
      previousCracksRef.current,
      impactPointsRef.current
    );

    // Update the previous cracks and impact points reference for next stage
    if (breakStage > 0) {
      const cracksMap = new Map<string, CrackPixel>();
      result.cracks.forEach(crack => {
        cracksMap.set(`${crack.x},${crack.y}`, crack);
      });
      previousCracksRef.current = cracksMap;
      impactPointsRef.current = result.impactPoints;
    }

    return result.cracks;
  }, [breakStage, gridWidth, gridHeight, clickX, clickY]);

  useEffect(() => {
    if (breakStage >= 10 && onCracksGenerated && emittedStageRef.current !== breakStage) {
      emittedStageRef.current = breakStage;
      const palette = isDarkMode ? crackColorsDark : crackColorsLight;
      const centerX = initialClickRef.current?.x ?? clickX ?? Math.floor(gridWidth / 2);
      const centerY = initialClickRef.current?.y ?? clickY ?? Math.floor(gridHeight / 2);

      const exported = [
        { x: centerX, y: centerY, color: palette[0] },
        ...cracks.slice(0, 20).map((point) => ({
          x: point.x,
          y: point.y,
          color: palette[Math.min(point.depth, 3)],
        })),
      ];
      onCracksGenerated(exported);
    }
  }, [breakStage, cracks, clickX, clickY, gridWidth, gridHeight, onCracksGenerated, isDarkMode]);

  if (breakStage === 0 || cracks.length === 0) return null;

  const palette = isDarkMode ? crackColorsDark : crackColorsLight;

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        imageRendering: 'pixelated',
        zIndex: 11,
        opacity: breakStage >= 10 ? 0.92 : 1,
        transition: 'opacity 0.2s ease-out',
      }}
      viewBox={`0 0 ${gridWidth} ${gridHeight}`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {cracks.map((point, index) => (
        <rect
          key={`${point.x}-${point.y}-${index}`}
          x={point.x}
          y={point.y}
          width={pixelSize}
          height={pixelSize}
          fill={palette[Math.min(point.depth, 3)]}
        />
      ))}
    </svg>
  );
}

export default MinecraftGlassCracks;
