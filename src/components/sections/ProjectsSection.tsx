'use client';

import { styles } from '@/lib/styles';
import { useProjects, useFeaturedProjects } from '@/hooks';
import ProjectCard from '@/components/features/projects/ProjectCard';
import { SectionReveal } from '@/components/motion/SectionReveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';

interface ProjectsSectionProps {
    id?: string;
    featured?: boolean;
}

export default function ProjectsSection({ id = "projects", featured = false }: ProjectsSectionProps) {
  // Use custom hooks for project management - must call unconditionally
  const featuredProjects = useFeaturedProjects(3);
  const allProjects = useProjects();

  // Select the appropriate projects based on the featured prop
  const { projects } = featured ? featuredProjects : allProjects;

  return (
    <section id={id} className={styles.section.primary}>
      <div className={styles.container}>
        <SectionReveal className="text-center mb-16">
          <div className="relative inline-block">
            <div className="absolute inset-0 -m-3 bg-white/10 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg" />
            <div className="relative">
              <h2 className={styles.heading.section}>
                {featured ? 'Featured Projects' : 'Projects'}
              </h2>
              <p className={styles.text.secondary}>
                Recent work and side projects
              </p>
            </div>
          </div>
        </SectionReveal>

        <StaggerGroup
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          stagger={0.12}
          delayChildren={0.1}
        >
          {projects.map((project) => (
            <StaggerItem key={project.id} y={40}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
