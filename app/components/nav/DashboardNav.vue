<script setup lang="ts">

const props = defineProps({
  disabledPaths: {
    type: Array as PropType<string[]>,
    default: () => []
  }
})

const navItems = [
  { labelKey: 'nav.projects', path: '/dashboard', exact: true },
  { labelKey: 'nav.create', path: '/dashboard/create' },
  { labelKey: 'nav.comments', path: '/dashboard/comments' },
  { labelKey: 'nav.followers', path: '/dashboard/followers' },
  { labelKey: 'nav.settings', path: '/dashboard/settings' },
]

function isDisabled(path: string) {
  return props.disabledPaths.includes(path);
}

</script>

<template>
  <nav class="bg-gray-100 border-b px-6 pt-3 flex gap-6 overflow-x-auto">
    <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ 'disabled-link': isDisabled(item.path) }"
        active-class="active-nav-item"
        :exact="item.exact"
        :tabindex="isDisabled(item.path) ? -1 : 0"
    >
      {{ $t(item.labelKey) }}

      <span v-if="isDisabled(item.path)" class="ml-1 text-xs">🔒</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
/* Base Styles */
.nav-item {
  @apply text-gray-600 font-medium transition-all duration-200 whitespace-nowrap border-b-2 border-transparent pb-3;
}

/* Hover effect (only if NOT disabled) */
.nav-item:not(.disabled-link):hover {
  @apply text-gray-900;
}

/* Active State */
.active-nav-item {
  @apply text-black font-bold border-black;
}

/* Disabled State */
.disabled-link {
  @apply text-gray-400 cursor-not-allowed pointer-events-none;
  /* pointer-events-none prevents clicking entirely */
}
</style>