<template>
  <div v-if="isVisible" class="modal fade show d-block" tabindex="-1" role="dialog">

    <div class="modal-backdrop fade show" style="z-index: 99"></div>

    <div class="modal-dialog modal-dialog-centered" style="z-index: 9999" role="document">
      <div class="modal-content">

        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button v-if="!hideHeaderClose" type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <slot />
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button
              v-if="cancelTitle"
              type="button"
              class="btn btn-secondary"
              @click="cancelAction"
          >
            {{ cancelTitle }}
          </button>
          <button
              v-if="okTitle"
              type="button"
              class="btn"
              :class="okVariantClass"
              @click="confirmAction"
          >
            {{ okTitle }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isVisible: Boolean,
  title: { type: String, default: '' },
  okTitle: { type: String, default: 'OK' },
  cancelTitle: { type: String, default: '' },
  hideHeaderClose: { type: Boolean, default: false },
  okVariant: {
    type: String,
    default: 'primary'
  }
});

const emit = defineEmits(['ok', 'cancel', 'close']);

const closeModal = () => emit('close');
const cancelAction = () => {
  emit('cancel');
  closeModal();
};
const confirmAction = () => {
  emit('ok');
  closeModal();
};

const okVariantClass = computed(() => `btn-${props.okVariant}`);
</script>
