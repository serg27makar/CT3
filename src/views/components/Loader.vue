<template>
  <div id="loading">
    <div class="text-container">
      <div class="rotating-text">
        <div class="img-wrapper d-flex m-auto flex-column align-content-center align-items-center">
          <img
              src="../../assets/images/logo/Advantage_Icon_GoldFoil.png"
              alt="logo image"
              style="height: 8rem"
          >
          <div class="text-uppercase" style="font-size: 2.2rem">
            Advantage
          </div>
          <div style="font-size: 1.67rem">
            Investigations
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { animation } from '@/config/animation';

const route = useRoute();

const init = () => {
  const load = document.getElementById('loading');
  if (load) {
    load.classList.remove('d-none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    animation.fadeIn(load, { duration: 20 });
    setTimeout(() => {
      animation.fadeOut(load, { duration: 20 });
      load.classList.add('d-none');
    }, 1000);
  }
};

onMounted(init);
watch(route, init);
</script>

<style scoped>
@import "./styles/styles.css";

</style>
