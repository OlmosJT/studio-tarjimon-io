<script setup lang="ts">
import { ref, computed } from 'vue';
import { commentService } from '~/services/commentService';
import CommentItem from '~/components/comment/CommentItem.vue';
// 1. Import the composable to reuse data
import { useProjects } from '~/composables/useProjects';

definePageMeta({
  layout: 'dashboard'
});

// --- Data Fetching ---

// 2. OPTIMIZATION: Reuse Projects from the Layout cache
// Instead of fetching projects again, we grab the data that the Layout already loaded.
// This is instant because the Layout is parent to this page.
const { projects } = useProjects();

// 3. OPTIMIZATION: Lazy Load Comments
// We add { lazy: true }. This tells Nuxt:
// "Load the page and navigation IMMEDIATELY, show the skeleton, and populate data when ready."
const { data: comments, pending, error } = await useAsyncData('all-comments',
    () => commentService.getComments(),
    { lazy: true } // <--- This fixes the navigation lag
);

// --- Filter Logic ---
const selectedProject = ref<string>("");
const sortOrder = ref<string>("newest");

const filteredComments = computed(() => {
  // Guard clause: if comments aren't loaded yet, return empty
  if (!comments.value) return [];

  let result = [...comments.value];

  if (selectedProject.value) {
    result = result.filter(c => c.context.project_id === selectedProject.value);
  }

  result.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder.value === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return result;
});
</script>

<template>
  <div>

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Comments</h1>
        <p class="text-gray-500 text-sm mt-1">Engage with your readers and answer questions.</p>
      </div>

      <div class="flex gap-3">
        <select
            v-if="projects"
            v-model="selectedProject"
            class="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
        >
          <option value="">All Books</option>
          <option v-for="p in projects" :key="p.id" :value="p.id">
            {{ p.title }}
          </option>
        </select>

        <select
            v-model="sortOrder"
            class="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>

    <div v-if="pending" class="space-y-4">
      <div v-for="n in 3" :key="n" class="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
    </div>

    <div v-else-if="error" class="text-center py-10 text-red-500">
      Failed to load comments.
    </div>

    <div v-else class="space-y-4">
      <div v-if="filteredComments.length === 0" class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
        <p class="text-gray-500">No comments found matching your filters.</p>
      </div>

      <CommentItem
          v-for="comment in filteredComments"
          :key="comment.id"
          :comment="comment"
      />
    </div>

  </div>
</template>