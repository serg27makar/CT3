<template>
    <div class="header-block bg-custom-primary">
      <div class="iq-navbar-custom">
        <div class="d-flex align-items-center justify-content-between">
          <div class="iq-navbar-logo d-flex align-items-center justify-content-between">
            <div class="header-content">
              <button class="menu-toggle" @click="toggleSidebar" v-if="isMobile">
                <i class="ri-menu-line"></i>
              </button>
            </div>
            <span class="brand-logo">
                <img :src="appLogoImage" alt="logo"/>
            </span>
          </div>
          <MainSearch />



          <div class="navbar navbar-expand-lg navbar-light p-0">

            <div class="navbar-collapse">
              <ul class="navbar-nav ml-auto navbar-list align-items-center">
                <!-- Notifications Item -->
                <li class="nav-item nav-icon dropdown">
                  <Notifications />
                </li>

                <!-- User Dropdown -->
                <li class="caption-content">
                  <UserInfoDropdown />
                </li>
              </ul>
            </div>
            <ModeSwitch/>

          </div>
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