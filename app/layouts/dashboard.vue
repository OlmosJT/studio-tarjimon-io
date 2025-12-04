<script setup lang="ts">

import { ref } from "vue";
import DashboardHeader from "~/components/header/DashboardHeader.vue";
import DashboardNav from "~/components/nav/DashboardNav.vue";
import AppAlert from "~/components/common/AppAlert.vue";

// const { isLimitReached, MAX_PROJECTS } = useProjects(); -> Nuxt auto-imports this!

// --- Header Data ---
const translatorName = ref("Olmos Davronov");
const avatar = ref("/avatar_male_default.png");

const { isLimitReached, MAX_PROJECTS } = useProjects();

const disabledNavigation = computed(() => {
  return isLimitReached.value ? ['/dashboard/create'] : [];
});

</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">

    <DashboardHeader
        :translator-name="translatorName"
        :profile-image="avatar"
    />

    <DashboardNav
        :disabled-paths="disabledNavigation"
    />

    <main class="flex-1 p-6 w-full">

      <transition name="fade">
        <AppAlert
            v-if="isLimitReached"
            type="warning"
            :title="$t('dashboard.active.limit_reached')"
        >
          {{ $t('dashboard.active.limit_alert_message', { count: MAX_PROJECTS }) }}
        </AppAlert>
      </transition>

      <slot />
    </main>

  </div>
</template>

<style scoped>
/* Styles remain the same */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>