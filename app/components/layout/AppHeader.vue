<script setup lang="ts">
const { totalItems, totalPrice } = useQuote();
const showDrawer = useState('show-quote-drawer', () => false);
</script>

<template>
  <div class="sticky top-0 z-40">
    <!-- Utility bar — desktop only -->
    <div class="hidden border-b border-slate-800 bg-slate-950 sm:block">
      <div class="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <span class="text-[11px] font-medium uppercase tracking-widest text-slate-500">
          Professional Heavy Vehicle Parts
        </span>
        <span class="text-[11px] text-slate-600">B2B Catalog</span>
      </div>
    </div>

    <!-- Main nav -->
    <header class="border-b border-slate-700/60 bg-slate-900 shadow-lg">
      <div
        class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="group flex shrink-0 items-center gap-2.5 text-white"
          aria-label="Parts Finder — back to catalog"
        >
          <div
            class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 transition-colors group-hover:bg-blue-500"
          >
            <svg
              class="size-[18px] text-white"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          <div class="flex flex-col leading-none">
            <span class="text-[15px] font-bold tracking-tight">
              Parts<span class="text-blue-400">Finder</span>
            </span>
            <span class="mt-0.5 hidden text-[10px] font-normal text-slate-400 sm:block">
              Heavy Vehicle Parts
            </span>
          </div>
        </NuxtLink>

        <!-- Quote CTA -->
        <button
          class="group relative flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white transition-all hover:border-blue-500/70 hover:bg-slate-700 sm:px-4"
          aria-label="Open quote list"
          @click="showDrawer = true"
        >
          <!-- Icon + badge -->
          <div class="relative shrink-0">
            <svg
              class="size-5 text-slate-300 transition-colors group-hover:text-white"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <Transition name="pop">
              <span
                v-if="totalItems > 0"
                key="badge"
                class="absolute -right-1.5 -top-1.5 flex size-[18px] items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold leading-none"
              >
                {{ totalItems > 9 ? '9+' : totalItems }}
              </span>
            </Transition>
          </div>

          <!-- Label block — sm+ -->
          <div class="hidden flex-col items-start sm:flex">
            <span class="text-xs font-semibold leading-none text-white">Quote List</span>
            <span v-if="totalItems > 0" class="mt-1 text-[11px] leading-none text-blue-300">
              {{ totalItems }} {{ totalItems === 1 ? 'item' : 'items' }} &middot; €{{
                totalPrice.toLocaleString()
              }}
            </span>
            <span v-else class="mt-1 text-[11px] leading-none text-slate-500"> No items yet </span>
          </div>

          <!-- Chevron — lg+ -->
          <svg
            class="hidden size-3.5 shrink-0 text-slate-500 transition-colors group-hover:text-slate-300 lg:block"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </header>
  </div>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}
.pop-enter-from,
.pop-leave-to {
  transform: scale(0.5);
  opacity: 0;
}
</style>
