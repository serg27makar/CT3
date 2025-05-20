<template>
    <div class="header-block bg-custom-primary">
      <div class="iq-navbar-custom">
        <div class="d-flex align-items-center justify-content-between">
          <div class="iq-navbar-logo d-flex align-items-center justify-content-between">
            <span class="brand-logo">
                <img :src="appLogoImage" alt="logo"/>
            </span>
          </div>
          <nav class="navbar navbar-expand-lg navbar-light p-0">
            <ModeSwitch/>

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
          </nav>

          <nav class="navbar navbar-expand-lg navbar-light p-0">
            <ModeSwitch/>

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
          </nav>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";
import UserInfoDropdown from "@/layouts/components/UserInfoDropdown.vue";
import Notifications from "@/layouts/components/Notifications.vue";
import ModeSwitch from "@/components/mode/ModeSwitch.vue";

// App and Auth stores
const appStore = useAppStore();
const authStore = useAuthStore();

// Sidebar state and data
const sidebarGroupTitle = ref(true);

// Navbar state
const isNavbarVisible = ref(false);
const isSearchVisible = ref(false);

// Computed properties
const appLogoImage = computed(() => appStore.appLogoImage);
const userType = computed(() => authStore.getUserType);

// Methods for toggling visibility
const toggleNavbar = () => {
  isNavbarVisible.value = !isNavbarVisible.value;
};

const toggleSearch = () => {
  isSearchVisible.value = !isSearchVisible.value;
};

const toggleSidebar = () => {
  // Logic to toggle sidebar visibility (if necessary)
};
</script>

<style scoped lang="scss">
@import "../styles/styles.css";
</style>