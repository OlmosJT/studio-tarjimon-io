<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  id: string;
  title: string;
  status: string; // 'ONGOING' | 'COMPLETED' | etc.
  updatedAt: string; // ISO String from DB
  coverUrl?: string; // Nullable
  totalChapters: number;
}>();

const badgeClass = computed(() => {
  const s = props.status.toUpperCase();
  if (s === 'COMPLETED') {
    return 'bg-green-100 text-green-800 border-green-200';
  }
  if (s === 'ONGOING') {
    return 'bg-blue-50 text-blue-700 border-blue-200';
  }
  return 'bg-gray-100 text-gray-600 border-gray-200'; // Fallback for DROPPED/HIATUS
});

const formattedStatus = computed(() => {
  // Converts "ONGOING" -> "Ongoing"
  return props.status.charAt(0).toUpperCase() + props.status.slice(1).toLowerCase();
});

const formattedDate = computed(() => {
  const date = new Date(props.updatedAt);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
});

const displayImage = computed(() => {
  return props.coverUrl || '/images/book-placeholder.png'; // Make sure you have a placeholder in public/images
});

</script>

<template>
  <NuxtLink
      :to="`/dashboard/projects/${id}`"
      class="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer min-w-0"
  >

    <div class="relative w-full aspect-[2/1] sm:aspect-[3/2] overflow-hidden bg-gray-100">
      <img
          :src="displayImage"
          :alt="title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>

    <div class="p-5 flex flex-col flex-1">
      <div class="flex justify-between items-start mb-3">
        <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
            :class="badgeClass"
        >
          {{ formattedStatus }}
        </span>

        <span class="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
          {{ totalChapters }} ch.
        </span>
      </div>

      <h3 class="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
        {{ title }}
      </h3>

      <div class="mt-auto flex items-center text-sm text-gray-500 pt-4 border-t border-gray-50">
        <svg class="mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Updated {{ formattedDate }}</span>
      </div>

    </div>
  </NuxtLink>
</template>

<style scoped>
/* line-clamp-2 ensures the title doesn't take up more than 2 lines */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>