<script setup lang="ts">
interface Props {
  variant?: 'default' | 'blue' | 'success' | 'warning' | 'danger';
}

withDefaults(defineProps<Props>(), { variant: 'default' });
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      {
        'bg-gray-100 text-gray-700': variant === 'default',
        'bg-blue-100 text-blue-700': variant === 'blue',
        'bg-green-100 text-green-700': variant === 'success',
        'bg-yellow-100 text-yellow-700': variant === 'warning',
        'bg-red-100 text-red-700': variant === 'danger',
      },
    ]"
  >
    <slot />
  </span>
</template>
