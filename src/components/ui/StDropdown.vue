<template>
  <div class="st-dropdown " :class="{ 'has-error': !!error }" :style="dropdownStyle">
    <div class="dropdown-control" @click="toggleDropdown" :class="{ open }">
      <div class="selected-placeholder">
        <template v-if="selectedDisplay.length">
          <span v-for="(item, index) in selectedDisplay" :key="index" class="tag">
            {{ item.text }}
            <span class="remove-tag" @click.stop="removeSelected(item.value)">✕</span>
          </span>
        </template>
        <span v-else class="placeholder">{{ placeholder }}</span>
      </div>
      <span class="st-arrow">▽</span>
    </div>

    <div v-if="open" class="dropdown-menu">
      <input
          v-if="searchable"
          v-model="searchQuery"
          type="text"
          class="dropdown-search"
          placeholder="Search..."
          @input="onSearch"
      />
      <ul class="dropdown-options">
        <li v-if="filteredOptions.length === 0" class="no-options">No options available</li>
        <li
            v-for="opt in filteredOptions"
            :key="opt.value"
            @click.stop="toggleOption(opt)"
            :class="{ selected: isSelected(opt.value) }"
        >
          {{ opt.text }}
        </li>
      </ul>
      <div v-if="multiple && selectedDisplay.length" class="dropdown-actions">
        <button @click.stop="clearAll">Clear All</button>
      </div>
    </div>

    <span v-if="error" class="error-message">{{ error }}</span>
    <span v-else-if="hint" class="hint-message">{{ hint }}</span>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: [String, Number, Array],
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Select an option',
  },
  error: String,
  hint: String,
  fontSize: {
    type: String,
    default: '1rem',
  },
  width: {
    type: String,
    default: '100%',
  },
  multiple: Boolean,
  searchable: Boolean,
})

const emit = defineEmits(['update:modelValue', 'search'])
const open = ref(false)
const searchQuery = ref('')
const internalValue = ref(props.modelValue)

watch(() => props.modelValue, val => {
  internalValue.value = val
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  return props.options.filter(opt =>
      opt.text.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectedDisplay = computed(() => {
  if (props.multiple) {
    return props.options.filter(opt => internalValue.value?.includes(opt.value))
  } else {
    const found = props.options.find(opt => opt.value === internalValue.value)
    return found ? [found] : []
  }
})

const dropdownStyle = computed(() => ({
  fontSize: props.fontSize,
  width: props.width,
}))

function toggleDropdown() {
  open.value = !open.value
}

function toggleOption(option) {
  if (props.multiple) {
    const selected = [...(internalValue.value || [])]
    const index = selected.indexOf(option.value)
    if (index >= 0) selected.splice(index, 1)
    else selected.push(option.value)
    emit('update:modelValue', selected)
  } else {
    emit('update:modelValue', option.value)
    open.value = false
  }
}

function isSelected(value) {
  return props.multiple
      ? internalValue.value?.includes(value)
      : internalValue.value === value
}

function removeSelected(value) {
  const selected = [...(internalValue.value || [])].filter(v => v !== value)
  emit('update:modelValue', selected)
}

function clearAll() {
  emit('update:modelValue', [])
}

function onSearch() {
  emit('search', searchQuery.value)
}
</script>

<style scoped>
.st-dropdown {
  position: relative;
  display: inline-block;
  font-family: inherit;
}


.dropdown-control {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.35rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-placeholder {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.dark span.placeholder {
  color: #fff;
  opacity: 0.9;
}

.placeholder {
  color: #232323;
  background: transparent;
  cursor: text;
}

.tag {
  background: var(--header-color);
  padding: 0 0.5rem;
  border-radius: 3px;
  display: flex;
  align-items: center;
}

.remove-tag {
  margin-left: 0.3rem;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.75rem;
}

.dropdown-menu {
  position: absolute;
  display: block;
  z-index: 1000;
  background: var(--background-color);
  border: 1px solid #ccc;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 0.25rem;
  border-radius: 4px;
}

.dropdown-search {
  width: 100%;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  outline: none;
}

.dropdown-options {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-options li {
  padding: 0.35rem;
  cursor: pointer;
  color: var(--text-color);
}

.dropdown-options li:hover {
  background: var(--background-hover-color);
  color: var(--text-color);
}

.dropdown-options li.selected {
  background: var(--background-color);
}

.no-options {
  padding: 0.5rem;
  color: #999;
  font-style: italic;
}

.dropdown-actions {
  border-top: 1px solid #eee;
  padding: 0.5rem;
  text-align: right;
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.hint-message {
  color: #999;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.has-error .dropdown-control {
  border-color: #e74c3c;
}

.st-arrow {
  color: #456bac;
  font-weight: bold;
}
</style>
