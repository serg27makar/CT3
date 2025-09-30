<template>
  <label class="toggle-wrapper">
    <span class="toggle-label">{{ label }}</span>
    <input
        type="checkbox"
        v-model="localValue"
        class="toggle-input"
    />
    <span class="toggle-slider"></span>
  </label>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: "" }
});

const emit = defineEmits(["update:modelValue"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
});
</script>

<style scoped>
.toggle-wrapper {
  display: inline-flex;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #444);
}

.toggle-input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 40px;
  height: 20px;
  background-color: #cbd5e0;
  border-radius: 9999px;
  transition: background-color 0.3s ease;
}

.toggle-slider::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background-color: #fff;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.toggle-input:checked + .toggle-slider {
  background-color: #4a90e2;
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(20px);
}
</style>
