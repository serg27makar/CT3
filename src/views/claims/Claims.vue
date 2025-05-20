<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-lg-12 mb-4">
          <div class="py-4 border-bottom">
            <div class="d-flex align-items-center justify-content-between">
              <div class="form-title">
                <h3>Claims for {{ clientName }}</h3>
              </div>
              <AccountManagerInfo />
            </div>
          </div>
        </div>
        <div class="col-lg-12">
          <div class="row">
            <div class="col-lg-12">
              <div class="d-flex justify-content-end align-items-center m-3">
                <a :href="`${stUrl}/cases/add`" :class="'btn btn-outline-primary turn-on px-xl-4 mr-2'" target="_blank">+ Add New Claim</a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-12">
          <div class="row">
            <div class="col-lg-12">
              <CasesTree :caseid="caseID" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <VideoPlayer v-if="selectedVideo" :selectedVideo="stUrl + selectedVideo" />
  </div>
</template>
<script>
import {ref, computed, onMounted, onBeforeUnmount, watchEffect} from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/users';
import { DEV_URL, PROD_URL } from '@/core/constant';
import EventBus from '@/core/utils/eventBus.js';
import CasesTree from "@/views/claims/components/CasesTree.vue";
import AccountManagerInfo from "@/layouts/components/AccountManagerInfo.vue";
import VideoPlayer from "@/views/claims/components/VideoPlayer.vue";

export default {
  name: 'Claims',
  components: { VideoPlayer, AccountManagerInfo, CasesTree },
  setup() {
    const route = useRoute();
    const userStore = useUserStore();
    const selectedVideo = ref(null);

    const clientName = computed(() => userStore.getClientName);
    const stUrl = computed(() => import.meta.env.PROD ? PROD_URL : DEV_URL);
    const caseID = ref("");

    watchEffect(() => {
      caseID.value = route.params.caseID || "";
    });

    const openVideo = (video) => {
      selectedVideo.value = video;
    };

    onMounted(() => {
      EventBus.on('openVideo', openVideo);
    });

    onBeforeUnmount(() => {
      EventBus.off('openVideo', openVideo);
    });

    return {
      clientName,
      stUrl,
      caseID,
      selectedVideo,
    };
  },
};

</script>
<style lang="scss">
@import "./styles/styles.css";
</style>