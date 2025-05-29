<template>
  <div
    class="spinner"
    :class="{
      [`spinner--${size}`]: true,
      'spinner--overlay': overlay
    }"
    :style="{ color: color }"
  >
    <div class="spinner__circle"></div>
    <span v-if="text" class="spinner__text">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  text: {
    type: String,
    default: ''
  },
  overlay: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.spinner {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &--overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 1000;
  }
  
  &__circle {
    border-style: solid;
    border-radius: 50%;
    border-right-color: transparent;
    animation: spin 0.75s linear infinite;
  }
  
  &__text {
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }
  
  &--small {
    .spinner__circle {
      width: 16px;
      height: 16px;
      border-width: 2px;
    }
    
    .spinner__text {
      font-size: 0.75rem;
    }
  }
  
  &--medium {
    .spinner__circle {
      width: 24px;
      height: 24px;
      border-width: 3px;
    }
  }
  
  &--large {
    .spinner__circle {
      width: 32px;
      height: 32px;
      border-width: 4px;
    }
    
    .spinner__text {
      font-size: 1rem;
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 