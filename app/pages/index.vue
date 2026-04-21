<script setup lang="ts">
useSeoMeta({ title: 'Parts Finder – Browse Parts' });

const {
  search,
  selectedCategory,
  selectedBrand,
  selectedCondition,
  inStockOnly,
  sortBy,
  parts,
  categories,
  brands,
  pending,
  error,
  activeFilterCount,
  resetFilters,
} = usePartsFinder();

// Mobile filter-panel visibility — UI-only, not part of list state
const showFilters = ref(false);

function handleReset() {
  resetFilters();
  showFilters.value = false;
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Page header -->
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Parts Catalog</h1>
      <p class="mt-1 text-sm text-gray-500">
        <template v-if="pending">Loading parts…</template>
        <template v-else-if="error">Could not load parts.</template>
        <template v-else>
          {{ parts.length }} {{ parts.length === 1 ? 'part' : 'parts' }} found
        </template>
      </p>
    </header>

    <!-- Toolbar: search · filter toggle · sort -->
    <div class="mb-6 flex flex-wrap items-center gap-3">
      <AppInput
        v-model="search"
        placeholder="Search by name or OEM number…"
        :icon="true"
        class="min-w-[200px] flex-1 sm:max-w-sm"
        aria-label="Search parts"
      />

      <!-- Filter toggle — mobile only -->
      <button
        class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 lg:hidden"
        :aria-expanded="showFilters"
        aria-controls="filter-sidebar"
        @click="showFilters = !showFilters"
      >
        <svg
          class="size-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
          />
        </svg>
        Filters
        <span
          v-if="activeFilterCount > 0"
          class="inline-flex size-5 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700"
          :aria-label="`${activeFilterCount} active filters`"
        >
          {{ activeFilterCount }}
        </span>
      </button>

      <div class="ml-auto">
        <PartSortSelect v-model="sortBy" aria-label="Sort parts" />
      </div>
    </div>

    <!-- Layout: sidebar + content -->
    <div class="flex flex-col gap-6 lg:flex-row lg:items-start">
      <!-- Filter sidebar -->
      <div
        id="filter-sidebar"
        :class="['shrink-0 lg:w-48', showFilters ? 'block' : 'hidden lg:block']"
      >
        <!-- Mobile: panel card -->
        <div
          class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
        >
          <PartFilters
            v-model:selected-category="selectedCategory"
            v-model:selected-brand="selectedBrand"
            v-model:selected-condition="selectedCondition"
            v-model:in-stock-only="inStockOnly"
            :categories="categories"
            :brands="brands"
            @reset="handleReset"
          />
        </div>
      </div>

      <!-- Main content -->
      <section class="min-w-0 flex-1" aria-label="Parts list">
        <!-- API error -->
        <div
          v-if="error"
          class="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 py-16 text-center"
          role="alert"
        >
          <svg
            class="mb-3 size-10 text-red-300"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p class="text-sm font-medium text-red-700">Failed to load parts.</p>
          <p class="mt-1 text-xs text-red-500">Please check the API and try again.</p>
        </div>

        <!-- Loading skeletons -->
        <ul
          v-else-if="pending"
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-label="Loading parts"
          aria-busy="true"
        >
          <li
            v-for="n in 6"
            :key="n"
            class="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white"
            aria-hidden="true"
          >
            <div class="aspect-[16/10] bg-gray-100" />
            <div class="p-4">
              <div class="mb-3 flex gap-2">
                <div class="h-5 w-14 rounded-full bg-gray-100" />
                <div class="h-5 w-14 rounded-full bg-gray-100" />
              </div>
              <div class="h-4 w-3/4 rounded bg-gray-100" />
              <div class="mt-2 h-3 w-1/3 rounded bg-gray-100" />
              <div class="mt-1 h-3 w-1/4 rounded bg-gray-100" />
            </div>
            <div class="border-t border-gray-100 p-4">
              <div class="flex items-end justify-between">
                <div>
                  <div class="h-6 w-16 rounded bg-gray-100" />
                  <div class="mt-2 h-3 w-14 rounded bg-gray-100" />
                </div>
                <div class="h-8 w-24 rounded-lg bg-gray-100" />
              </div>
            </div>
          </li>
        </ul>

        <!-- Empty state -->
        <div
          v-else-if="parts.length === 0"
          class="flex flex-col items-center justify-center py-20 text-center"
        >
          <svg
            class="mb-4 size-14 text-gray-200"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <template v-if="search.trim()">
            <p class="font-medium text-gray-600">
              No results for "<span class="text-gray-900">{{ search.trim() }}</span
              >"
            </p>
            <p class="mt-1 text-sm text-gray-400">
              Check the spelling or try a different name or OEM number.
            </p>
          </template>
          <template v-else>
            <p class="font-medium text-gray-600">No parts match your filters.</p>
            <p class="mt-1 text-sm text-gray-400">Try adjusting the filters in the sidebar.</p>
          </template>
          <AppButton variant="secondary" size="sm" class="mt-5" @click="handleReset">
            {{ search.trim() && activeFilterCount === 0 ? 'Clear search' : 'Clear all filters' }}
          </AppButton>
        </div>

        <!-- Parts grid -->
        <ul v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" role="list">
          <li v-for="part in parts" :key="part.id">
            <PartCard :part="part" />
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
