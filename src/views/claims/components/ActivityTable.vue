<template>
  <table class="table table-sm table-bordered mt-2">
    <thead>
      <tr>
        <th>Manager Summary</th>
        <th>Video Link</th>
        <th>Image Link</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="activity in activities"
        :key="activity.activityId"
      >
        <td v-html="activity.managerSummary || 'No Summary'" />
        <td>
          <div>
            <span
              v-if="activity.videoStatus"
              class="text-nowrap"
            >
              <span>
                <img
                  v-if="activity.videoStatus === 1"
                  alt="Camera"
                  src="../../../assets/images/logo/Video_Icon_Integrity.png"
                  class="p-1 cursor-pointer video-icon"
                  @click="handlerLink(activity.activityId, true, true)"
                >
                <img
                  v-else-if="activity.videoStatus === 2"
                  alt="Camera"
                  src="../../../assets/images/logo/Video_Icon_Claimant.png"
                  class="p-1 cursor-pointer video-icon"
                  @click="handlerLink(activity.activityId, true, true)"
                >
                <img
                  v-else-if="activity.videoStatus === 3"
                  alt="Mic"
                  src="../../../assets/images/logo/mic-icon.png"
                  class="p-1 cursor-pointer video-icon"
                  @click="handlerLink(activity.activityId, true, true)"
                >
              </span>
              <i
                class="ri-file-copy-line cursor-pointer pl-2 copy-btn"
                @click="handlerLink(activity.activityId, true, false)"/>
            </span>
          </div>
        </td>
        <td>
          <span v-if="activity.isMediaThumbnails">
            <i
              class="ri-image-2-line cursor-pointer copy-btn"
              @click="handlerLink(activity.activityId, false, true)"
            />
            <i
              class="ri-file-copy-line cursor-pointer pl-2 copy-btn"
              @click="handlerLink(activity.activityId, false, false)"
            />
          </span>

        </td>
      </tr>
    </tbody>
  </table>
</template>


<script setup>
import { computed } from "vue";
import APIService from "@/core/utils/APIService";
import { DEV_URL, PROD_URL } from "@/core/constant";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import EventBus from '@/core/utils/eventBus.js';

const props = defineProps({
  activities: {
    type: Array,
    default: () => [],
  },
});

const apiService = new APIService();

const STUrl = computed(() => (import.meta.env.PROD ? PROD_URL : DEV_URL));

const handlerLink = async (activityId, isVideo = false, isOpen = false) => {
  try {
    const endpoint = `client-portal/activities/${isVideo ? "video-link" : "thumbnails-link"}?activityId=${activityId}`;
    const response = await apiService.get(endpoint);

    if (response?.data?.link) {
      if (isOpen) {
        EventBus.emit('openVideo', response.data.link)
      } else {
        await navigator.clipboard.writeText(STUrl.value + response.data.link);
        toast.success("Copied to clipboard!", {position: "top-center"});
      }
    }
  } catch (error) {
    toast.error("Failed to retrieve the link.");
  }
};
</script>

<style scoped>
@import "../styles/styles.css";
</style>