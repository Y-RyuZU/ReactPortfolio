'use client';

import ProjectCard from './ProjectCard';
import { styles } from '@/lib/styles';
import { useProjects, useFeaturedProjects } from '@/hooks';

interface ProjectsGridProps {
  featured?: boolean;
}

export default function ProjectsGrid({ featured = false }: ProjectsGridProps) {
  // Use custom hooks for project management - must call unconditionally
  const featuredProjects = useFeaturedProjects(3);
  const allProjects = useProjects();

  // Select the appropriate projects based on the featured prop
  const { projects } = featured ? featuredProjects : allProjects;

  return (
    <section id="projects" className={styles.section.base}>
      <div className={styles.container}>
        <div className="text-center mb-12">
          <h2 className={styles.heading.h2}>
            {featured ? 'Featured Projects' : 'All Projects'}
          </h2>
          <p className={styles.text.secondary}>
            Recent work and side projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}