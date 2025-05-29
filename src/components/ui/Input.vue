<template>
  <div class="form-group">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :id="id"
        ref="input"
        v-bind="$attrs"
        :value="modelValue"
        :class="[
          'form-control',
          { 'form-control--error': error }
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
      >
      <slot name="suffix" />
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
    <span v-if="hint" class="hint-message">{{ hint }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`
  }
})

const input = ref(null)

defineEmits(['update:modelValue'])

defineOptions({
  inheritAttrs: false
})
</script>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-color);
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 0.2rem rgba(74, 144, 226, 0.25);
  }
  
  &--error {
    border-color: var(--danger-color);
    
    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
  }
  
  &:disabled {
    background-color: #e9ecef;
    opacity: 1;
  }
}

.error-message {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--danger-color);
}

.hint-message {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6c757d;
}
</style> 