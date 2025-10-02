<template>
  <div class="table-wrapper">
    <table class="table" :class="{ 'table--hoverable': hoverable }" columns="columns">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.field"
            :style="{ width: column.width || 'auto' }"
            :class="{
              'table__th--sortable': column.sortable,
              'table__th--sorted': sortKey === column.field
            }"
            @click="handleSort(column)"
          >
            <div class="d-flex align-items-center">
              <div>
                {{ column.label }}
              </div>
              <div
                  v-if="column.sortable"
                  class="table__sort-icon"
                  :class="{
                'table__sort-icon--asc': sortKey === column.field && sortOrder === 'asc',
                'table__sort-icon--desc': sortKey === column.field && sortOrder === 'desc'
              }"
              >
                ▲
              </div>
            </div>
          </th>
          <th v-if="$slots.actions">Actions</th>
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
            v-for="(item, index) in sortedItems"
            :key="index"
            @click="$emit('row-click', item)"
          >
            <td
                v-for="column in columns"
                :key="column.field"
                :style="{ width: column.width || 'auto' }"
            >
              <slot :name="column.field" :item="item">
                <template v-if="column.field === 'Action'">
                  <div class="dropdown" @click.stop>
                    <button class="dropdown__toggle" @click="toggleDropdown(index)">
                      ⋮
                    </button>
                    <ul v-if="openDropdown === index" class="dropdown__menu">
                      <li
                          v-for="(action, i) in column.actions"
                          :key="i"
                          @click="action.fun(item)"
                      >
                        {{ action.text }}
                      </li>
                    </ul>
                  </div>
                </template>

                <template v-else-if="column.link">
                  <a :href="typeof column.link === 'function' ? column.link(item) : column.link">
                    {{ column.extra(item) }}
                  </a>
                  <span v-if="typeof column.formatter === 'function'" class="text-muted ms-1">
                    {{ column.formatter(item[column.field], item) }}
                  </span>
                </template>

                <template v-else>
                  <span v-if="typeof column.formatter === 'function'">
                    {{ column.formatter(item[column.field], item) }}
                  </span>
                  <span v-else>
                    {{ item[column.field] }}
                  </span>
                </template>
              </slot>
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
      return value.every(column => 'field' in column && 'label' in column)
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
const openDropdown = ref(null)

const handleSort = (column) => {
  if (!column.sortable) return
  
  if (sortKey.value === column.field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = column.field
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

const toggleDropdown = (id) => {
  openDropdown.value = openDropdown.value === id ? null : id
}

window.addEventListener("click", () => {
  openDropdown.value = null
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
  background-color: var(--background-color);

  th {
    padding: 0;
    border-bottom: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }
  td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  
  th {
    font-weight: 600;

    & > div {
      padding: 0.3rem;
      background-color: var(--header-color);
      height: 3rem;

    }
    &:first-child {
      border-left: 1px solid var(--border-color);
    }
  }
  
  &--hoverable {
    tbody tr:hover {
      background-color: var(--background-hover-color);
      cursor: pointer;
    }
  }
  
  &__th--sortable {
    cursor: pointer;
    user-select: none;
    
    &:hover {
      background-color: var(--background-hover-color);
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

.sortable-arrow {
  line-height: 0.7rem;
  font-size: 0.8rem;
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

.dropdown {
  position: relative;
  display: inline-block;

  &__toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
  }

  &__menu {
    position: absolute;
    right: 0;
    top: 100%;
    background: var(--background-color);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    list-style: none;
    margin: 0.25rem 0 0;
    padding: 0.25rem 0;
    min-width: 150px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    z-index: 1000;

    li {
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: var(--primary-color);
        color: #fff;
      }
    }
  }
}

</style> 