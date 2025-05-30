<template>
  <div class="table-wrapper">
    <table class="table" :class="{ 'table--hoverable': hoverable }">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="{
              'table__th--sortable': column.sortable,
              'table__th--sorted': sortKey === column.key
            }"
            @click="handleSort(column)"
          >
            {{ column.label }}
            <span
              v-if="column.sortable"
              class="table__sort-icon"
              :class="{
                'table__sort-icon--asc': sortKey === column.key && sortOrder === 'asc',
                'table__sort-icon--desc': sortKey === column.key && sortOrder === 'desc'
              }"
            >
              ▲
            </span>
          </th>
          <th v-if="$slots.actions">Действия</th>
        </tr>
      </thead>
      
      <tbody>
        <template v-if="loading">
          <tr v-for="n in 3" :key="n" class="table__loading-row">
            <td
              :colspan="$slots.actions ? columns.length + 1 : columns.length"
              class="table__loading-cell"
            >
              <div class="table__loading-content" />
            </td>
          </tr>
        </template>
        
        <template v-else-if="items.length">
          <tr
            v-for="item in sortedItems"
            :key="item.id"
            @click="$emit('row-click', item)"
          >
            <td v-for="column in columns" :key="column.key">
              <slot :name="column.key" :item="item">
                {{ item[column.key] }}
              </slot>
            </td>
            <td v-if="$slots.actions">
              <slot name="actions" :item="item" />
            </td>
          </tr>
        </template>
        
        <tr v-else>
          <td
            :colspan="$slots.actions ? columns.length + 1 : columns.length"
            class="table__empty"
          >
            {{ emptyText }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(column => 'key' in column && 'label' in column)
    }
  },
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  hoverable: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: 'No data'
  }
})

defineEmits(['row-click', 'sort'])

const sortKey = ref('')
const sortOrder = ref('asc')

const handleSort = (column) => {
  if (!column.sortable) return
  
  if (sortKey.value === column.key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = column.key
    sortOrder.value = 'asc'
  }
}

const sortedItems = computed(() => {
  if (!sortKey.value) return props.items
  
  return [...props.items].sort((a, b) => {
    const aValue = a[sortKey.value]
    const bValue = b[sortKey.value]
    
    if (aValue === bValue) return 0
    
    const result = aValue > bValue ? 1 : -1
    return sortOrder.value === 'asc' ? result : -result
  })
})
</script>

<style lang="scss" scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  
  th {
    font-weight: 600;
    background-color: #f8f9fa;
  }
  
  &--hoverable {
    tbody tr:hover {
      background-color: #f8f9fa;
      cursor: pointer;
    }
  }
  
  &__th--sortable {
    cursor: pointer;
    user-select: none;
    
    &:hover {
      background-color: #e9ecef;
    }
  }
  
  &__sort-icon {
    display: inline-block;
    margin-left: 0.25rem;
    opacity: 0.3;
    transition: transform 0.2s ease;
    
    &--asc {
      opacity: 1;
      transform: rotate(0deg);
    }
    
    &--desc {
      opacity: 1;
      transform: rotate(180deg);
    }
  }
  
  &__empty {
    text-align: center;
    color: #6c757d;
    padding: 2rem !important;
  }
  
  &__loading-row {
    animation: pulse 1.5s infinite;
  }
  
  &__loading-cell {
    padding: 0 !important;
  }
  
  &__loading-content {
    height: 24px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style> 