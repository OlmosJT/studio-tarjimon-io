<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n'; // Import i18n
import { projectService } from '~/services/projectService';
import type { Chapter, ChapterStatus } from '~/services/projectService';

definePageMeta({
  layout: 'dashboard'
});

const { t } = useI18n(); // Get translation function
const route = useRoute();
const projectId = route.params.id as string;

// ... (Data Fetching & Computed Logic remains the same) ...
// --- Data Fetching ---
const { data: project, pending: projectPending } = await useAsyncData(`project-${projectId}`,
    () => projectService.getProjectById(projectId),
    { lazy: true }
);

const { data: chapters, refresh: refreshChapters, pending: chaptersPending } = await useAsyncData(`chapters-${projectId}`,
    () => projectService.getChapters(projectId),
    { lazy: true }
);

// --- Computed Logic ---
const nextSequence = computed(() => {
  if (!chapters.value || chapters.value.length === 0) return 1;
  const lastChapter = chapters.value[chapters.value.length - 1];
  return lastChapter.sequence_number + 1;
});

const canCreateChapter = computed(() => {
  if (!chapters.value || chapters.value.length === 0) return true;
  const lastChapter = chapters.value[chapters.value.length - 1];
  return ['COMPLETED', 'PUBLISHED'].includes(lastChapter.status);
});

// Dynamic Background for Hero
const headerStyle = computed(() => {
  if (project.value?.cover_image_url) {
    return { backgroundImage: `url(${project.value.cover_image_url})` };
  }
  return {};
});

// --- Actions ---
const showCreateModal = ref(false);
const isCreating = ref(false);
const updatingChapterId = ref<string | null>(null);
const newChapterForm = ref({ title: '', subtitle: '' });

function openCreateModal() {
  if (!canCreateChapter.value) return;
  newChapterForm.value = { title: '', subtitle: '' };
  showCreateModal.value = true;
}

async function handleCreateChapter() {
  if (!newChapterForm.value.title) return;
  isCreating.value = true;
  try {
    await projectService.createChapter({
      projectId,
      title: newChapterForm.value.title,
      sequence: nextSequence.value
    });
    await refreshChapters();
    showCreateModal.value = false;
  } catch (e) {
    alert("Error creating chapter");
  } finally {
    isCreating.value = false;
  }
}

async function changeStatus(chapter: Chapter, newStatus: ChapterStatus) {
  updatingChapterId.value = chapter.id;
  try {
    await projectService.updateChapterStatus(chapter.id, newStatus);
    await refreshChapters();
  } catch (e) {
    alert("Failed to update status");
  } finally {
    updatingChapterId.value = null;
  }
}

