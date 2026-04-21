<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="border-t border-gray-200 bg-white">
    <div
      class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-6 lg:px-8"
    >
      <div class="flex items-center gap-2 text-xs text-gray-400">
        <span class="font-semibold text-gray-500">PartsFinder</span>
        <span class="text-gray-300">·</span>
        <span>© {{ year }} All rights reserved</span>
      </div>

      <div class="flex items-center gap-4 text-xs text-gray-400">
        <span
          class="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 font-medium text-gray-500"
        >
          B2B Professional Use Only
        </span>
      </div>
    </div>
  </footer>
</template>
