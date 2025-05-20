<template>
  <div class="player-background">
    <div class="player-blur" />
    <div class="player-wrapper">
      <div class="close-btn" @click="closeVideo">
        <i class="ri-close-line" />
      </div>
      <iframe
        id="videoPlayer"
        :src="selectedVideo"
      />
    </div>
  </div>
</template>

<script setup>
import EventBus from "@/core/utils/eventBus.js";

const props = defineProps({
  selectedVideo: {
    type: String,
    default: "",
  }
})
const closeVideo = () => {
  EventBus.emit('openVideo', null)
}
</script>

<style scoped>
@import "../styles/styles.css";
</style>