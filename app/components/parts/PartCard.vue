<script setup lang="ts">
import type { Part } from '~/types';

const props = defineProps<{ part: Part }>();

const { addToQuote, isInQuote } = useQuote();
const inQuote = computed(() => isInQuote(props.part.id));

const CONDITION_VARIANT = {
  new: 'success',
  used: 'warning',
  refurbished: 'blue',
} as const;

const CONDITION_LABEL: Record<string, string> = {
  new: 'New',
  used: 'Used',
  refurbished: 'Refurbished',
};
</script>

<template>
  <article
    class="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
  >
    <!--
      Image link: large mouse/touch target → detail page.
      Hidden from the a11y tree (tabindex=-1 / aria-hidden) because the
      part name below is the announced link for keyboard/screen-reader users.
    -->
    <NuxtLink
      :to="`/parts/${part.id}`"
      class="block aspect-[16/10] overflow-hidden bg-gray-50"
      tabindex="-1"
      aria-hidden="true"
    >
      <img
        :src="part.image"
        :alt="part.name"
        class="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
        loading="lazy"
        width="320"
        height="200"
      />
    </NuxtLink>

    <!-- Body -->
    <div class="flex flex-1 flex-col p-4 pb-3">
      <!-- Taxonomy badges -->
      <div class="mb-2.5 flex flex-wrap items-center gap-1.5" aria-label="Part classification">
        <AppBadge variant="blue">{{ part.category }}</AppBadge>
        <AppBadge :variant="CONDITION_VARIANT[part.condition]">
          {{ CONDITION_LABEL[part.condition] }}
        </AppBadge>
        <span
          v-if="part.colors?.length"
          class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700"
        >
          <span class="size-2 rounded-full bg-violet-400" aria-hidden="true" />
          Colour options
        </span>
      </div>

      <!-- Part name — keyboard-accessible link to the detail page -->
      <h3 class="text-sm font-semibold leading-snug text-gray-900">
        <NuxtLink
          :to="`/parts/${part.id}`"
          class="hover:text-blue-700 focus-visible:outline-none focus-visible:underline"
        >
          {{ part.name }}
        </NuxtLink>
      </h3>

      <!-- Structured data: OEM + brand -->
      <dl class="mt-2 space-y-1">
        <div class="flex items-center gap-2">
          <dt class="w-8 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            OEM
          </dt>
          <dd class="font-mono text-xs font-semibold tracking-tight text-gray-700">
            {{ part.oem }}
          </dd>
        </div>
        <div class="flex items-center gap-2">
          <dt class="sr-only">Brand</dt>
          <dd class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {{ part.brand }}
          </dd>
        </div>
      </dl>
    </div>

    <!-- Footer: price + stock + Add to Quote -->
    <div class="mt-auto border-t border-gray-100 px-4 py-3">
      <div class="flex items-end justify-between gap-3">
        <!-- Price + stock indicator -->
        <div>
          <p class="text-xl font-bold leading-none text-gray-900">
            €{{ part.price.toLocaleString() }}
          </p>
          <div class="mt-1.5 flex items-center gap-1.5">
            <span
              :class="[
                'size-2 shrink-0 rounded-full',
                part.inStock ? 'bg-green-500' : 'bg-red-400',
              ]"
              aria-hidden="true"
            />
            <span
              class="text-xs font-medium"
              :class="part.inStock ? 'text-green-700' : 'text-red-500'"
            >
              {{ part.inStock ? 'In Stock' : 'Out of Stock' }}
            </span>
          </div>
        </div>

        <!-- Add to Quote -->
        <AppButton
          size="sm"
          :variant="inQuote ? 'secondary' : 'primary'"
          :disabled="!part.inStock"
          @click="addToQuote(part)"
        >
          {{ inQuote ? '✓ Added' : 'Add to Quote' }}
        </AppButton>
      </div>
    </div>
  </article>
</template>
