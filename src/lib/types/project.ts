export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  thumbnail: string;
  images?: string[];
  techStack: TechStack[];
  category: ProjectCategory;
  metrics?: ProjectMetrics;
  links?: ProjectLinks;
  featured: boolean;
  order: number;
  year: number;
}

export interface TechStack {
  name: string;
  icon?: string;
  category: 'language' | 'framework' | 'database' | 'tool' | 'infrastructure';
}

export interface ProjectMetrics {
  users?: number;
  performance?: string;
  scale?: string;
  community?: number;
}

export interface ProjectLinks {
  github?: string;
  demo?: string;
  article?: string;
  website?: string;
}

export type ProjectCategory =
  | 'realtime-system'
  | 'web-app'
  | 'tool'
  | 'game-dev'
  | 'startup';