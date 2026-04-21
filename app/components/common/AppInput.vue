<script setup lang="ts">
interface Props {
  modelValue?: string;
  placeholder?: string;
  label?: string;
  icon?: boolean;
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  icon: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const hasValue = computed(() => Boolean(props.modelValue));
</script>

<template>
  <div>
    <label v-if="label" class="mb-1 block text-sm font-medium text-gray-700">
      {{ label }}
    </label>

    <div class="relative">
      <!-- Search icon (left) -->
      <div
        v-if="icon"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <!-- Input -->
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :class="[
          'w-full rounded-lg border border-gray-300 bg-white py-2 text-sm text-gray-900 placeholder-gray-400',
          'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
          icon ? 'pl-9' : 'pl-3',
          hasValue ? 'pr-8' : 'pr-3',
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <!-- Clear button (right) — only when there is text -->
      <Transition name="fade">
        <button
          v-if="hasValue"
          type="button"
          class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Clear"
          @click="emit('update:modelValue', '')"
        >
          <svg
            class="size-3.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
