import type { Part, QuoteItem } from '~/types';

export function useQuote() {
  const items = useState<QuoteItem[]>('quote-items', () => []);

  const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0));

  const totalPrice = computed(() =>
    items.value.reduce((sum, i) => sum + i.part.price * i.quantity, 0)
  );

  function addToQuote(part: Part, quantity = 1, color?: string) {
    const existing = items.value.find(
      (i) => i.part.id === part.id && i.color === color
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.value.push({ part, quantity, color });
    }
  }

  function removeFromQuote(partId: string, color?: string) {
    items.value = items.value.filter(
      (i) => !(i.part.id === partId && i.color === color)
    );
  }

  function updateQuantity(partId: string, quantity: number, color?: string) {
    if (quantity < 1) {
      removeFromQuote(partId, color);
      return;
    }
    const item = items.value.find((i) => i.part.id === partId && i.color === color);
    if (item) item.quantity = quantity;
  }

  function clearQuote() {
    items.value = [];
  }

  function isInQuote(partId: string) {
    return items.value.some((i) => i.part.id === partId);
  }

  return {
    items,
    totalItems,
    totalPrice,
    addToQuote,
    removeFromQuote,
    updateQuantity,
    clearQuote,
    isInQuote,
  };
}
