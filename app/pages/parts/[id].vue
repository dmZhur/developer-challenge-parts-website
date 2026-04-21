<script setup lang="ts">
import type { Part } from '~/types';

const route = useRoute();
const id = route.params.id as string;

// No `await` — pending is true during client-side navigation so a skeleton
// can be shown. On SSR the data is still fetched server-side and inlined.
const { data: part, pending, error } = useFetch<Part>(`/api/parts/${id}`);

useSeoMeta({ title: () => `${part.value?.name ?? 'Part'} – Parts Finder` });

const { addToQuote, isInQuote } = useQuote();
const inQuote = computed(() => (part.value ? isInQuote(part.value.id) : false));
const quantity = ref(1);

const selectedColor = ref('');
watch(part, (p) => {
  selectedColor.value = p?.colors?.[0] ?? '';
}, { immediate: true });


const conditionVariant: Record<Part['condition'], 'success' | 'warning' | 'blue'> = {
  new: 'success',
  used: 'warning',
  refurbished: 'blue',
};

// A 404 means the part doesn't exist; any other error is an API/network failure.
const errorCode = computed(() => {
  const err = error.value as { statusCode?: number; status?: number } | null;
  return err?.statusCode ?? err?.status;
});
const isFetchError = computed(() => !pending.value && !!error.value && errorCode.value !== 404);
const isNotFound = computed(() => !pending.value && !part.value && !isFetchError.value);
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6">
    <!-- Back link — always visible -->
    <NuxtLink
      to="/"
      class="mb-8 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
    >
      <svg
        class="size-4"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back to catalog
    </NuxtLink>

    <!-- Loading skeleton -->
    <div v-if="pending" class="animate-pulse">
      <!-- Header skeleton -->
      <div class="mb-7">
        <div class="mb-3 flex gap-2">
          <div class="h-5 w-16 rounded-full bg-gray-200" />
          <div class="h-5 w-14 rounded-full bg-gray-200" />
          <div class="h-5 w-20 rounded-full bg-gray-200" />
        </div>
        <div class="h-8 w-2/3 rounded-lg bg-gray-200 sm:h-9" />
      </div>

      <!-- Body skeleton -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_320px]">
        <!-- Left: image + spec table -->
        <div>
          <div class="aspect-[4/3] rounded-xl bg-gray-200" />
          <div class="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div class="h-10 bg-gray-50" />
            <div v-for="n in 5" :key="n" class="h-12 border-t border-gray-100" />
          </div>
        </div>

        <!-- Right: purchase panel -->
        <div class="rounded-xl border border-gray-200 bg-white p-6">
          <div class="h-3 w-24 rounded bg-gray-200" />
          <div class="mt-1 h-2.5 w-16 rounded bg-gray-200" />
          <div class="mt-4 h-9 w-28 rounded bg-gray-200" />
          <div class="mt-1 h-3 w-20 rounded bg-gray-200" />
          <div class="mt-5 h-3 w-16 rounded bg-gray-200" />
          <div class="mt-1.5 h-10 rounded-lg bg-gray-200" />
          <div class="mt-3 h-10 rounded-lg bg-gray-100" />
          <div class="mt-4 h-12 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>

    <!-- API / network error -->
    <div
      v-else-if="isFetchError"
      class="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 py-20 text-center"
      role="alert"
    >
      <svg
        class="mb-4 size-12 text-red-300"
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
      <p class="text-base font-semibold text-red-700">Failed to load this part.</p>
      <p class="mt-1 text-sm text-red-500">Check your connection and try again.</p>
      <NuxtLink
        to="/"
        class="mt-6 inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        ← Back to catalog
      </NuxtLink>
    </div>

    <!-- Part not found (404) -->
    <div
      v-else-if="isNotFound"
      class="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-24 text-center"
      role="alert"
    >
      <svg
        class="mb-4 size-14 text-gray-300"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      </svg>
      <p class="text-base font-semibold text-gray-700">Part not found</p>
      <p class="mt-1 text-sm text-gray-400">
        No part with ID
        <span class="font-mono font-medium text-gray-600">{{ id }}</span>
        exists in the catalog.
      </p>
      <NuxtLink
        to="/"
        class="mt-6 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        ← Back to catalog
      </NuxtLink>
    </div>

    <!-- Part detail -->
    <article v-else-if="part">
      <!-- Header: name + status badges -->
      <header class="mb-7">
        <div class="mb-3 flex flex-wrap gap-2">
          <AppBadge variant="blue">{{ part.category }}</AppBadge>
          <AppBadge :variant="conditionVariant[part.condition]">
            {{ part.condition.charAt(0).toUpperCase() + part.condition.slice(1) }}
          </AppBadge>
          <AppBadge :variant="part.inStock ? 'success' : 'danger'">
            {{ part.inStock ? 'In Stock' : 'Out of Stock' }}
          </AppBadge>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">{{ part.name }}</h1>
      </header>

      <!-- Body: image + specs left, purchase panel right.
           On mobile the aside (order-1) appears above the image/specs (order-2)
           so the CTA is reachable without scrolling past a long spec table. -->
      <div
        class="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_320px]"
      >
        <!-- Left column: image + spec table — shown below purchase panel on mobile -->
        <div class="order-2 md:order-1">
          <div class="overflow-hidden rounded-xl bg-gray-50">
            <div class="aspect-[4/3] flex items-center justify-center p-8 sm:p-12">
              <img :src="part.image" :alt="part.name" class="h-full w-full object-contain" />
            </div>
          </div>

          <div class="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div class="border-b border-gray-100 px-5 py-3">
              <h2 class="text-xs font-bold uppercase tracking-widest text-gray-500">
                Part Specifications
              </h2>
            </div>
            <dl class="divide-y divide-gray-100">
              <div class="grid grid-cols-2 gap-4 px-5 py-3 text-sm sm:grid-cols-3">
                <dt class="font-medium text-gray-500">OEM Number</dt>
                <dd class="font-mono font-semibold text-gray-900 sm:col-span-2">{{ part.oem }}</dd>
              </div>
              <div class="grid grid-cols-2 gap-4 px-5 py-3 text-sm sm:grid-cols-3">
                <dt class="font-medium text-gray-500">Brand</dt>
                <dd class="font-semibold uppercase tracking-wider text-gray-900 sm:col-span-2">
                  {{ part.brand }}
                </dd>
              </div>
              <div class="grid grid-cols-2 gap-4 px-5 py-3 text-sm sm:grid-cols-3">
                <dt class="font-medium text-gray-500">Category</dt>
                <dd class="text-gray-900 sm:col-span-2">{{ part.category }}</dd>
              </div>
              <div class="grid grid-cols-2 gap-4 px-5 py-3 text-sm sm:grid-cols-3">
                <dt class="font-medium text-gray-500">Condition</dt>
                <dd class="capitalize text-gray-900 sm:col-span-2">{{ part.condition }}</dd>
              </div>
              <div class="grid grid-cols-2 gap-4 px-5 py-3 text-sm sm:grid-cols-3">
                <dt class="font-medium text-gray-500">Availability</dt>
                <dd
                  class="font-semibold sm:col-span-2"
                  :class="part.inStock ? 'text-green-600' : 'text-red-500'"
                >
                  {{ part.inStock ? 'In Stock' : 'Out of Stock' }}
                </dd>
              </div>
              <div v-if="part.colors?.length" class="grid grid-cols-2 gap-4 px-5 py-3 text-sm sm:grid-cols-3">
                <dt class="font-medium text-gray-500">Colours</dt>
                <dd class="flex flex-wrap gap-1 sm:col-span-2">
                  <span
                    v-for="colour in part.colors"
                    :key="colour"
                    class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-700"
                  >
                    {{ colour }}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Right column: purchase panel — shown first on mobile -->
        <aside class="order-1 md:order-2 md:sticky md:top-24 md:self-start">
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p class="font-mono text-xs text-gray-400">OEM {{ part.oem }}</p>
            <p class="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {{ part.brand }}
            </p>

            <p class="mt-4 text-3xl font-bold text-gray-900">€{{ part.price.toLocaleString() }}</p>
            <p class="mt-0.5 text-xs text-gray-500">per unit, excl. VAT</p>

            <!-- Colour selector — only for parts with colour options -->
            <div v-if="part.colors?.length" class="mt-5">
              <div class="mb-1.5 flex items-center justify-between">
                <label for="colour" class="text-sm font-medium text-gray-700">Colour</label>
                <span class="flex items-center gap-1.5">
                  <span
                    class="size-4 rounded-full border border-black/10 shadow-sm"
                    :style="{ background: swatchFor(selectedColor) }"
                    aria-hidden="true"
                  />
                  <span class="text-xs capitalize text-gray-500">{{ selectedColor }}</span>
                </span>
              </div>
              <select
                id="colour"
                v-model="selectedColor"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option v-for="colour in part.colors" :key="colour" :value="colour">
                  {{ colour.charAt(0).toUpperCase() + colour.slice(1) }}
                </option>
              </select>
            </div>

            <div class="mt-5">
              <label for="qty" class="mb-1.5 block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                id="qty"
                v-model.number="quantity"
                type="number"
                min="1"
                :disabled="!part.inStock"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div class="mt-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
              <span class="text-sm text-gray-500">Subtotal</span>
              <span class="text-sm font-semibold text-gray-900">
                €{{ (part.price * Math.max(1, quantity)).toLocaleString() }}
              </span>
            </div>

            <AppButton
              variant="primary"
              size="lg"
              class="mt-4 w-full"
              :disabled="!part.inStock"
              @click="addToQuote(part, quantity, selectedColor || undefined)"
            >
              {{ inQuote ? '✓ Added to Quote' : 'Add to Quote' }}
            </AppButton>

            <p v-if="!part.inStock" class="mt-3 text-center text-xs text-red-500">
              This part is currently not available.
            </p>
          </div>
        </aside>
      </div>
    </article>
  </div>
</template>
