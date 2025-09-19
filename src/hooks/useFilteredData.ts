import { useMemo } from 'react';

/**
 * Generic hook for filtering, sorting, and limiting data
 * 汎用的なデータフィルタリング・ソート・制限フック
 */

export interface UseFilteredDataOptions<T> {
  data: T[];
  filterFn?: (item: T) => boolean;
  sortFn?: (a: T, b: T) => number;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface UseFilteredDataReturn<T> {
  filteredData: T[];
  totalCount: number;
  hasMore: boolean;
}

export function useFilteredData<T>({
  data,
  filterFn,
  sortFn,
  sortBy,
  sortOrder = 'asc',
  limit,
}: UseFilteredDataOptions<T>): UseFilteredDataReturn<T> {
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filter
    if (filterFn) {
      result = result.filter(filterFn);
    }

    // Apply sort
    if (sortFn) {
      result.sort(sortFn);
    } else if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (aVal === bVal) return 0;

        const comparison = aVal < bVal ? -1 : 1;
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    const totalCount = result.length;
    const hasMore = limit ? totalCount > limit : false;

    // Apply limit
    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }

    return {
      filteredData: result,
      totalCount,
      hasMore,
    };
  }, [data, filterFn, sortFn, sortBy, sortOrder, limit]);

  return processedData;
}

/**
 * Helper function to create filter functions
 */
export function createFilterFn<T, V = unknown>(
  field: keyof T,
  value: V,
  operator: 'equals' | 'includes' | 'gt' | 'lt' | 'gte' | 'lte' = 'equals'
): (item: T) => boolean {
  return (item: T) => {
    const itemValue = item[field];

    switch (operator) {
      case 'equals':
        return itemValue === value;
      case 'includes':
        if (typeof itemValue === 'string' && typeof value === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }
        if (Array.isArray(itemValue)) {
          return itemValue.includes(value);
        }
        return false;
      case 'gt':
        return (itemValue as unknown as number) > (value as unknown as number);
      case 'lt':
        return (itemValue as unknown as number) < (value as unknown as number);
      case 'gte':
        return (itemValue as unknown as number) >= (value as unknown as number);
      case 'lte':
        return (itemValue as unknown as number) <= (value as unknown as number);
      default:
        return itemValue === value;
    }
  };
}

/**
 * Helper function to combine multiple filters
 */
export function combineFilters<T>(...filters: Array<(item: T) => boolean>): (item: T) => boolean {
  return (item: T) => filters.every(filter => filter(item));
}