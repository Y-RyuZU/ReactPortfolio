import type {SkillName, ProficiencyLevel} from '@/lib/types/skill';

/**
 * Centralized skill proficiency level management
 * スキルの熟練度レベルを一元管理
 *
 * When you level up a skill, update it here!
 * スキルレベルが上がったら、ここを更新してください！
 */
export const SKILL_PROFICIENCY_MAP: Record<SkillName, ProficiencyLevel> = {
    // Backend
    'Java': 'expert',
    'Kotlin': 'expert',
    'Spring Boot': 'advanced',
    'Ktor': 'advanced',

    // Frontend
    'React': 'advanced',
    'Vue.js': 'advanced',
    'Next.js': 'advanced',
    'Nuxt.js': 'advanced',
    'TailwindCSS': 'advanced',

    // Programming Languages
    'TypeScript': 'advanced',
    'Python': 'advanced',  // Note: Different levels for different contexts

    // Infrastructure & Cloud
    'Proxmox': 'advanced',
    'Kubernetes': 'advanced',
    'Docker': 'advanced',
    'AWS': 'intermediate',
    'GCP': 'advanced',
    'GitHub Actions': 'advanced',

    // Database
    'MySQL/MariaDB': 'advanced',
    'PostgreSQL': 'advanced',
    'Redis': 'advanced',

    // ML/DS
    'LLM Integration': 'intermediate',
    'Data Analysis': 'advanced',

    // Other Technologies
    'Hardware': 'beginner',
    'Tauri': 'beginner',
    'C#': 'beginner',
} as const;

/**
 * Get proficiency level for a specific skill
 * @param skillName - Name of the skill
 * @returns Proficiency level or 'beginner' as default
 */
export function getSkillProficiency(skillName: SkillName): ProficiencyLevel {
    return SKILL_PROFICIENCY_MAP[skillName] || 'beginner';
}

/**
 * Get all skills by proficiency level
 * @param level - Proficiency level to filter by
 * @returns Array of skill names with that proficiency level
 */
export function getSkillsByProficiency(level: ProficiencyLevel): SkillName[] {
    return (Object.entries(SKILL_PROFICIENCY_MAP) as [SkillName, ProficiencyLevel][])
        .filter(([, proficiency]) => proficiency === level)
        .map(([skillName]) => skillName);
}

/**
 * Statistics about skill proficiency distribution
 */
export function getProficiencyStats(): Record<ProficiencyLevel, number> {
    const stats: Record<ProficiencyLevel, number> = {
        expert: 0,
        advanced: 0,
        intermediate: 0,
        beginner: 0,
    };

    Object.values(SKILL_PROFICIENCY_MAP).forEach((level) => {
        stats[level]++;
    });

    return stats;
}