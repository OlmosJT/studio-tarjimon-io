<script setup lang="ts">
import { ref, computed } from 'vue';
import { commentService } from '~/services/commentService';
import type { Comment } from '~/services/commentService';

const props = defineProps<{
  comment: Comment;
}>();

// Format Date
const formattedDate = computed(() => {
  return new Date(props.comment.created_at).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
});

// Spoiler Logic
const showSpoiler = ref(!props.comment.is_spoiler); // If not spoiler, show by default

// Reply Logic
const isReplying = ref(false);
const replyText = ref("");
const isSubmitting = ref(false);

async function submitReply() {
  if (!replyText.value.trim()) return;

  isSubmitting.value = true;
  try {
    // Pass the entire comment object so the service knows the ID and context
    await commentService.replyToComment(props.comment, replyText.value);
    replyText.value = "";
    isReplying.value = false;
  } catch (e) {
    alert("Failed to post reply");
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">

    <div class="flex justify-between items-start mb-3">
      <div class="flex items-center gap-3">
        <img :src="comment.author.avatar_url" class="w-10 h-10 rounded-full border border-gray-100 object-cover" />
        <div>
          <h4 class="font-bold text-gray-900 text-sm">{{ comment.author.username }}</h4>
          <p class="text-xs text-gray-500">{{ formattedDate }}</p>
        </div>
      </div>

      <div class="text-right hidden sm:block">
        <div class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
          {{ comment.context.project_title }}
        </div>
        <div class="text-xs text-gray-400 mt-1">
          {{ comment.context.chapter_title }}
        </div>
      </div>
    </div>

    <div class="mb-4">
      <div v-if="comment.is_spoiler && !showSpoiler" class="bg-gray-100 p-3 rounded text-center cursor-pointer hover:bg-gray-200 transition-colors" @click="showSpoiler = true">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Spoiler Alert</span>
        <p class="text-xs text-gray-400">Click to reveal</p>
      </div>
      <p v-else class="text-gray-700 text-sm leading-relaxed">
        {{ comment.content }}
      </p>
    </div>

    <div class="flex items-center gap-4 border-t border-gray-50 pt-3">
      <button
          @click="isReplying = !isReplying"
          class="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
        {{ isReplying ? 'Cancel Reply' : 'Reply' }}
      </button>
    </div>

    <div v-if="isReplying" class="mt-4 pl-4 border-l-2 border-gray-100">
      <textarea
          v-model="replyText"
          rows="3"
          placeholder="Write your reply..."
          class="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-50 focus:bg-white"
      ></textarea>
      <div class="flex justify-end mt-2">
        <button
            @click="submitReply"
            :disabled="isSubmitting || !replyText"
            class="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {{ isSubmitting ? 'Posting...' : 'Post Reply' }}
        </button>
      </div>
    </div>

    <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 pl-6 border-l-2 border-gray-100 space-y-4">
      <div v-for="reply in comment.replies" :key="reply.id" class="bg-gray-50 p-3 rounded-lg">
        <div class="flex items-center gap-2 mb-2">
          <img :src="reply.author.avatar_url" class="w-6 h-6 rounded-full object-cover" />
          <span class="font-bold text-xs">{{ reply.author.username }}</span>
          <span class="text-xs text-gray-400">• {{ new Date(reply.created_at).toLocaleDateString() }}</span>
        </div>
        <p class="text-xs text-gray-700">{{ reply.content }}</p>
      </div>
    </div>

  </div>
</template>