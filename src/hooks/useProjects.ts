import { useMemo } from 'react';
import { PROJECTS } from '@/lib/constants/projects';
import type { Project } from '@/lib/types/project';
import { useFilteredData, createFilterFn, combineFilters } from './useFilteredData';
import { useMinecraftAssets } from './useMinecraftAssets';

/**
 * Hook for managing project data with filtering and sorting
 */

export interface UseProjectsOptions {
  featured?: boolean;
  category?: string;
  limit?: number;
  sortBy?: 'year' | 'order' | 'title';
  sortOrder?: 'asc' | 'desc';
  searchQuery?: string;
}

export interface UseProjectsReturn {
  projects: Project[];
  totalCount: number;
  hasMore: boolean;
  categories: string[];
  getProjectAsset: (category: string) => string;
}

export function useProjects({
  featured,
  category,
  limit,
  sortBy = 'order',
  sortOrder = 'asc',
  searchQuery,
}: UseProjectsOptions = {}): UseProjectsReturn {
  const { getCategoryItem } = useMinecraftAssets();

  // Create filter functions
  const filters = useMemo(() => {
    const filterFns: Array<(item: Project) => boolean> = [];

    if (featured !== undefined) {
      filterFns.push(createFilterFn<Project>('featured', featured));
    }

    if (category) {
      filterFns.push(createFilterFn<Project>('category', category));
    }

    if (searchQuery) {
      filterFns.push((project: Project) => {
        const query = searchQuery.toLowerCase();
        return (
          project.title.toLowerCase().includes(query) ||
          project.shortDescription.toLowerCase().includes(query) ||
          project.longDescription?.toLowerCase().includes(query) ||
          project.techStack.some(tech => tech.name.toLowerCase().includes(query))
        );
      });
    }

    return filterFns.length > 0 ? combineFilters(...filterFns) : undefined;
  }, [featured, category, searchQuery]);

  // Create sort function
  const sortFn = useMemo(() => {
    switch (sortBy) {
      case 'year':
        return (a: Project, b: Project) => {
          const comparison = (a.year || 0) - (b.year || 0);
          return sortOrder === 'asc' ? comparison : -comparison;
        };
      case 'title':
        return (a: Project, b: Project) => {
          const comparison = a.title.localeCompare(b.title);
          return sortOrder === 'asc' ? comparison : -comparison;
        };
      case 'order':
      default:
        return (a: Project, b: Project) => {
          const comparison = (a.order || 999) - (b.order || 999);
          return sortOrder === 'asc' ? comparison : -comparison;
        };
    }
  }, [sortBy, sortOrder]);

  // Use the generic filtered data hook
  const { filteredData, totalCount, hasMore } = useFilteredData({
    data: PROJECTS,
    filterFn: filters,
    sortFn,
    limit,
  });

  // Extract unique categories
  const categories = useMemo(() => {
    const categorySet = new Set(PROJECTS.map(project => project.category));
    return Array.from(categorySet).sort();
  }, []);

  return {
    projects: filteredData,
    totalCount,
    hasMore,
    categories,
    getProjectAsset: getCategoryItem,
  };
}

/**
 * Hook for getting featured projects
 */
export function useFeaturedProjects(limit: number = 3) {
  return useProjects({
    featured: true,
    limit,
    sortBy: 'order',
  });
}

/**
 * Hook for getting projects by category
 */
export function useProjectsByCategory(category: string, limit?: number) {
  return useProjects({
    category,
    limit,
    sortBy: 'year',
    sortOrder: 'desc',
  });
}