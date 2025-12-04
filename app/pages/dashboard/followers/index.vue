<script setup lang="ts">
import { computed } from 'vue';
import { followerService } from '~/services/followerService';
import FollowerCard from '~/components/follower/FollowerCard.vue';

definePageMeta({
  layout: 'dashboard'
});

// --- Data Fetching ---
const { data: followers, pending, error } = await useAsyncData('followers-list',
    () => followerService.getFollowers(),
    { lazy: true } // Instant navigation
);

// --- Computed Sections ---
const translators = computed(() =>
    followers.value?.filter(f => f.role === 'TRANSLATOR') || []
);

const readers = computed(() =>
    followers.value?.filter(f => f.role === 'READER') || []
);

// --- Actions ---
async function toggleFollowStatus(id: string, stopLoadingCallback: () => void) {
  try {
    // 1. Call API
    await followerService.toggleFollow(id);

    // 2. Optimistic Update (Update local state without full refresh)
    // Since 'followers' is a Ref, we can mutate it directly to reflect the change instantly
    const target = followers.value?.find(f => f.id === id);
    if (target) {
      target.isFollowing = !target.isFollowing;
    }
  } catch (e) {
    alert("Action failed");
  } finally {
    stopLoadingCallback(); // Stop the spinner on the card
  }
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Followers</h1>
      <p class="text-gray-500 text-sm mt-1">Manage your community and connections.</p>
    </div>

    <div v-if="pending" class="space-y-8">
      <div class="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 3" :key="n" class="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-10 text-red-500">
      Unable to load followers.
    </div>

    <div v-else class="space-y-10">

      <section>
        <div class="flex items-center gap-2 mb-4">
          <h2 class="text-lg font-bold text-gray-800">Translators</h2>
          <span class="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {{ translators.length }}
          </span>
        </div>

        <div v-if="translators.length === 0" class="text-gray-400 text-sm italic">
          No translators are following you yet.
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <FollowerCard
              v-for="user in translators"
              :key="user.id"
              :follower="user"
              @toggle="toggleFollowStatus"
          />
        </div>
      </section>

      <section>
        <div class="flex items-center gap-2 mb-4">
          <h2 class="text-lg font-bold text-gray-800">Readers</h2>
          <span class="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {{ readers.length }}
          </span>
        </div>

        <div v-if="readers.length === 0" class="text-gray-400 text-sm italic">
          No readers found.
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <FollowerCard
              v-for="user in readers"
              :key="user.id"
              :follower="user"
              @toggle="toggleFollowStatus"
          />
        </div>
      </section>

    </div>
  </div>
</template>