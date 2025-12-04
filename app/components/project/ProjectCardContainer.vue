<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="mb-10">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
      <p v-if="subtitle" class="text-gray-500 mt-1 text-sm">
        {{ subtitle }}
      </p>
    </div>

    <div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
      <slot />
    </div>
  </div>
</template>