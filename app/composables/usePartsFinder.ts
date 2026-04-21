import type { Condition, Part, SortOption } from '~/types';
import { DEFAULT_FILTER_PARAMS, filterParts } from '~/utils/filterParts';

export function usePartsFinder() {
  const { data: rawParts, pending, error } = useFetch<Part[]>('/api/parts');

  const search = ref(DEFAULT_FILTER_PARAMS.search);
  const selectedCategory = ref(DEFAULT_FILTER_PARAMS.category);
  const selectedBrand = ref(DEFAULT_FILTER_PARAMS.brand);
  const selectedCondition = ref<Condition | 'All'>(DEFAULT_FILTER_PARAMS.condition);
  const inStockOnly = ref(DEFAULT_FILTER_PARAMS.inStockOnly);
  const sortBy = ref<SortOption>(DEFAULT_FILTER_PARAMS.sortBy);

  const categories = computed<string[]>(() => {
    if (!rawParts.value) return ['All'];
    return ['All', ...new Set(rawParts.value.map((p) => p.category))].sort();
  });

  const brands = computed<string[]>(() => {
    if (!rawParts.value) return ['All'];
    return ['All', ...new Set(rawParts.value.map((p) => p.brand))].sort();
  });

  const parts = computed<Part[]>(() => {
    if (!rawParts.value) return [];
    return filterParts(rawParts.value, {
      search: search.value,
      category: selectedCategory.value,
      brand: selectedBrand.value,
      condition: selectedCondition.value,
      inStockOnly: inStockOnly.value,
      sortBy: sortBy.value,
    });
  });

  // Number of sidebar filters that differ from their default (search excluded —
  // it lives in the toolbar, not the sidebar).
  const activeFilterCount = computed<number>(() => {
    let n = 0;
    if (selectedCategory.value !== 'All') n++;
    if (selectedBrand.value !== 'All') n++;
    if (selectedCondition.value !== 'All') n++;
    if (inStockOnly.value) n++;
    return n;
  });

  function resetFilters() {
    search.value = DEFAULT_FILTER_PARAMS.search;
    selectedCategory.value = DEFAULT_FILTER_PARAMS.category;
    selectedBrand.value = DEFAULT_FILTER_PARAMS.brand;
    selectedCondition.value = DEFAULT_FILTER_PARAMS.condition;
    inStockOnly.value = DEFAULT_FILTER_PARAMS.inStockOnly;
  }

  return {
    // Filter / sort state
    search,
    selectedCategory,
    selectedBrand,
    selectedCondition,
    inStockOnly,
    sortBy,
    // Derived data
    parts,
    categories,
    brands,
    activeFilterCount,
    // Fetch state
    pending,
    error,
    // Actions
    resetFilters,
  };
}
