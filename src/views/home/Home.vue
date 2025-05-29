<template>
  <div>
    <template v-if="userType === 'Investigator'">
<!--      <HomeInvestigator />-->
      <HomeUser />
    </template>
    <template v-else>
      <HomeUser />
<!--      <HomeInvestigator v-if="userType !== 'Client'" />-->
    </template>
  </div>
</template>

<script setup>

// import HomeUser from "@/views/home/HomeUser";
// import HomeInvestigator from "@/views/home/HomeInvestigator";

import {computed} from "vue";
import {useAuthStore} from "@/stores/auth/index.js";
import HomeUser from "@/views/home/components/HomeUser.vue";

const authStore = useAuthStore()

const userType = computed(() => authStore.getUserType);

</script>

<style>

</style>
