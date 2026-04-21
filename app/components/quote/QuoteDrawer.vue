<script setup lang="ts">
const showDrawer = useState('show-quote-drawer', () => false);
const { items, totalItems, totalPrice, clearQuote } = useQuote();

// Close on Escape — listener is active only while the drawer is open
watch(showDrawer, (open) => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') showDrawer.value = false;
  };
  if (open) window.addEventListener('keydown', handler);
  else window.removeEventListener('keydown', handler);
});
</script>

<template>
  <!--
    Teleport renders the drawer at <body> level so it is never clipped by a
    parent stacking context (the layout's flex container, AppHeader's z-40, etc.)
  -->
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="showDrawer"
        class="fixed inset-0 z-50"
        role="dialog"
        aria-modal="true"
        aria-label="Quote list"
      >
        <!-- Backdrop -->
        <div class="drawer-backdrop absolute inset-0 bg-black/40" @click="showDrawer = false" />

        <!-- Panel -->
        <div
          class="drawer-panel absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl"
        >
          <!-- Header -->
          <div
            class="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4"
          >
            <h2 class="text-base font-semibold text-gray-900">
              Quote List
              <span class="ml-1 text-sm font-normal text-gray-500">
                ({{ totalItems }} {{ totalItems === 1 ? 'item' : 'items' }})
              </span>
            </h2>
            <button
              class="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close quote list"
              @click="showDrawer = false"
            >
              <svg
                class="size-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Items list -->
          <div class="flex-1 overflow-y-auto px-5">
            <!-- Empty state -->
            <div
              v-if="items.length === 0"
              class="flex flex-col items-center justify-center py-16 text-center"
            >
              <svg
                class="mb-3 size-12 text-gray-200"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p class="text-sm font-medium text-gray-400">Your quote list is empty.</p>
              <p class="mt-1 text-xs text-gray-300">Add parts from the catalog to get started.</p>
              <NuxtLink
                to="/"
                class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                @click="showDrawer = false"
              >
                Browse catalog
                <svg
                  class="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </NuxtLink>
            </div>

            <!-- Item rows -->
            <ul role="list">
              <li
                v-for="item in items"
                :key="item.part.id"
                class="border-b border-gray-100 last:border-0"
              >
                <QuoteItem :item="item" />
              </li>
            </ul>
          </div>

          <!-- Footer — only when there are items -->
          <div
            v-if="items.length > 0"
            class="shrink-0 space-y-3 border-t border-gray-200 px-5 py-4"
          >
            <div class="flex items-baseline justify-between">
              <span class="text-sm text-gray-600">Total excl. VAT</span>
              <span class="text-xl font-bold text-gray-900">
                €{{ totalPrice.toLocaleString() }}
              </span>
            </div>

            <AppButton variant="primary" size="lg" class="w-full"> Submit Quote </AppButton>

            <AppButton variant="ghost" size="sm" class="w-full text-gray-500" @click="clearQuote">
              Clear all items
            </AppButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/*
  The <Transition name="drawer"> applies these classes to the outermost div.
  Backdrop fades with the parent opacity.
  Panel slides in/out independently via :deep() targeting .drawer-panel.
*/
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;
}

.drawer-enter-active :deep(.drawer-panel),
.drawer-leave-active :deep(.drawer-panel) {
  transition: transform 0.25s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from :deep(.drawer-panel),
.drawer-leave-to :deep(.drawer-panel) {
  transform: translateX(100%);
}
</style>
