<template>
  <div />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const router = useRouter();
const authStore = useAuthStore();

(async () => {
  try {
    await axios.get('/api/auth/logout');
    await authStore.reset();
    await router.push('/');
  } catch (error) {
    console.error('Logout error:', error);
  }
})();
</script>
