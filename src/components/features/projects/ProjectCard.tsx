'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GlassCard, GlassCardContent, GlassCardFooter, GlassCardHeader } from '@/components/ui/glass-card';
import type { Project } from '@/lib/types/project';
import { ExternalLink, Users, Activity } from 'lucide-react';
import { useMinecraftAssets } from '@/hooks';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { getCategoryItem } = useMinecraftAssets();
  const achievementItem = getCategoryItem(project.category);

  return (
    <GlassCard className="h-full flex flex-col transition-all hover:scale-[1.02] pixelated" breakable={true}>
      {/* Achievement-style header */}
      <div className="h-32 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b-2 border-yellow-600/20 dark:border-yellow-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-yellow-50/30 dark:to-yellow-900/20" />
        <div className="relative h-full flex items-center justify-center">
          <div className="mc-item-frame p-4 rounded">
            <Image
              src={achievementItem}
              alt={project.title}
              width={48}
              height={48}
              className="mc-pixel"
            />
          </div>
        </div>
        {/* Achievement sparkle effect */}
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-yellow-400/50 rounded-full animate-pulse" />
        </div>
      </div>

      <GlassCardHeader className="pb-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2">
          {project.title}
        </h3>
      </GlassCardHeader>

      <GlassCardContent className="flex-1">
        <p className="text-sm text-gray-800 dark:text-gray-400 mb-4 line-clamp-2">
          {project.shortDescription}
        </p>

        {/* Minimal metrics */}
        {project.metrics && (
          <div className="flex items-center gap-4 mb-4 text-xs text-gray-700 dark:text-gray-500">
            {project.metrics.users && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{project.metrics.users}+</span>
              </div>
            )}
            {project.metrics.community && (
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>{project.metrics.community.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Tech stack - simple text */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech.name}
              className="px-2 py-0.5 text-xs text-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded"
            >
              {tech.name}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-gray-700 dark:text-gray-500">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
      </GlassCardContent>

      <GlassCardFooter className="pt-3 border-t border-gray-100 dark:border-gray-800">
        {project.links?.website ? (
          <Link
            href={project.links.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-gray-800 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            View Project
            <ExternalLink className="h-3 w-3" />
          </Link>
        ) : project.links?.github ? (
          <Link
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-gray-800 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            View on GitHub
            <ExternalLink className="h-3 w-3" />
          </Link>
        ) : (
          <span className="text-sm text-gray-600 dark:text-gray-600">
            Coming Soon
          </span>
        )}
      </GlassCardFooter>
    </GlassCard>
  );
}