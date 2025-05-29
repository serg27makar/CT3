<template>
  <div class="card" :class="{ 'card--loading': loading }">
    <div v-if="title || $slots.header" class="card__header">
      <slot name="header">
        <h3 class="card__title">{{ title }}</h3>
      </slot>
    </div>
    
    <div class="card__body">
      <div v-if="loading" class="card__loading-overlay">
        <span class="card__spinner"></span>
      </div>
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &__header {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  &__title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 500;
  }
  
  &__body {
    padding: 1rem;
    position: relative;
  }
  
  &__footer {
    padding: 1rem;
    border-top: 1px solid var(--border-color);
    background-color: #f8f9fa;
  }
  
  &--loading {
    pointer-events: none;
  }
  
  &__loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }
  
  &__spinner {
    width: 24px;
    height: 24px;
    border: 2px solid var(--primary-color);
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
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