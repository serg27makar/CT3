<template>
  <nav class="pagination" role="navigation" aria-label="pagination">
    <div  v-if="totalPages > 1" class="pagination">
      <button
          class="pagination__button"
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
      >
        ←
      </button>

      <ul class="pagination__list">
        <template v-for="page in visiblePages" :key="page">
          <li v-if="page === '...'" class="pagination__dots">...</li>
          <li v-else>
            <button
                class="pagination__button"
                :class="{ 'pagination__button--active': page === currentPage }"
                @click="handlePageChange(page)"
            >
              {{ page }}
            </button>
          </li>
        </template>
      </ul>

      <button
          class="pagination__button"
          :disabled="currentPage === totalPages"
          @click="handlePageChange(currentPage + 1)"
      >
        →
      </button>
    </div>

    <select
        class="pagination__select"
        :value="pageSize"
        @change="handlePageSizeChange($event)"
    >
      <option v-for="size in pageSizes" :key="size" :value="size">
        {{ size }} / page
      </option>
    </select>

    <div class="pagination__info">
      {{ from }}–{{ to }} of {{ totalItems }}
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  maxVisiblePages: { type: Number, default: 5 },
  pageSize: { type: Number, default: 50 },
  pageSizes: { type: Array, default: () => [50, 100, 200] },
  totalItems: { type: Number, required: true } // 🔹 новое свойство
})

const emit = defineEmits(['update:currentPage', 'update:pageSize'])

const handlePageChange = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}

const handlePageSizeChange = (event) => {
  const newSize = Number(event.target.value)
  emit('update:pageSize', newSize)
  emit('update:currentPage', 1) // сбрасываем на первую страницу
}

const visiblePages = computed(() => {
  const { currentPage, totalPages, maxVisiblePages } = props
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  let pages = []
  const halfVisible = Math.floor(maxVisiblePages / 2)
  let start = currentPage - halfVisible
  let end = currentPage + halfVisible
  if (start < 1) {
    start = 1
    end = maxVisiblePages
  }
  if (end > totalPages) {
    end = totalPages
    start = totalPages - maxVisiblePages + 1
  }
  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('...')
    pages.push(totalPages)
  }
  return pages
})

const from = computed(() => {
  return (props.currentPage - 1) * props.pageSize + 1
})
const to = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.totalItems)
})
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;

  &__list {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.5rem;
    font-size: 0.875rem;
    line-height: 1;
    color: var(--text-color);
    background-color: var(--background-color);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: var(--background-color);
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--active {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
      color: white;
    }
  }

  &__dots {
    padding: 0 0.5rem;
    color: var(--text-color);
  }

  &__select {
    margin-left: 1rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    background: var(--background-color);
    color: var(--text-color);
    cursor: pointer;
  }

  &__info {
    margin-left: 1rem;
    font-size: 0.875rem;
    color: var(--text-color);
  }
}
</style>
