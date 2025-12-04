<script setup lang="ts">
import { ref } from 'vue';

const { locale, locales, setLocale } = useI18n();

defineProps({
  translatorName: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/40'
  }
})

const isDropdownOpen = ref(false);

const availableLocales = computed(() => {
  return locales.value;
});

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function switchLanguage(langCode: string) {
  setLocale(langCode);
  isDropdownOpen.value = false;
}

</script>

<template>
  <header class="studio-header">
    <div class="brand-section">
      <h1 class="logo-text">{{ $t('brand') }}</h1>
    </div>

    <div class="user-section">

      <div class="language-wrapper">

        <div class="language-trigger" @click="toggleDropdown">
          <span>{{ locale.toUpperCase() }}</span>
          <span class="arrow" :class="{ 'rotated': isDropdownOpen }">▼</span>
        </div>

        <div v-if="isDropdownOpen" class="dropdown-menu">
          <ul>
            <li
                v-for="lang in availableLocales"
                :key="lang.code"
                @click="switchLanguage(lang.code)"
                class="dropdown-item"
                :class="{ 'active': lang.code === locale }"
            >
              {{ lang.code.toUpperCase() }}
            </li>
          </ul>
        </div>
      </div>

      <div class="profile-info">
        <img
            :src="profileImage"
            alt="User Avatar"
            class="avatar"
        />
        <span class="translator-name">{{ translatorName }}</span>
      </div>

    </div>
  </header>
</template>

<style scoped>
/* --- Layout --- */
.studio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  font-family: sans-serif;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

/* --- Language Selector --- */
.language-wrapper {
  position: relative;
}

.language-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-weight: 600;
  color: #555;
  padding: 6px 10px;
  border-radius: 4px;
  user-select: none;
  min-width: 60px; /* Prevent jumping when changing EN -> UZ */
  justify-content: space-between;
}

.language-trigger:hover {
  background-color: #f5f5f5;
}

.arrow {
  font-size: 0.7rem;
  transition: transform 0.2s ease;
}

.arrow.rotated {
  transform: rotate(180deg);
}

/* --- Dropdown --- */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  min-width: 80px;
  z-index: 50; /* Higher z-index to sit on top of other content */
}

.dropdown-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #333;
  transition: background 0.1s;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.dropdown-item.active {
  background-color: #e6f7ff;
  color: #007bff;
  font-weight: 600;
}

/* --- Profile --- */
.profile-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ddd;
}

.translator-name {
  font-weight: 500;
  color: #333;
}
</style>