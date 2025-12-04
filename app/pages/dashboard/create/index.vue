<script setup lang="ts">
import { ref, reactive } from 'vue';

definePageMeta({
  layout: 'dashboard'
});

const router = useRouter();

// --- 1. Form State ---
const form = reactive({
  title: '',
  originalAuthor: '',
  originalLanguage: '',
  targetLanguage: 'UZ',
  description: '',
  authorDescription: '',
  projectType: 'BOOK',
  genre: '',
  tags: [] as string[],
  totalChapters: null as number | null,
  coverImage: null as File | null
});

// --- 2. Options ---
const projectTypes = [
  { label: 'Book (Generic)', value: 'BOOK' },
  { label: 'Novel', value: 'NOVEL' },
  { label: 'Short Stories', value: 'STORIES' },
  { label: 'Technical Book', value: 'TECHNICAL' },
];

const languages = [
  { label: 'Uzbek', value: 'UZ' },
  { label: 'English', value: 'EN' },
  { label: 'Russian', value: 'RU' },
  { label: 'Korean', value: 'KO' },
  { label: 'Chinese', value: 'ZH' },
  { label: 'Japanese', value: 'JA' },
];

// --- 3. Tag Logic ---
const tagInput = ref('');

function addTag() {
  const val = tagInput.value.trim();
  if (val && !form.tags.includes(val)) {
    form.tags.push(val);
  }
  tagInput.value = '';
}

function removeTag(index: number) {
  form.tags.splice(index, 1);
}

// --- 4. Image Upload Logic ---
const previewUrl = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null); // Reference to the HTML Input

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    form.coverImage = file;
    previewUrl.value = URL.createObjectURL(file);
  }
}

// NEW: Logic to remove the image
function removeImage() {
  form.coverImage = null;
  previewUrl.value = null;

  // Important: We must reset the file input so the 'change' event
  // fires again if the user tries to upload the exact same file later.
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
}

// --- 5. Submit Logic ---
const isSubmitting = ref(false);

async function handleSubmit() {
  isSubmitting.value = true;
  console.log("Submitting Payload:", form);

  setTimeout(() => {
    isSubmitting.value = false;
    router.push('/dashboard');
  }, 1000);
}
</script>

<template>
  <div class="max-w-4xl mx-auto">

    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Create New Project</h1>
      <p class="text-gray-500 text-sm mt-1">Fill in the details to start translating a new book.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      <div class="p-8 space-y-8">

        <section class="space-y-6">
          <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="col-span-full">
              <label class="block text-sm font-medium text-gray-700 mb-1">Project Title <span class="text-red-500">*</span></label>
              <input v-model="form.title" type="text" required placeholder="e.g. The King's Avatar" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Original Author <span class="text-red-500">*</span></label>
              <input v-model="form.originalAuthor" type="text" required placeholder="e.g. Butterfly Blue" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Total Chapters <span class="text-gray-400 font-normal">(Optional)</span></label>
              <input v-model="form.totalChapters" type="number" min="0" placeholder="0" class="input-field" />
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Original Language <span class="text-red-500">*</span></label>
              <select v-model="form.originalLanguage" required class="input-field">
                <option value="" disabled>Select Language</option>
                <option v-for="lang in languages" :key="lang.value" :value="lang.value">{{ lang.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Target Language <span class="text-red-500">*</span></label>
              <select v-model="form.targetLanguage" required class="input-field">
                <option v-for="lang in languages" :key="lang.value" :value="lang.value">{{ lang.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Project Type <span class="text-red-500">*</span></label>
              <select v-model="form.projectType" required class="input-field">
                <option v-for="type in projectTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
              </select>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">Story Details</h2>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Book Description <span class="text-red-500">*</span></label>
            <textarea v-model="form.description" required rows="4" placeholder="Enter a summary of the plot..." class="input-field resize-none"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Author Description <span class="text-gray-400 font-normal">(Optional)</span></label>
            <textarea v-model="form.authorDescription" rows="2" placeholder="Brief info about the original author..." class="input-field resize-none"></textarea>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Genre <span class="text-red-500">*</span></label>
              <input v-model="form.genre" type="text" required placeholder="e.g. Fantasy, Sci-Fi" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tags <span class="text-gray-400 font-normal">(Press Enter to add)</span></label>
              <div class="input-field-container flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-gray-50">
                <span v-for="(tag, index) in form.tags" :key="index" class="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                  {{ tag }}
                  <button type="button" @click="removeTag(index)" class="hover:text-blue-900">×</button>
                </span>
                <input v-model="tagInput" @keydown.enter.prevent="addTag" type="text" class="flex-1 bg-transparent outline-none min-w-[80px] text-sm" placeholder="Add tag..." />
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">Visuals</h2>

          <div class="flex items-start gap-6">
            <div
                class="w-32 h-48 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0 relative group"
            >
              <template v-if="previewUrl">
                <img :src="previewUrl" class="w-full h-full object-cover" />

                <button
                    type="button"
                    @click="removeImage"
                    class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove image"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </template>

              <span v-else class="text-gray-400 text-xs text-center px-2">No Cover</span>
            </div>

            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer relative">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600 justify-center">
                    <span class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                    </span>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
                <input
                    ref="fileInputRef"
                    type="file"
                    @change="handleFileChange"
                    accept="image/*"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </section>

      </div>

      <div class="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
        <NuxtLink to="/dashboard" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          Cancel
        </NuxtLink>
        <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? 'Creating Project...' : 'Create Project' }}
        </button>
      </div>

    </form>
  </div>
</template>

<style scoped>
.input-field {
  @apply w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200;
}
</style>