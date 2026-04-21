import type { QuoteItem } from '~/types';

const STORAGE_KEY = 'pf-quote-items';

export default defineNuxtPlugin(() => {
  const { items } = useQuote();

  // Restore persisted quote after hydration is complete.
  // Running here (not in useQuote) means the useState ref is already
  // initialised with [] on both server and client, so hydration matches.
  // We mutate the ref after hydration, which triggers no mismatch warning.
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        items.value = parsed as QuoteItem[];
      }
    }
  } catch {
    // Corrupted entry — start fresh rather than crashing
    localStorage.removeItem(STORAGE_KEY);
  }

  // Persist every subsequent change (deep: true catches quantity edits)
  watch(
    items,
    (val) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
      } catch {
        // Storage quota exceeded or private-browsing restriction — silently skip
      }
    },
    { deep: true }
  );
});
