<script setup lang="ts">
import type { SortOption } from '~/types';

defineProps<{ modelValue: SortOption }>();
const emit = defineEmits<{ 'update:modelValue': [value: SortOption] }>();

const options: { value: SortOption; label: string }[] = [
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
];
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Visible label — sm+ only; hidden on mobile to save space -->
    <span class="hidden shrink-0 text-sm text-gray-500 sm:block" aria-hidden="true"> Sort: </span>

    <div class="relative">
      <!-- Sort icon -->
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5"
        aria-hidden="true"
      >
        <svg
          class="size-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
          />
        </svg>
      </div>

      <select
        :value="modelValue"
        aria-label="Sort parts by"
        class="rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        @change="
          emit('update:modelValue', ($event.target as HTMLSelectElement).value as SortOption)
        "
      >
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>
  </div>
</template>
