import { describe, expect, it } from 'vitest';
import { DEFAULT_FILTER_PARAMS, filterParts } from '~/utils/filterParts';
import type { Part } from '~/types';

// ─── Minimal fixture dataset
const PARTS: Part[] = [
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
    condition: 'used',
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
  {
    id: '4',
    name: 'MAN Front Grille',
    oem: '81621006105',
    brand: 'MAN',
    condition: 'new',
    price: 385,
    inStock: true,
    category: 'Body',
    image: '',
  },
  {
    id: '5',
    name: 'Scania Turbocharger',
    oem: '1524793',
    brand: 'Scania',
    condition: 'used',
    price: 890,
    inStock: true,
    category: 'Engine',
    image: '',
  },
];

const base = DEFAULT_FILTER_PARAMS;

// ─── Helpers ──────────────────────────────────────────────────────────────
const ids = (parts: Part[]) => parts.map((p) => p.id);

// ─── Search ───────────────────────────────────────────────────────────────
describe('filterParts – search', () => {
  it('returns all parts when search is empty', () => {
    const result = filterParts(PARTS, { ...base, search: '' });
    expect(result).toHaveLength(PARTS.length);
  });

  it('returns all parts when search is only whitespace', () => {
    const result = filterParts(PARTS, { ...base, search: '   ' });
    expect(result).toHaveLength(PARTS.length);
  });

  it('matches by part name (case-insensitive)', () => {
    const result = filterParts(PARTS, { ...base, search: 'daf xf' });
    expect(ids(result)).toEqual(['1']);
  });

  it('matches by OEM number', () => {
    const result = filterParts(PARTS, { ...base, search: '1524793' });
    expect(ids(result)).toEqual(['5']);
  });

  it('matches partial name', () => {
    const result = filterParts(PARTS, { ...base, search: 'bumper' });
    expect(ids(result)).toEqual(['2']);
  });

  it('matches partial OEM', () => {
    // '82397275' contains '82397'
    const result = filterParts(PARTS, { ...base, search: '82397' });
    expect(ids(result)).toEqual(['2']);
  });

  it('is case-insensitive for uppercase input', () => {
    const result = filterParts(PARTS, { ...base, search: 'VOLVO' });
    expect(ids(result)).toContain('2');
  });

  it('is case-insensitive for mixed case input', () => {
    const result = filterParts(PARTS, { ...base, search: 'ScAnIa' });
    expect(ids(result)).toContain('5');
  });

  it('returns an empty array when nothing matches', () => {
    const result = filterParts(PARTS, { ...base, search: 'xyz-no-match' });
    expect(result).toHaveLength(0);
  });

  it('returns results matching multiple parts', () => {
    // 'front' matches both 'Volvo Front Bumper' and 'MAN Front Grille'
    const result = filterParts(PARTS, { ...base, search: 'front' });
    expect(ids(result)).toEqual(expect.arrayContaining(['2', '4']));
    expect(result).toHaveLength(2);
  });
});

// ─── Filters ──────────────────────────────────────────────────────────────
describe('filterParts – category filter', () => {
  it('returns only parts in the selected category', () => {
    const result = filterParts(PARTS, { ...base, category: 'Engine' });
    expect(result.every((p) => p.category === 'Engine')).toBe(true);
    expect(result).toHaveLength(2);
  });

  it('returns all parts when category is "All"', () => {
    const result = filterParts(PARTS, { ...base, category: 'All' });
    expect(result).toHaveLength(PARTS.length);
  });
});

describe('filterParts – brand filter', () => {
  it('returns only parts from the selected brand', () => {
    const result = filterParts(PARTS, { ...base, brand: 'DAF' });
    expect(result.every((p) => p.brand === 'DAF')).toBe(true);
    expect(result).toHaveLength(2);
  });

  it('returns all parts when brand is "All"', () => {
    const result = filterParts(PARTS, { ...base, brand: 'All' });
    expect(result).toHaveLength(PARTS.length);
  });
});

describe('filterParts – condition filter', () => {
  it('returns only new parts', () => {
    const result = filterParts(PARTS, { ...base, condition: 'new' });
    expect(result.every((p) => p.condition === 'new')).toBe(true);
    expect(result).toHaveLength(1);
  });

  it('returns only used parts', () => {
    const result = filterParts(PARTS, { ...base, condition: 'used' });
    expect(result.every((p) => p.condition === 'used')).toBe(true);
    expect(result).toHaveLength(3);
  });

  it('returns only refurbished parts', () => {
    const result = filterParts(PARTS, { ...base, condition: 'refurbished' });
    expect(result.every((p) => p.condition === 'refurbished')).toBe(true);
    expect(result).toHaveLength(1);
  });
});

describe('filterParts – inStock filter', () => {
  it('returns only in-stock parts when enabled', () => {
    const result = filterParts(PARTS, { ...base, inStockOnly: true });
    expect(result.every((p) => p.inStock)).toBe(true);
  });

  it('includes out-of-stock parts when disabled', () => {
    const result = filterParts(PARTS, { ...base, inStockOnly: false });
    expect(result.some((p) => !p.inStock)).toBe(true);
  });
});

// ─── Sort ─────────────────────────────────────────────────────────────────
describe('filterParts – sort', () => {
  it('sorts by name ascending', () => {
    const result = filterParts(PARTS, { ...base, sortBy: 'name-asc' });
    const names = result.map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('sorts by name descending', () => {
    const result = filterParts(PARTS, { ...base, sortBy: 'name-desc' });
    const names = result.map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  it('sorts by price ascending', () => {
    const result = filterParts(PARTS, { ...base, sortBy: 'price-asc' });
    const prices = result.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('sorts by price descending', () => {
    const result = filterParts(PARTS, { ...base, sortBy: 'price-desc' });
    const prices = result.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});

// ─── Combined ─────────────────────────────────────────────────────────────
describe('filterParts – combined filters', () => {
  it('combines search with category filter', () => {
    // 'daf' matches parts 1 and 3; Engine category keeps only 3
    const result = filterParts(PARTS, { ...base, search: 'daf', category: 'Engine' });
    expect(ids(result)).toEqual(['3']);
  });

  it('combines brand with inStock filter', () => {
    // DAF parts: 1 (inStock) and 3 (not inStock) → only 1 survives
    const result = filterParts(PARTS, { ...base, brand: 'DAF', inStockOnly: true });
    expect(ids(result)).toEqual(['1']);
  });

  it('returns empty when search and filter together match nothing', () => {
    const result = filterParts(PARTS, {
      ...base,
      search: 'turbocharger',
      brand: 'Volvo',
    });
    expect(result).toHaveLength(0);
  });
});

// ─── Immutability ─────────────────────────────────────────────────────────
describe('filterParts – side effects', () => {
  it('does not mutate the original array', () => {
    const original = [...PARTS];
    filterParts(PARTS, { ...base, sortBy: 'price-desc' });
    expect(PARTS).toEqual(original);
  });
});
