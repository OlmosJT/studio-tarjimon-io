<script setup lang="ts">
import { authService } from '~/services/authService';

const route = useRoute();
const { setSession } = useAuth();

onMounted(async () => {
  const token = route.query.accessToken as string;
  const refresh = route.query.refreshToken as string;

  if (token && refresh) {
    // 1. Fetch the user details immediately using the new token
    try {
      const user = await authService.fetchUser(token);

      // 2. Use setSession to update cookies and global state
      setSession({
        access_token: token,
        refresh_token: refresh,
        user: user
      });

      // 3. Go to dashboard
      navigateTo('/dashboard');
    } catch (e) {
      navigateTo('/login?error=oauth_fetch_failed');
    }
  } else {
    navigateTo('/login?error=no_tokens');
  }
});
</script>
<template>
  <div>Logging you in...</div>
</template>