<script setup lang="ts">
import { ref } from 'vue';
import type { Follower } from '~/services/followerService';

const props = defineProps<{
  follower: Follower;
}>();

const emit = defineEmits(['toggle']);

const isLoading = ref(false);

function handleToggle() {
  isLoading.value = true;
  // Emit event to parent to handle API call
  emit('toggle', props.follower.id, () => {
    isLoading.value = false; // Callback to stop loading
  });
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">

    <img
        :src="follower.avatar"
        alt="Avatar"
        class="w-14 h-14 rounded-full object-cover border border-gray-100"
    />

    <div class="flex-1 min-w-0">
      <h3 class="font-bold text-gray-900 truncate">{{ follower.name }}</h3>

      <p class="text-xs text-gray-500 flex items-center gap-1">
        <span v-if="follower.role === 'TRANSLATOR'" class="text-blue-600 font-medium">Translator</span>
        <span v-else class="text-green-600 font-medium">Reader</span>

        <span class="text-gray-300">|</span>

        <span v-if="follower.role === 'TRANSLATOR'">{{ follower.stats.projects_count }} Projects</span>
        <span v-else>{{ follower.stats.reading_list_count }} Books read</span>
      </p>
    </div>

    <button
        @click="handleToggle"
        :disabled="isLoading"
        class="px-4 py-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center min-w-[90px]"
        :class="follower.isFollowing
        ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-red-600 hover:border-red-200'
        : 'bg-black text-white border-black hover:bg-gray-800'"
    >
      <span v-if="isLoading" class="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full mr-1"></span>
      <span>{{ follower.isFollowing ? 'Following' : 'Follow' }}</span>
    </button>

  </div>
</template>