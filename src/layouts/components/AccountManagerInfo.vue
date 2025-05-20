<template>
  <div class="account-manager-info">
    <div>
      <h6>Your Account Manager: {{ accountManager.firstName + " " + accountManager.lastName }}</h6>
    </div>
    <div>
      <a class="btn btn-primary mr-1" :href="'mailto:' + accountManager.email">
        <i class="ri-mail-line"></i>
      </a>
      <a class="btn btn-primary mr-1" :href="'tel:' + accountManager.phone">
        <i class="ri-phone-line"></i>
      </a>
      <a class="btn btn-primary" href="/home/chat">
        <i class="ri-chat-1-line"></i>
      </a>
    </div>
  </div>
</template>

<script>
import {computed} from 'vue';
import { useUserStore } from '@/stores/users';

export default {
  name: 'AccountManagerInfo',
  setup() {
    const userStore = useUserStore();

    const accountManager = computed(() => userStore.getAccountManager);

    return {
      accountManager,
    };
  },
};
</script>

<style scoped>
</style>
