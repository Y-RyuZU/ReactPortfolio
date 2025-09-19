import { useMemo, useState } from 'react';
import { SKILL_CATEGORIES, FEATURED_SKILLS } from '@/lib/constants/skills';
import type { Skill, SkillCategory, ProficiencyLevel } from '@/lib/types/skill';
import { useFilteredData, createFilterFn, combineFilters } from './useFilteredData';

/**
 * Hook for managing skill data with filtering
 */

export interface UseSkillsOptions {
  category?: string;
  featured?: boolean;
  proficiency?: ProficiencyLevel;
  searchQuery?: string;
}

export interface UseSkillsReturn {
  skills: Skill[];
  categories: SkillCategory[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  totalCount: number;
  getCategorySkills: (categoryId: string) => Skill[];
  getFeaturedSkills: () => Skill[];
}

export function useSkills({
  category: initialCategory = 'all',
  featured = false,
  proficiency,
  searchQuery,
}: UseSkillsOptions = {}): UseSkillsReturn {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Get all skills from all categories
  const allSkills = useMemo(() => {
    if (featured) {
      return FEATURED_SKILLS;
    }

    return SKILL_CATEGORIES.flatMap(category => category.skills);
  }, [featured]);

  // Create filter functions
  const filters = useMemo(() => {
    const filterFns: Array<(item: Skill) => boolean> = [];

    // Category filter
    if (selectedCategory !== 'all' && !featured) {
      filterFns.push((skill: Skill) => {
        const category = SKILL_CATEGORIES.find(cat =>
          cat.skills.some(s => s.name === skill.name)
        );
        return category?.id === selectedCategory;
      });
    }

    // Proficiency filter
    if (proficiency) {
      filterFns.push(createFilterFn<Skill>('proficiency', proficiency));
    }

    // Search filter
    if (searchQuery) {
      filterFns.push((skill: Skill) => {
        const query = searchQuery.toLowerCase();
        return skill.name.toLowerCase().includes(query);
      });
    }

    return filterFns.length > 0 ? combineFilters(...filterFns) : undefined;
  }, [selectedCategory, featured, proficiency, searchQuery]);

  // Use the generic filtered data hook
  const { filteredData, totalCount } = useFilteredData({
    data: allSkills,
    filterFn: filters,
  });

  // Helper function to get skills by category
  const getCategorySkills = useMemo(
    () => (categoryId: string) => {
      const category = SKILL_CATEGORIES.find(cat => cat.id === categoryId);
      return category?.skills || [];
    },
    []
  );

  // Helper function to get featured skills
  const getFeaturedSkills = useMemo(
    () => () => FEATURED_SKILLS,
    []
  );

  return {
    skills: filteredData,
    categories: SKILL_CATEGORIES,
    selectedCategory,
    setSelectedCategory,
    totalCount,
    getCategorySkills,
    getFeaturedSkills,
  };
}

/**
 * Hook for managing skill categories with tab navigation
 */
export function useSkillCategories() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = useMemo(() => {
    return [
      {
        id: 'all',
        title: 'All Skills',
        icon: '/images/minecraft/item/nether_star.png',
        skills: SKILL_CATEGORIES.flatMap(cat => cat.skills),
      },
      ...SKILL_CATEGORIES,
    ];
  }, []);

  const getActiveSkills = useMemo(() => {
    if (activeCategory === 'all') {
      return SKILL_CATEGORIES.flatMap(cat => cat.skills);
    }
    const category = SKILL_CATEGORIES.find(cat => cat.id === activeCategory);
    return category?.skills || [];
  }, [activeCategory]);

  return {
    categories,
    activeCategory,
    setActiveCategory,
    activeSkills: getActiveSkills,
    totalSkillCount: SKILL_CATEGORIES.reduce((sum, cat) => sum + cat.skills.length, 0),
  };
}

/**
 * Hook for getting featured skills only
 */
export function useFeaturedSkills() {
  return {
    skills: FEATURED_SKILLS,
    count: FEATURED_SKILLS.length,
  };
}