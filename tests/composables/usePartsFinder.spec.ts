import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { usePartsFinder } from '~/composables/usePartsFinder';
import type { Part } from '~/types';

const MOCK_PARTS: Part[] = [
  {
    id: '1',
    name: 'DAF XF Sideskirt Set',
    oem: '2119711',
    brand: 'DAF',
    condition: 'used',
    price: 795,
    inStock: true,
    category: 'Body',
    image: '',
  },
  {
    id: '2',
    name: 'Volvo Front Bumper',
    oem: '82397275',
    brand: 'Volvo',
    condition: 'new',
    price: 450,
    inStock: true,
    category: 'Body',
    image: '',
  },
  {
    id: '3',
    name: 'DAF Fuel Injector',
    oem: '1974249',
    brand: 'DAF',
    condition: 'refurbished',
    price: 280,
    inStock: false,
    category: 'Engine',
    image: '',
  },
];

mockNuxtImport('useFetch', () => {
  return () => ({
    data: ref(MOCK_PARTS),
    pending: ref(false),
    error: ref(null),
  });
});

describe('usePartsFinder', () => {
  it('returns all parts when no filters are applied', () => {
    const { parts } = usePartsFinder();
    expect(parts.value).toHaveLength(MOCK_PARTS.length);
  });

  it('derives a sorted category list that starts with All', () => {
    const { categories } = usePartsFinder();
    expect(categories.value).toEqual(['All', 'Body', 'Engine']);
  });

  it('derives a sorted brand list that starts with All', () => {
    const { brands } = usePartsFinder();
    expect(brands.value).toEqual(['All', 'DAF', 'Volvo']);
  });

  it('filters parts by search query matching name', async () => {
    const { parts, search } = usePartsFinder();
    search.value = 'injector';
    await nextTick();
    expect(parts.value).toHaveLength(1);
    expect(parts.value[0].id).toBe('3');
  });

  it('filters parts by search query matching OEM number', async () => {
    const { parts, search } = usePartsFinder();
    search.value = '82397275';
    await nextTick();
    expect(parts.value).toHaveLength(1);
    expect(parts.value[0].id).toBe('2');
  });

  it('filters parts by category', async () => {
    const { parts, selectedCategory } = usePartsFinder();
    selectedCategory.value = 'Engine';
    await nextTick();
    expect(parts.value).toHaveLength(1);
    expect(parts.value.every((p) => p.category === 'Engine')).toBe(true);
  });

  it('filters parts by brand', async () => {
    const { parts, selectedBrand } = usePartsFinder();
    selectedBrand.value = 'DAF';
    await nextTick();
    expect(parts.value).toHaveLength(2);
    expect(parts.value.every((p) => p.brand === 'DAF')).toBe(true);
  });

  it('filters to in-stock parts only', async () => {
    const { parts, inStockOnly } = usePartsFinder();
    inStockOnly.value = true;
    await nextTick();
    expect(parts.value.every((p) => p.inStock)).toBe(true);
    expect(parts.value).toHaveLength(2);
  });

  it('reports activeFilterCount as 0 with default state', () => {
    const { activeFilterCount } = usePartsFinder();
    expect(activeFilterCount.value).toBe(0);
  });

  it('increments activeFilterCount for each active filter', async () => {
    const { activeFilterCount, selectedCategory, selectedBrand, inStockOnly } = usePartsFinder();
    selectedCategory.value = 'Engine';
    selectedBrand.value = 'DAF';
    inStockOnly.value = true;
    await nextTick();
    expect(activeFilterCount.value).toBe(3);
  });

  it('resets all filters to defaults', async () => {
    const { activeFilterCount, selectedCategory, selectedBrand, parts, resetFilters } =
      usePartsFinder();
    selectedCategory.value = 'Engine';
    selectedBrand.value = 'DAF';
    await nextTick();
    expect(activeFilterCount.value).toBe(2);

    resetFilters();
    await nextTick();
    expect(activeFilterCount.value).toBe(0);
    expect(parts.value).toHaveLength(MOCK_PARTS.length);
  });

  it('exposes pending and error state from useFetch', () => {
    const { pending, error } = usePartsFinder();
    expect(pending.value).toBe(false);
    expect(error.value).toBeNull();
  });
});