// --- Visual Helpers (Updated for Localization) ---
function getStatusConfig(status: string) {
  switch (status) {
    case 'PUBLISHED':
      return { label: t('project_detail.status.published'), classes: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' };
    case 'COMPLETED':
      return { label: t('project_detail.status.completed'), classes: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' };
    default:
      return { label: t('project_detail.status.draft'), classes: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' };
  }
}
</script>

<template>
  <div v-if="project" class="pb-20">

    <div
        class="relative w-full h-72 md:h-96 bg-cover bg-center bg-gray-900"
        :class="{ 'bg-gradient-to-r from-gray-900 to-gray-800': !project.cover_image_url }"
        :style="headerStyle"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <NuxtLink
          to="/dashboard"
          class="absolute top-6 left-6 z-20 group flex items-center gap-2 pl-3 pr-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all duration-200 text-white/90 hover:text-white"
      >
        <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span class="text-sm font-medium">{{ $t('project_detail.back_to_projects') }}</span>
      </NuxtLink>

      <div class="absolute bottom-0 left-0 w-full p-6 md:p-10 z-10">
        <div class="max-w-6xl mx-auto flex items-end gap-8">
          <div class="hidden md:block w-40 h-60 rounded-lg shadow-2xl overflow-hidden border-4 border-white/10">
            <img
                v-if="project.cover_image_url"
                :src="project.cover_image_url"
                class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-gray-800 flex items-center justify-center text-white/20 text-4xl font-bold">
              {{ project.title.charAt(0) }}
            </div>
          </div>

          <div class="flex-1 mb-2">
            <div class="flex flex-wrap items-center gap-3 mb-3">
              <span class="px-2.5 py-1 text-xs font-bold bg-white text-gray-900 rounded shadow-sm uppercase tracking-wide">
                {{ project.project_type }}
              </span>
              <div class="flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur rounded-full border border-white/10 text-xs font-medium text-white">
                <span class="uppercase">{{ project.original_language }}</span>
                <svg class="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                <span class="uppercase text-green-400">{{ project.target_language }}</span>
              </div>
            </div>

            <h1 class="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
              {{ project.title }}
            </h1>

            <div class="flex items-center gap-2 text-lg text-white/80 font-medium">
              <span class="text-gray-400">By</span>
              <span class="text-white">{{ project.original_author_name || 'Unknown Author' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

      <div class="lg:col-span-2 space-y-6">

        <div class="flex flex-wrap justify-between items-center gap-4 p-1">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {{ $t('project_detail.chapters') }}
            <span class="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {{ chapters?.length || 0 }}
            </span>
          </h2>

          <button
              @click="openCreateModal"
              :disabled="!canCreateChapter"
              class="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all shadow-sm border"
              :class="canCreateChapter
              ? 'bg-black text-white border-black hover:bg-gray-800 hover:shadow-md'
              : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'"
          >
            <span v-if="!canCreateChapter">🔒</span>
            <span v-else>+</span>
            {{ $t('project_detail.new_chapter') }} {{ nextSequence }}
          </button>
        </div>

        <transition name="fade">
          <div v-if="!canCreateChapter" class="flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800">
            <svg class="w-5 h-5 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="font-bold">{{ $t('project_detail.locked_alert.title') }}</p>
              <p class="opacity-90">{{ $t('project_detail.locked_alert.message') }}</p>
            </div>
          </div>
        </transition>

        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div v-if="!chapters || chapters.length === 0" class="p-10 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📝</div>
            <h3 class="text-lg font-bold text-gray-900">{{ $t('project_detail.no_chapters') }}</h3>
            <p class="text-gray-500 mt-1">{{ $t('project_detail.no_chapters_desc') }}</p>
          </div>

          <div
              v-else
              v-for="chapter in chapters"
              :key="chapter.id"
              class="group p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 font-bold flex items-center justify-center flex-shrink-0">
                {{ chapter.sequence_number }}
              </div>
              <div>
                <h3 class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {{ chapter.title }}
                </h3>
                <p v-if="chapter.subtitle" class="text-sm text-gray-500 mt-0.5">
                  {{ chapter.subtitle }}
                </p>
                <div class="mt-2 sm:hidden">
                   <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border" :class="getStatusConfig(chapter.status).classes">
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusConfig(chapter.status).dot"></span>
                    {{ getStatusConfig(chapter.status).label }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4 self-end sm:self-auto">

              <span class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border" :class="getStatusConfig(chapter.status).classes">
                <span class="w-1.5 h-1.5 rounded-full" :class="getStatusConfig(chapter.status).dot"></span>
                {{ getStatusConfig(chapter.status).label }}
              </span>

              <div class="h-4 w-px bg-gray-300 hidden sm:block"></div>

              <div class="flex items-center gap-2">

                <button
                    v-if="chapter.status === 'DRAFT'"
                    @click="changeStatus(chapter, 'COMPLETED')"
                    :disabled="updatingChapterId === chapter.id"
                    class="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all flex items-center gap-2"
                >
                  <span v-if="updatingChapterId === chapter.id" class="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
                  <span v-else>{{ $t('project_detail.status.mark_done') }}</span>
                </button>

                <button
                    v-else-if="chapter.status === 'COMPLETED'"
                    @click="changeStatus(chapter, 'PUBLISHED')"
                    :disabled="updatingChapterId === chapter.id"
                    class="px-3 py-1.5 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-md transition-all flex items-center gap-2"
                >
                  <span v-if="updatingChapterId === chapter.id" class="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
                  <span v-else>{{ $t('project_detail.status.publish') }}</span>
                </button>

                <a
                    :href="chapter.google_doc_url"
                    target="_blank"
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Open in Google Docs"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-6">
          <h3 class="font-bold text-gray-900 mb-4 border-b pb-2">{{ $t('project_detail.about.title') }}</h3>

          <div class="mb-6">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{{ $t('project_detail.about.description') }}</h4>
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ project.description || $t('project_detail.about.no_desc') }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{{ $t('project_detail.about.author') }}</h4>
              <p class="text-sm font-medium text-gray-900">{{ project.original_author_name || 'Unknown' }}</p>
            </div>
            <div>
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{{ $t('project_detail.about.language') }}</h4>
              <div class="flex items-center gap-1 text-sm font-medium text-gray-900">
                <span class="uppercase">{{ project.original_language }}</span>
                <span class="text-gray-400">&rarr;</span>
                <span class="uppercase">{{ project.target_language }}</span>
              </div>
            </div>
            <div>
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{{ $t('project_detail.about.created') }}</h4>
              <p class="text-sm font-medium text-gray-900">{{ new Date(project.created_at).toLocaleDateString() }}</p>
            </div>
            <div>
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{{ $t('project_detail.about.status') }}</h4>
              <p class="text-sm font-medium capitalize" :class="{
                'text-green-600': project.status === 'COMPLETED',
                'text-blue-600': project.status === 'ONGOING'
              }">{{ project.status.toLowerCase() }}</p>
            </div>
          </div>

          <div v-if="project.tags && project.tags.length > 0">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{{ $t('project_detail.about.tags') }}</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in project.tags" :key="tag" class="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors cursor-default">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="font-bold text-lg text-gray-900">{{ $t('project_detail.modal.title') }} {{ nextSequence }}</h3>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div class="bg-blue-50 text-blue-700 text-sm p-3 rounded-lg flex gap-2">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>{{ $t('project_detail.modal.info') }}</p>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">{{ $t('project_detail.modal.label_title') }} <span class="text-red-500">*</span></label>
            <input v-model="newChapterForm.title" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black transition-shadow" :placeholder="$t('project_detail.modal.placeholder_title')" @keydown.enter="handleCreateChapter" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">{{ $t('project_detail.modal.label_subtitle') }} <span class="text-gray-400 font-normal">({{ $t('common.optional') }})</span></label>
            <input v-model="newChapterForm.subtitle" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black transition-shadow" :placeholder="$t('project_detail.modal.placeholder_subtitle')" />
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button @click="showCreateModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">{{ $t('project_detail.modal.cancel') }}</button>
          <button @click="handleCreateChapter" :disabled="isCreating || !newChapterForm.title" class="px-4 py-2 text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm">
            <svg v-if="isCreating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ isCreating ? $t('project_detail.modal.creating_btn') : $t('project_detail.modal.create_btn') }}
          </button>
        </div>
      </div>
    </div>

  </div>

  <div v-else class="pb-20 animate-pulse">
    <div class="w-full h-72 md:h-96 bg-gray-200"></div>
    <div class="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div class="lg:col-span-2 space-y-6">
        <div class="flex justify-between">
          <div class="h-8 w-32 bg-gray-200 rounded"></div>
          <div class="h-10 w-40 bg-gray-200 rounded"></div>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl h-96"></div>
      </div>
      <div class="space-y-6">
        <div class="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  </div>
</template>