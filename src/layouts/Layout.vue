<template>
  <div>
    <Loader />
    <LayoyutVertical>
      <template #sidebar>
        <Sidebar />
      </template>

      <template #header>
        <Header />
      </template>

      <template #footer>
        <FooterStyle />
      </template>

      <router-view v-slot="{ Component }">
          <transition>
            <component :is="Component"/>
          </transition>
        </router-view>
    </LayoyutVertical>

    <BaseModal
        :isVisible="sessionExpiring"
        ok-variant="danger"
        ok-title="Logout"
        cancel-title="Keep Working"
        modal-class="modal-danger"
        :hide-header-close="true"
        centered
        title="Session Expiring"
        @ok="signOut"
        @cancel="onHide"
    >
      <div class="modal-text">
        Your session is about to expire due to inactivity. {{ countdown }}
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import Loader from '@/views/components/Loader.vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/users';
import APIService from '@/core/utils/APIService';
import { useRouter } from 'vue-router';
import BaseModal from "@/components/modal/BaseModal.vue";
import {useSecurityStore} from "@/auth/auth.js";
import LayoyutVertical from "@/layouts/components/LayoyutVertical.vue";
import Header from "@/layouts/components/Header.vue";
import FooterStyle from "@/views/components/FooterStyle.vue";
import Sidebar from "@/views/components/Sidebar.vue";

const authStore = useAuthStore();
const userStore = useUserStore();
const securityStore = useSecurityStore();
const router = useRouter();
const apiService = new APIService();

const authUser = ref('0');
const countdown = ref('');
const refreshInterval = ref(null);
const isLoggedInInterval = ref(null);
const sessionExpiring = ref(false);
const onLine = ref(navigator.onLine);

const getExpires = computed(() => authStore.getExpires);
const getBackendActivity = computed(() => userStore.getBackendActivity);

watch(getBackendActivity, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    loopRefreshToken();
  }
});

watch(getExpires, (val) => {
  if (val <= 300) {
    showModal(val);
  }
});

onMounted(() => {
  loopIsLoggedIn();
  document.body.classList = 'fixed-top-navbar top-nav';
});

onUnmounted(() => {
  document.body.classList = 'fixed-top-navbar top-nav';
  if (refreshInterval.value) clearInterval(refreshInterval.value);
  if (isLoggedInInterval.value) clearInterval(isLoggedInInterval.value);
});

const loopIsLoggedIn = () => {
  isLoggedInInterval.value = setInterval(async () => {
    authUser.value = await securityStore.isLoggedIn();
  }, 60 * 1000);
};

const loopRefreshToken = () => {
  refreshToken();
  refreshInterval.value = setInterval(() => {
    userStore.setBackendActivity(false);
  }, 15 * 60 * 1000);
};

const signOut = () => {
  clearInterval(refreshInterval.value);
  sessionExpiring.value = false;
  securityStore.logout();
  router.push('/');
};

const onHide = () => {
  sessionExpiring.value = false;
  refreshToken();
};

const startTimer = (duration) => {
  let timer = duration;
  const countdownTimer = setInterval(() => {
    if (+localStorage.getItem('expires') > 500) {
      authStore.setSessionEnds(false);
      clearInterval(countdownTimer);
      return;
    }
    const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
    const seconds = String(timer % 60).padStart(2, '0');

    countdown.value = `${minutes}:${seconds}`;

    if (--timer <= 0) {
      authStore.setSessionEnds(false);
      signOut();
      clearInterval(countdownTimer);
    }
  }, 1000);
};

const showModal = async (val) => {
  if (val <= 0) {
    authStore.setSessionEnds(false);
    signOut();
    return;
  }
  authStore.setSessionEnds(true);
  authUser.value = await authStore.checkLoginStatus();
  if (authUser.value) {
    sessionExpiring.value = true
    startTimer(val);
  } else {
    signOut();
  }
};

const refreshToken = () => {
  if (!onLine.value || Number(localStorage.getItem('expires')) > Number(localStorage.getItem('sessionTimeout')) - 600) return;

  axios
      .post('/api/v2/auth/refresh-token')
      .then((res) => {
        if (res && res.data) {
          localStorage.setItem('expires', res.data.expiresIn);
          localStorage.setItem('sessionTimeout', res.data.sessionTimeout);
          authStore.setExpires(res.data.expiresIn);
          authStore.setSessionEnds(false);

          setTimeout(() => {
            sessionExpiring.value = false;
          }, 200)

        } else {
          signOut();
        }
      })
      .catch(() => {
        signOut();
      });
};
</script>

<style lang="scss">
.modal-text {
  color: var(--text-color);
}
</style>