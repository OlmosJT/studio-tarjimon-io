<script setup lang="ts">
import { reactive } from 'vue';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'auth'
});

const { register, loginWithGoogle, loading, error } = useAuth();

// Registration Form State
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
});

// 1. Handle Registration
async function handleRegister() {
  await register({
    firstName: form.firstName,
    lastName: form.lastName, // Ensure your backend RegisterRequest expects this
    email: form.email,
    password: form.password
  });
}

// 2. Handle Google Sign Up (Same flow as Login)
// This triggers the redirect to your Spring Boot backend
function handleGoogleSignUp() {
  loginWithGoogle();
}
</script>

<template>
  <div>
    <div class="mb-6 text-center">
      <h2 class="text-2xl font-bold text-gray-900">Create an account</h2>
      <p class="mt-2 text-sm text-gray-600">Start translating your content today</p>
    </div>

    <div>
      <button
          @click="handleGoogleSignUp"
          type="button"
          :disabled="loading"
          class="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
      >
        <svg class="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12.0003 20.45c-4.6667 0-8.45-3.7833-8.45-8.45 0-4.6667 3.7833-8.45 8.45-8.45 2.2833 0 4.35 0.8333 5.95 2.2167l-3.0333 3.0333c-0.6833-0.65-1.7667-1.1667-2.9167-1.1667-2.5 0-4.5333 2.0333-4.5333 4.5333 0 2.5 2.0333 4.5333 4.5333 4.5333 2.3333 0 3.9167-1.6333 4.05-3.95h-4.05v-3.6667h7.9167c0.0833 0.6333 0.1333 1.2833 0.1333 2 0 4.8667-3.25 8.3667-8.05 8.3667z" fill="#4285F4" />
        </svg>
        Sign up with Google
      </button>
    </div>

    <div class="relative mt-6">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">Or register with email</span>
      </div>
    </div>

    <form class="mt-6 space-y-6" @submit.prevent="handleRegister">

      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
          <div class="mt-1">
            <input
                v-model="form.firstName"
                id="firstName"
                name="firstName"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
          <div class="mt-1">
            <input
                v-model="form.lastName"
                id="lastName"
                name="lastName"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
        <div class="mt-1">
          <input
              v-model="form.email"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="mt-1">
          <input
              v-model="form.password"
              id="password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
          />
        </div>
      </div>

      <div>
        <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ loading ? 'Creating account...' : 'Create account' }}
        </button>
      </div>
    </form>

    <div class="mt-6 text-center text-sm">
      <span class="text-gray-600">Already have an account?</span>
      <NuxtLink to="/login" class="font-medium text-black hover:underline ml-1">Sign in</NuxtLink>
    </div>

  </div>
</template>