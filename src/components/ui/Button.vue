<template>
  <button
    :class="[
      'btn',
      `btn--${variant}`,
      { 'btn--loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="btn__spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'warning'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  transition: all 0.15s ease-in-out;
  min-height: 38px;
  
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
  
  &--primary {
    background-color: var(--primary-color);
    color: white;
    
    &:hover:not(:disabled) {
      background-color: darken(#4a90e2, 10%);
    }
  }
  
  &--secondary {
    background-color: #6c757d;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: darken(#6c757d, 10%);
    }
  }
  
  &--danger {
    background-color: var(--danger-color);
    color: white;
    
    &:hover:not(:disabled) {
      background-color: darken(#dc3545, 10%);
    }
  }
  
  &--warning {
    background-color: var(--warning-color);
    color: #212529;
    
    &:hover:not(:disabled) {
      background-color: darken(#ffc107, 10%);
    }
  }
  
  &--loading {
    position: relative;
    color: transparent !important;
    
    .btn__spinner {
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
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