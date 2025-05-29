<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="closeOnOverlay">
        <div class="modal" :class="{ 'modal--large': large }" @click.stop>
          <div class="modal__header">
            <slot name="header">
              <h3 class="modal__title">{{ title }}</h3>
            </slot>
            <button v-if="!hideClose" class="modal__close" @click="close">×</button>
          </div>
          
          <div class="modal__body">
            <slot />
          </div>
          
          <div v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  hideClose: {
    type: Boolean,
    default: false
  },
  large: {
    type: Boolean,
    default: false
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}

const closeOnOverlay = (e) => {
  if (props.closeOnOutsideClick) {
    close()
  }
}

const handleEscape = (e) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  
  &--large {
    max-width: 800px;
  }
  
  &__header {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  &__title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 500;
  }
  
  &__close {
    background: none;
    border: none;
    font-size: 1.5rem;
    line-height: 1;
    padding: 0.25rem;
    cursor: pointer;
    color: #6c757d;
    
    &:hover {
      color: var(--danger-color);
    }
  }
  
  &__body {
    padding: 1rem;
    overflow-y: auto;
  }
  
  &__footer {
    padding: 1rem;
    border-top: 1px solid var(--border-color);
    background-color: #f8f9fa;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(-20px);
}
</style> 