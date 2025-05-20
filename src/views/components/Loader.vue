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
.text-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  perspective: 500px;
}

.rotating-text {
  font-size: 3rem;
  font-weight: bold;
  transform-style: preserve-3d;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}
</style>
