<template>
  <div class="change-mode">
    <div class="custom-control custom-switch custom-switch-icon custom-control-inline">
      <div class="custom-switch-inner">
        <p class="mb-0"> </p>
        <input
            type="checkbox"
            v-model="dark"
            class="custom-control-input"
            id="dark-mode"
            data-active="true"
        />
        <label class="custom-control-label custom-toggle-label" for="dark-mode" data-mode="toggle">
          <span class="switch-icon-right"><i :class="icon"></i></span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app';

const store = useAppStore();

const dark = ref(store.dark);

const icon = computed(() => store.icon);

watch(dark, (newValue) => {
  changeMode(newValue);
});

onMounted(() => {
  if (useRoute().query.dark !== undefined) {
    dark.value = useRoute().query.dark === 'true';
  }
  changeMode(dark.value);
});

const changeMode = (value) => {
  store.toggleDarkMode( value );
  const body = document.querySelector('body');
  if (value) {
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
  }
};
</script>

<style scoped>
.custom-control-label.custom-toggle-label:before,
.custom-control-label.custom-toggle-label {
  color: white;
  background: none !important;
  border: none !important;
  font-weight: 400 !important;
}
.change-mode .custom-switch.custom-switch-icon label.custom-control-label .switch-icon-right i {
  font-size: 1.2rem !important;
}
</style>
