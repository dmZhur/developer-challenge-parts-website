<script setup lang="ts">
import type { QuoteItem } from '~/types';

defineProps<{ item: QuoteItem }>();
const { removeFromQuote, updateQuantity } = useQuote();
</script>

<template>
  <div class="flex items-start gap-3 py-3.5">
    <!-- Thumbnail -->
    <img
      :src="item.part.image"
      :alt="item.part.name"
      class="size-12 shrink-0 rounded-lg border border-gray-100 bg-gray-50 object-contain p-1"
    />

    <!-- Info + controls -->
    <div class="min-w-0 flex-1">
      <p class="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
        {{ item.part.name }}
      </p>
      <p class="mt-0.5 font-mono text-[11px] text-gray-400">{{ item.part.oem }}</p>

      <!-- Colour indicator — only shown when a colour was selected -->
      <p v-if="item.color" class="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500">
        <span
          class="size-2 shrink-0 rounded-full border border-black/10"
          :style="{ background: swatchFor(item.color) }"
          aria-hidden="true"
        />
        <span class="capitalize">{{ item.color }}</span>
      </p>

      <!--
        Quantity stepper + price.
        flex-wrap lets the price row fall to a second line on very narrow screens
        rather than overflowing.
      -->
      <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <!-- Stepper — size-8 (32 px) for comfortable touch targets -->
        <div class="flex items-center overflow-hidden rounded-md border border-gray-200">
          <button
            class="flex size-8 cursor-pointer items-center justify-center text-gray-500 hover:bg-gray-50"
            aria-label="Decrease quantity"
            @click="updateQuantity(item.part.id, item.quantity - 1, item.color)"
          >
            −
          </button>
          <span class="w-8 text-center text-sm font-semibold text-gray-900">
            {{ item.quantity }}
          </span>
          <button
            class="flex size-8 cursor-pointer items-center justify-center text-gray-500 hover:bg-gray-50"
            aria-label="Increase quantity"
            @click="updateQuantity(item.part.id, item.quantity + 1, item.color)"
          >
            +
          </button>
        </div>

        <!-- Subtotal + unit hint -->
        <div>
          <span class="text-sm font-bold text-gray-900">
            €{{ (item.part.price * item.quantity).toLocaleString() }}
          </span>
          <span class="ml-1.5 text-[11px] text-gray-400">
            €{{ item.part.price.toLocaleString() }} ea
          </span>
        </div>
      </div>
    </div>

    <!-- Remove -->
    <button
      class="shrink-0 cursor-pointer rounded p-1 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
      aria-label="Remove from quote"
      @click="removeFromQuote(item.part.id, item.color)"
    >
      <svg
        class="size-4"
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
</template>
