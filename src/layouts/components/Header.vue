<template>
    <div class="header-block bg-custom-primary">
      <div class="row m-0 px-2">
        <div class="logo-col">
          <div class="header-content">
            <button class="menu-toggle" @click="toggleSidebar" v-if="isMobile">
              <i class="ri-menu-line"></i>
            </button>
          </div>
          <span class="brand-logo">
              <img :src="appLogoImage" alt="logo"/>
          </span>
        </div>

        <div class="main-search-col">
          <MainSearch />
        </div>

        <div class="items-col">
          <Notifications />
          <UserInfoDropdown />
          <ModeSwitch/>
        </div>

      </div>
    </div>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from "vue";
import { useAppStore } from "@/stores/app";
import UserInfoDropdown from "@/layouts/components/UserInfoDropdown.vue";
import Notifications from "@/layouts/components/Notifications.vue";
import ModeSwitch from "@/components/mode/ModeSwitch.vue";
import EventBus from "@/core/utils/eventBus.js";
import MainSearch from "@/layouts/components/MainSearch.vue";

const appStore = useAppStore();

const showSidebar = ref(true)

const appLogoImage = computed(() => appStore.appLogoImage);

const isMobile = ref(false)

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
  EventBus.emit('openSidebar', !isMobile.value);
  showSidebar.value = !isMobile.value;
}

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
  EventBus.emit('openSidebar', showSidebar.value)
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>

<style scoped lang="scss">
@import "../styles/styles.css";
</style>