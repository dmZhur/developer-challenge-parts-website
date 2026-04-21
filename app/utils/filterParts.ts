import type { Condition, Part, SortOption } from '~/types';

export interface FilterParams {
  search: string;
  category: string;
  brand: string;
  condition: Condition | 'All';
  inStockOnly: boolean;
  sortBy: SortOption;
}

export const DEFAULT_FILTER_PARAMS: FilterParams = {
  search: '',
  category: 'All',
  brand: 'All',
  condition: 'All',
  inStockOnly: false,
  sortBy: 'name-asc',
};

/**
 * Pure function — no reactivity, no side effects.
 * Returns a filtered and sorted copy of parts; never mutates the input array.
 */
export function filterParts(parts: Part[], params: FilterParams): Part[] {
  let result = parts;

  const q = params.search.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.oem.toLowerCase().includes(q)
    );
  }

  if (params.category !== 'All') {
    result = result.filter((p) => p.category === params.category);
  }

  if (params.brand !== 'All') {
    result = result.filter((p) => p.brand === params.brand);
  }

  if (params.condition !== 'All') {
    result = result.filter((p) => p.condition === params.condition);
  }

  if (params.inStockOnly) {
    result = result.filter((p) => p.inStock);
  }

  return [...result].sort((a, b) => {
    switch (params.sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });
}
