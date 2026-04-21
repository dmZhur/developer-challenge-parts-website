import { beforeEach, describe, expect, it } from 'vitest';
import { useQuote } from '~/composables/useQuote';
import type { Part } from '~/types';

const mockPart: Part = {
  id: 'p1',
  name: 'DAF XF 106 Sideskirt Set',
  oem: '2119711',
  brand: 'DAF',
  condition: 'used',
  price: 795,
  inStock: true,
  category: 'Body',
  image: '/img/placeholder-part.svg',
};

const mockPart2: Part = {
  id: 'p2',
  name: 'Volvo FH4 Front Bumper',
  oem: '82397275',
  brand: 'Volvo',
  condition: 'used',
  price: 450,
  inStock: true,
  category: 'Body',
  image: '/img/placeholder-part.svg',
};

describe('useQuote', () => {
  beforeEach(() => {
    const { clearQuote } = useQuote();
    clearQuote();
  });

  it('starts with an empty quote', () => {
    const { items, totalItems, totalPrice } = useQuote();
    expect(items.value).toHaveLength(0);
    expect(totalItems.value).toBe(0);
    expect(totalPrice.value).toBe(0);
  });

  it('adds a part with quantity 1 by default', () => {
    const { addToQuote, items } = useQuote();
    addToQuote(mockPart);
    expect(items.value).toHaveLength(1);
    expect(items.value[0].quantity).toBe(1);
  });

  it('adds a part with a specified quantity', () => {
    const { addToQuote, items } = useQuote();
    addToQuote(mockPart, 3);
    expect(items.value[0].quantity).toBe(3);
  });

  it('increments quantity when the same part is added again', () => {
    const { addToQuote, items } = useQuote();
    addToQuote(mockPart);
    addToQuote(mockPart, 2);
    expect(items.value).toHaveLength(1);
    expect(items.value[0].quantity).toBe(3);
  });

  it('keeps separate entries for different parts', () => {
    const { addToQuote, items } = useQuote();
    addToQuote(mockPart);
    addToQuote(mockPart2);
    expect(items.value).toHaveLength(2);
  });

  it('removes a part from the quote', () => {
    const { addToQuote, removeFromQuote, items } = useQuote();
    addToQuote(mockPart);
    removeFromQuote(mockPart.id);
    expect(items.value).toHaveLength(0);
  });

  it('updates quantity of an existing item', () => {
    const { addToQuote, updateQuantity, items } = useQuote();
    addToQuote(mockPart);
    updateQuantity(mockPart.id, 5);
    expect(items.value[0].quantity).toBe(5);
  });

  it('removes item when quantity is updated to 0', () => {
    const { addToQuote, updateQuantity, items } = useQuote();
    addToQuote(mockPart);
    updateQuantity(mockPart.id, 0);
    expect(items.value).toHaveLength(0);
  });

  it('computes total items correctly', () => {
    const { addToQuote, totalItems } = useQuote();
    addToQuote(mockPart, 2);
    addToQuote(mockPart2, 3);
    expect(totalItems.value).toBe(5);
  });

  it('computes total price correctly', () => {
    const { addToQuote, totalPrice } = useQuote();
    addToQuote(mockPart, 1); // 795 * 1 = 795
    addToQuote(mockPart2, 2); // 450 * 2 = 900
    expect(totalPrice.value).toBe(1695);
  });

  it('reports isInQuote correctly', () => {
    const { addToQuote, isInQuote } = useQuote();
    expect(isInQuote(mockPart.id)).toBe(false);
    addToQuote(mockPart);
    expect(isInQuote(mockPart.id)).toBe(true);
  });

  it('clears all items', () => {
    const { addToQuote, clearQuote, items } = useQuote();
    addToQuote(mockPart);
    addToQuote(mockPart2);
    clearQuote();
    expect(items.value).toHaveLength(0);
  });
});
