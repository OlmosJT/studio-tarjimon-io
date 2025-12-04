<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { userService } from '~/services/userService';
import type { UserProfile } from '~/services/userService';

definePageMeta({
  layout: 'dashboard'
});

// --- State ---
const activeTab = ref<'profile' | 'account'>('profile');
const isLoading = ref(true);
const isSaving = ref(false);
const successMessage = ref('');

// Form Data
const profileForm = reactive({
  displayName: '',
  bio: '',
  email: '', // Read-only usually
  avatarUrl: ''
});

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
});

// --- Initialization ---
onMounted(async () => {
  try {
    const data = await userService.getProfile();
    // Populate form
    profileForm.displayName = data.displayName;
    profileForm.bio = data.bio;
    profileForm.email = data.email;
    profileForm.avatarUrl = data.avatarUrl;
  } catch (e) {
    console.error("Failed to load profile");
  } finally {
    isLoading.value = false;
  }
});

// --- Actions ---

// 1. Image Upload Logic (Mock)
const fileInput = ref<HTMLInputElement | null>(null);
function triggerFileInput() {
  fileInput.value?.click();
}
function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    // Create a local preview URL
    profileForm.avatarUrl = URL.createObjectURL(file);
    // In a real app, you would upload 'file' to S3/Cloudinary here
  }
}

// 2. Save Profile
async function saveProfile() {
  isSaving.value = true;
  successMessage.value = '';

  try {
    await userService.updateProfile({
      displayName: profileForm.displayName,
      bio: profileForm.bio,
      avatarUrl: profileForm.avatarUrl
    });

    // Show success feedback
    successMessage.value = 'Profile updated successfully!';
    setTimeout(() => successMessage.value = '', 3000);
  } catch (e) {
    alert("Failed to save changes");
  } finally {
    isSaving.value = false;
  }
}

// 3. Change Password
async function changePassword() {
  if (passwordForm.new !== passwordForm.confirm) {
    alert("New passwords do not match!");
    return;
  }

  isSaving.value = true;
  try {
    await userService.updatePassword(passwordForm.current, passwordForm.new);
    successMessage.value = 'Password changed successfully!';
    // Reset form
    passwordForm.current = '';
    passwordForm.new = '';
    passwordForm.confirm = '';
    setTimeout(() => successMessage.value = '', 3000);
  } catch (e) {
    alert("Incorrect current password");
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto pb-20">

    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
      <p class="text-gray-500 text-sm mt-1">Manage your profile details and account security.</p>
    </div>

    <div class="border-b border-gray-200 mb-8 flex gap-8">
      <button
          @click="activeTab = 'profile'"
          class="pb-3 text-sm font-medium transition-colors border-b-2"
          :class="activeTab === 'profile' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'"
      >
        Public Profile
      </button>
      <button
          @click="activeTab = 'account'"
          class="pb-3 text-sm font-medium transition-colors border-b-2"
          :class="activeTab === 'account' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'"
      >
        Account Security
      </button>
    </div>

    <transition name="fade">
      <div v-if="successMessage" class="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        {{ successMessage }}
      </div>
    </transition>

    <div v-if="isLoading" class="space-y-6">
      <div class="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
      <div class="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
    </div>

    <div v-else-if="activeTab === 'profile'" class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div class="p-8">

        <div class="flex items-center gap-6 mb-8">
          <div class="relative group">
            <img
                :src="profileForm.avatarUrl || '/avatar-default.png'"
                class="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
            />
            <button
                @click="triggerFileInput"
                class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-bold"
            >
              Change
            </button>
          </div>

          <div>
            <h3 class="font-bold text-gray-900">Profile Picture</h3>
            <p class="text-xs text-gray-500 mb-3">JPG, GIF or PNG. Max size of 2MB.</p>
            <button
                @click="triggerFileInput"
                type="button"
                class="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Upload New
            </button>
            <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFileChange" />
          </div>
        </div>

        <form @submit.prevent="saveProfile" class="space-y-6 max-w-lg">

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
                v-model="profileForm.displayName"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
                v-model="profileForm.bio"
                rows="4"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Tell your readers about yourself..."
            ></textarea>
            <p class="text-xs text-gray-400 mt-1 text-right">{{ profileForm.bio.length }} / 500</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
                v-model="profileForm.email"
                type="email"
                disabled
                class="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg px-3 py-2 cursor-not-allowed"
            />
            <p class="text-xs text-gray-400 mt-1">Contact support to change your email.</p>
          </div>

          <div class="pt-4">
            <button
                type="submit"
                :disabled="isSaving"
                class="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center"
            >
              <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>

        </form>
      </div>
    </div>

    <div v-else-if="activeTab === 'account'" class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div class="p-8">
        <h3 class="font-bold text-gray-900 mb-6">Change Password</h3>

        <form @submit.prevent="changePassword" class="space-y-6 max-w-lg">

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
                v-model="passwordForm.current"
                type="password"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                  v-model="passwordForm.new"
                  type="password"
                  required
                  minlength="8"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                  v-model="passwordForm.confirm"
                  type="password"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div class="pt-4 border-t border-gray-100 flex justify-between items-center">
            <p class="text-xs text-gray-500">
              Password must be at least 8 characters long.
            </p>
            <button
                type="submit"
                :disabled="isSaving"
                class="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Update Password
            </button>
          </div>

        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>