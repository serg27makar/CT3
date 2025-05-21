<template>
  <div class="layout-vertical">

    <header class="header">
      <slot name="header" />
    </header>

    <div class="layout-body">
      <aside
          class="sidebar"
          :class="{ 'sidebar-hidden': !showSidebar }"
      >
        <slot name="sidebar" />
      </aside>

      <div class="main-content">

        <main class="content">
          <slot />
        </main>

        <footer class="footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import EventBus from "@/core/utils/eventBus.js";

const showSidebar = ref(true);

const openSidebar = (val) => {
  showSidebar.value = val;
};

onMounted(() => {
  EventBus.on('openSidebar', openSidebar);
});

onBeforeUnmount(() => {
  EventBus.off('openSidebar', openSidebar);
});
</script>

<style scoped>
@import "../styles/styles.css";
</style>
