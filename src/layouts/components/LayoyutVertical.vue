<template>
  <div class="layout-vertical">
    <!-- Header -->
    <header class="header">
      <slot name="header">
        <div class="header-content">
          <button class="menu-toggle" @click="toggleSidebar" v-if="isMobile">
            ☰
          </button>
        </div>
      </slot>
    </header>

    <!-- Main layout body -->
    <div class="layout-body">
      <!-- Sidebar -->
      <aside
          class="sidebar"
          :class="{ 'sidebar-hidden': isMobile && !showSidebar }"
      >
        <slot name="sidebar">
          <div class="sidebar-placeholder">Sidebar</div>
        </slot>
      </aside>

      <div class="main-content">

        <!-- Page content -->
        <main class="content">
          <slot />
        </main>

        <!-- Footer -->
        <footer class="footer">
          <slot name="footer">
            <div class="footer-placeholder">Footer</div>
          </slot>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showSidebar = ref(true)
const isMobile = ref(false)

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (isMobile.value) showSidebar.value = false
  else showSidebar.value = true
}

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>

<style scoped>
.main-content {
  overflow-y: auto;
}
.layout-vertical {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header,
.footer {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.header {
  flex: 0 0 7%;
}

.footer {
  flex: 0 0 5%;
}

.layout-body {
  flex: 1 0 auto;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 20%;
  min-width: 200px;
  background-color: #e0e0e0;
  transition: transform 0.3s ease;
}

.sidebar-hidden {
  transform: translateX(-100%);
  position: absolute;
  z-index: 2;
  height: calc(80vh);
  background-color: #e0e0e0;
}

.content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  min-height: 96%;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: 1rem;
}

.header-content {
  display: flex;
  align-items: center;
}

.sidebar-placeholder,
.header-placeholder,
.footer-placeholder {
  color: #666;
}
</style>
