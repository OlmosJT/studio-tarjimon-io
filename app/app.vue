<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { initUser } = useAuth();

await initUser();
</script>
