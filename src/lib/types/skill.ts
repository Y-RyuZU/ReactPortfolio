// Proficiency level definitions
export const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
export type ProficiencyLevel = typeof PROFICIENCY_LEVELS[number];

// Skill names with strict type safety
export const SKILL_NAMES = [
  // Backend
  'Java', 'Kotlin', 'TypeScript', 'Python', 'Spring Boot', 'Ktor',
  // Frontend
  'React', 'Vue.js', 'Next.js', 'TailwindCSS',
  // Infrastructure
  'Proxmox', 'Kubernetes', 'Docker', 'AWS', 'GCP', 'GitHub Actions',
  // Database
  'MySQL/MariaDB', 'PostgreSQL', 'Redis',
  // ML/DS
  'LLM Integration', 'Data Analysis',
] as const;
export type SkillName = typeof SKILL_NAMES[number];

export interface SkillCategory {
  id: string;
  title: string;
  icon?: string;
  confidence: 1 | 2 | 3 | 4 | 5;
  skills: Skill[];
  order: number;
}

export interface Skill {
  name: SkillName;
  icon?: string;
  yearsOfExperience?: number;
  proficiency: ProficiencyLevel; // Required field
}