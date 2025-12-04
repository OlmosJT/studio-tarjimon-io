<script setup lang="ts">
import ProjectCard from "~/components/project/ProjectCard.vue";
import ProjectCardContainer from "~/components/project/ProjectCardContainer.vue";

definePageMeta({
  layout: 'dashboard'
});


const {
  activeProjects,
  completedProjects,
  otherProjects,
  pending,
  error,
  isLimitReached
} = useProjects();

</script>

<template>
  <div>

    <div v-if="pending" class="mb-10">
      <div class="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
      <div class="text-gray-400">{{ $t('dashboard.loading') }}</div>
    </div>

    <div v-else-if="error" class="text-center py-10 text-red-500">
      {{ $t('dashboard.error') }}
    </div>

    <div v-else>

      <ProjectCardContainer
          :title="$t('dashboard.active.title')"
          :subtitle="$t('dashboard.active.subtitle')"
      >
        <ProjectCard
            v-for="project in activeProjects"
            :key="project.id"
            :id="project.id"
            :title="project.title"
            :status="project.status"
            :updated-at="project.updated_at"
            :book-cover-url="project.cover_image_url"
            :total-chapters="project.total_chapters"
        />

        <NuxtLink
            v-if="!isLimitReached"
            to="/dashboard/create"
            class="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer min-h-[300px] h-full"
        >
          <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <span class="text-2xl">+</span>
          </div>
          <span class="font-medium">{{ $t('dashboard.active.create') }}</span>
        </NuxtLink>

        <div
            v-else
            class="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 text-gray-300 min-h-[300px] h-full cursor-not-allowed"
        >
          <span class="font-medium">{{ $t('dashboard.active.limit_reached') }}</span>
        </div>
      </ProjectCardContainer>

      <ProjectCardContainer
          v-if="completedProjects.length > 0"
          :title="$t('dashboard.completed.title')"
          :subtitle="$t('dashboard.completed.subtitle')"
      >
        <ProjectCard
            v-for="project in completedProjects"
            :key="project.id"
            :id="project.id"
            :title="project.title"
            :status="project.status"
            :updated-at="project.updated_at"
            :book-cover-url="project.cover_image_url"
            :total-chapters="project.total_chapters"
        />
      </ProjectCardContainer>

      <ProjectCardContainer
          v-if="otherProjects.length > 0"
          :title="$t('dashboard.other.title')"
          :subtitle="$t('dashboard.other.subtitle')"
      >
        <ProjectCard
            v-for="project in otherProjects"
            :key="project.id"
            :id="project.id"
            :title="project.title"
            :status="project.status"
            :updated-at="project.updated_at"
            :book-cover-url="project.cover_image_url"
            :total-chapters="project.total_chapters"
        />
      </ProjectCardContainer>

    </div>
  </div>
</template>