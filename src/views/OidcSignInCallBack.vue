<template>
  <div />
</template>

<script setup>
import { useRouter } from 'vue-router';
import {useSecurityStore} from "@/auth/auth.js";

const router = useRouter();
const authStore = useSecurityStore();

authStore
    .completeLogin()
    .then((res) => {
      router.push('/');
    })
    .catch((err) => {
      console.error('Login error:', err);
    });
</script>
