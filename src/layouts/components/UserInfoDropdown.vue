<template>
  <div class="dropdown ml-3 mr-3" ref="dropdownRef">
    <a
        href="#"
        class="d-flex align-items-center text-decoration-none"
        @click.prevent="toggleDropdown"
    >
      <i class="ri-user-line avatar-icon text-white text-decoration-none"></i>
    </a>

    <transition name="fade">
      <div
          v-if="isOpen"
          class="dropdown-menu show animated fadeIn"
          style="min-width: 15rem; right: 0; left: auto;"
      >
        <router-link to="/user-profile" class="dropdown-item">
          <i class="ri-user-line mr-2"></i> View Profile
        </router-link>
        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-item text-danger" @click.prevent="logOut">
          Logout
        </a>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useUserStore } from '@/stores/users'
import {useSecurityStore} from "@/auth/auth.js";

const userStore = useUserStore()
const authStore = useSecurityStore()

const isOpen = ref(false)
const dropdownRef = ref(null)

const userFullName = computed(() => userStore.getUserFullName)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

const logOut = () => {
  authStore.logout()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-menu {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  z-index: 1000;
}
i.avatar-icon {
  font-size: 1.4rem;
}
</style>
