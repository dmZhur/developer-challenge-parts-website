<script setup lang="ts">
import type { Condition } from '~/types';

const props = defineProps<{
  categories: string[];
  brands: string[];
  selectedCategory: string;
  selectedBrand: string;
  selectedCondition: Condition | 'All';
  inStockOnly: boolean;
}>();

const emit = defineEmits<{
  'update:selectedCategory': [value: string];
  'update:selectedBrand': [value: string];
  'update:selectedCondition': [value: Condition | 'All'];
  'update:inStockOnly': [value: boolean];
  reset: [];
}>();

const CONDITIONS: { value: Condition | 'All'; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
  { value: 'refurbished', label: 'Refurbished' },
];

const hasActiveFilters = computed(
  () =>
    props.selectedCategory !== 'All' ||
    props.selectedBrand !== 'All' ||
    props.selectedCondition !== 'All' ||
    props.inStockOnly
);
</script>

<template>
  <aside aria-label="Filter parts">
    <!-- Sidebar header -->
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xs font-bold uppercase tracking-widest text-gray-500">Filters</h2>
      <Transition name="fade">
        <button
          v-if="hasActiveFilters"
          class="cursor-pointer text-xs font-medium text-blue-600 hover:underline"
          @click="emit('reset')"
        >
          Clear all
        </button>
      </Transition>
    </div>

    <div class="space-y-6">
      <!-- Condition -->
      <div>
        <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Condition</h3>
        <ul class="space-y-px" role="list">
          <li v-for="c in CONDITIONS" :key="c.value">
            <button
              :class="[
                'w-full rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                selectedCondition === c.value
                  ? 'bg-blue-50 font-semibold text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              ]"
              :aria-pressed="selectedCondition === c.value"
              @click="emit('update:selectedCondition', c.value)"
            >
              {{ c.label }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Category -->
      <div>
        <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Category</h3>
        <ul class="space-y-px" role="list">
          <li v-for="cat in categories" :key="cat">
            <button
              :class="[
                'w-full rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                selectedCategory === cat
                  ? 'bg-blue-50 font-semibold text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              ]"
              :aria-pressed="selectedCategory === cat"
              @click="emit('update:selectedCategory', cat)"
            >
              {{ cat }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Brand -->
      <div>
        <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Brand</h3>
        <ul class="space-y-px" role="list">
          <li v-for="brand in brands" :key="brand">
            <button
              :class="[
                'w-full rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                selectedBrand === brand
                  ? 'bg-blue-50 font-semibold text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              ]"
              :aria-pressed="selectedBrand === brand"
              @click="emit('update:selectedBrand', brand)"
            >
              {{ brand }}
            </button>
          </li>
        </ul>
      </div>

      <!-- In stock -->
      <label class="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          :checked="inStockOnly"
          class="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          @change="emit('update:inStockOnly', ($event.target as HTMLInputElement).checked)"
        />
        <span class="text-sm text-gray-700">In stock only</span>
      </label>
    </div>
  </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
