<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  // 'warning', 'error', 'success', 'info'
  type: {
    type: String,
    default: 'warning'
  },
  title: {
    type: String,
    default: ''
  }
});

// dynamic classes based on the type
const colorClasses = computed(() => {
  switch (props.type) {
    case 'error':
      return 'bg-red-50 text-red-800 border-red-500';
    case 'success':
      return 'bg-green-50 text-green-800 border-green-500';
    case 'info':
      return 'bg-blue-50 text-blue-800 border-blue-500';
    case 'warning':
    default:
      return 'bg-yellow-50 text-yellow-800 border-yellow-500';
  }
});
</script>

<template>
  <div
      class="flex items-start p-4 mb-6 border-l-4 rounded-r-md shadow-sm"
      :class="colorClasses"
      role="alert"
  >
    <div class="flex-shrink-0 mr-3">
      <svg v-if="type === 'warning'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <svg v-else-if="type === 'error'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <svg v-else-if="type === 'success'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>

    <div>
      <h3 v-if="title" class="font-bold text-sm mb-1">
        {{ title }}
      </h3>
      <div class="text-sm opacity-90">
        <slot />
      </div>
    </div>
  </div>
</template>