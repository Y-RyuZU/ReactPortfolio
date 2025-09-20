import type { SkillCategory, SkillName } from '@/lib/types/skill';
import { getSkillProficiency } from './skill-levels';

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'backend',
    title: 'Backend',
    icon: '/images/minecraft/item/command_block_minecart.png',
    confidence: 5,
    skills: [
      { name: 'Java' as SkillName, proficiency: getSkillProficiency('Java'), yearsOfExperience: 8 },
      { name: 'Kotlin' as SkillName, proficiency: getSkillProficiency('Kotlin'), yearsOfExperience: 5 },
      { name: 'TypeScript' as SkillName, proficiency: getSkillProficiency('TypeScript'), yearsOfExperience: 3 },
      { name: 'Python' as SkillName, proficiency: getSkillProficiency('Python'), yearsOfExperience: 4 },
      { name: 'Spring Boot' as SkillName, proficiency: getSkillProficiency('Spring Boot'), yearsOfExperience: 4 },
      { name: 'Ktor' as SkillName, proficiency: getSkillProficiency('Ktor'), yearsOfExperience: 3 },
    ],
    order: 1,
  },
  {
    id: 'frontend',
    title: 'Frontend',
    icon: '/images/minecraft/item/brush.png',
    confidence: 4,
    skills: [
      { name: 'React' as SkillName, proficiency: getSkillProficiency('React'), yearsOfExperience: 3 },
      { name: 'Vue.js' as SkillName, proficiency: getSkillProficiency('Vue.js'), yearsOfExperience: 3 },
      { name: 'TypeScript' as SkillName, proficiency: getSkillProficiency('TypeScript'), yearsOfExperience: 3 },
      { name: 'Next.js' as SkillName, proficiency: getSkillProficiency('Next.js'), yearsOfExperience: 2 },
      { name: 'TailwindCSS' as SkillName, proficiency: getSkillProficiency('TailwindCSS'), yearsOfExperience: 2 },
    ],
    order: 2,
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure & Cloud',
    icon: '/images/minecraft/item/iron_pickaxe.png',
    confidence: 4,
    skills: [
      { name: 'Proxmox' as SkillName, proficiency: getSkillProficiency('Proxmox'), yearsOfExperience: 4 },
      { name: 'Kubernetes' as SkillName, proficiency: getSkillProficiency('Kubernetes'), yearsOfExperience: 2 },
      { name: 'AWS' as SkillName, proficiency: getSkillProficiency('AWS'), yearsOfExperience: 2 },
      { name: 'GCP' as SkillName, proficiency: getSkillProficiency('GCP'), yearsOfExperience: 2 },
      { name: 'GitHub Actions' as SkillName, proficiency: getSkillProficiency('GitHub Actions'), yearsOfExperience: 3 },
      { name: 'Docker' as SkillName, proficiency: getSkillProficiency('Docker'), yearsOfExperience: 4 },
    ],
    order: 3,
  },
  {
    id: 'database',
    title: 'Database',
    icon: '/images/minecraft/item/chest_minecart.png',
    confidence: 4,
    skills: [
      { name: 'MySQL/MariaDB' as SkillName, proficiency: getSkillProficiency('MySQL/MariaDB'), yearsOfExperience: 5 },
      { name: 'PostgreSQL' as SkillName, proficiency: getSkillProficiency('PostgreSQL'), yearsOfExperience: 3 },
      { name: 'Redis' as SkillName, proficiency: getSkillProficiency('Redis'), yearsOfExperience: 3 },
    ],
    order: 4,
  },
  {
    id: 'ml-ds',
    title: 'Machine Learning & Data Science',
    icon: '/images/minecraft/item/enchanted_book.png',
    confidence: 2,
    skills: [
      { name: 'Python' as SkillName, proficiency: getSkillProficiency('Python'), yearsOfExperience: 4 },
      { name: 'LLM Integration' as SkillName, proficiency: getSkillProficiency('LLM Integration'), yearsOfExperience: 1 },
      { name: 'Data Analysis' as SkillName, proficiency: getSkillProficiency('Data Analysis'), yearsOfExperience: 1 },
    ],
    order: 5,
  },
  {
    id: 'other-technologies',
    title: 'Other Technologies',
    icon: '/images/minecraft/item/wooden_pickaxe.png',
    confidence: 1,
    skills: [
      { name: 'Hardware' as SkillName, proficiency: getSkillProficiency('Hardware'), yearsOfExperience: 0.5 },
      { name: 'Tauri' as SkillName, proficiency: getSkillProficiency('Tauri'), yearsOfExperience: 0.5 },
      { name: 'C#' as SkillName, proficiency: getSkillProficiency('C#'), yearsOfExperience: 0.5 },
    ],
    order: 6,
  },
];

// Featured skills for Home page - optimized for 3x3 grid
export const FEATURED_SKILL_NAMES: SkillName[] = [
  'Java',
  'Kotlin',
  'TypeScript',
  'React',
  'Next.js',
  'Spring Boot',
  'AWS',
  'Docker',
  'Python',  // 9th item for grid
];

// Helper function to get Skill object from skill name
export function getSkillByName(name: SkillName) {
  for (const category of SKILL_CATEGORIES) {
    const skill = category.skills.find(s => s.name === name);
    if (skill) return skill;
  }
  return null;
}

// Complete featured skill objects
export const FEATURED_SKILLS = FEATURED_SKILL_NAMES
  .map(name => getSkillByName(name))
  .filter((skill): skill is NonNullable<typeof skill> => skill !== null);