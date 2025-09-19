'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Skill } from '@/lib/types/skill';
import { SKILL_ICONS, SKILL_BADGES } from '@/lib/constants/skill-icons';
import { useMinecraftAssets, useProficiencyStyles } from '@/hooks';

interface SkillCardProps {
  skill: Skill;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SkillCard({
  skill,
  showDetails = false,
  size = 'md'
}: SkillCardProps) {
  const Icon = SKILL_ICONS[skill.name];
  const badge = SKILL_BADGES[skill.name];

  // Use custom hooks for asset management
  const {
    getProficiencyAsset,
    getProficiencyLabel,
    getProficiencyWidth,
    getSkillSizeClasses
  } = useMinecraftAssets();

  const proficiencyStyles = useProficiencyStyles(skill.proficiency);
  const asset = getProficiencyAsset(skill.proficiency);
  const sizes = getSkillSizeClasses(size);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card variant="glass" className={cn(
            'relative group overflow-hidden cursor-pointer',
            'transition-all duration-300 hover:scale-[1.02]',
            sizes.container
          )}>
      <CardContent className="relative p-3 md:p-4 h-full flex flex-col items-center justify-center">
        {/* Minecraft鉱石背景（より明確に表示） */}
        <div className="absolute inset-0 opacity-40">
          <Image
            src={asset.ingot}
            alt=""
            fill
            className="mc-pixel object-cover mc-ore-sparkle"
          />
        </div>

        {/* 技術アイコン */}
        <div className={cn(
          'relative z-10 flex items-center justify-center',
          'text-gray-900 dark:text-gray-200',
          'group-hover:text-gray-900 dark:group-hover:text-white',
          'transition-all group-hover:opacity-100 group-hover:saturate-100',
          sizes.icon,
          proficiencyStyles.opacity,
          proficiencyStyles.saturate
        )}>
          <Icon className="w-full h-full" />
        </div>

        {/* バッジ（Ktorなど） */}
        {badge && (
          <Badge
            className={cn(
              'absolute top-1 right-1 z-10',
              'font-bold',
              sizes.badge
            )}
            variant="secondary"
          >
            {badge}
          </Badge>
        )}

        {/* Skill name */}
        <div className={cn('mt-2 text-center relative z-10', sizes.text)}>
          <p className="font-bold text-gray-900 dark:text-gray-100">
            {skill.name}
          </p>
          {showDetails && (
            <p className="text-gray-800 dark:text-gray-400 text-xs mt-1">
              {getProficiencyLabel(skill.proficiency)}
            </p>
          )}
        </div>


        {/* 熟練度インジケーター（下部の太いバー） */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            className="h-full transition-all duration-500 shadow-sm"
            style={{
              width: getProficiencyWidth(skill.proficiency),
              backgroundColor: asset.color,
            }}
          />
        </div>
      </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getProficiencyLabel(skill.proficiency)}</p>
          {skill.yearsOfExperience && <p className="text-xs text-muted-foreground">{skill.yearsOfExperience}年の経験</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}