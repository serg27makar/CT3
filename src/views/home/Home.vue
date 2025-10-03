<template>
  <div>
    <template v-if="userType === 'Investigator'">
<!--      <HomeInvestigator />-->
      <HomeUser />
    </template>
    <template v-else>
      <HomeInvestigator v-if="userType !== 'Client'" />
      <HomeUser />
    </template>
  </div>
</template>

<script setup>

// import HomeInvestigator from "@/views/home/HomeInvestigator";

import {computed} from "vue";
import {useAuthStore} from "@/stores/auth/index.js";
import HomeUser from "@/views/home/components/HomeUser.vue";
import HomeInvestigator from "@/views/home/components/HomeInvestigator.vue";

const authStore = useAuthStore()

const userType = computed(() => authStore.getUserType);

</script>

<style>

</style>
