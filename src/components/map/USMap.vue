<template>
  <div class="map-list">
    <div class="d-flex flex-column flex-md-row mb-3 align-items-start align-items-md-center gap-3">

      <div class="col-4">
        <label><strong>Operation Manager</strong></label>
        <select v-model="selectedUser" class="form-control" @change="handleUserSelect">
          <option v-for="user in uniqueManagers" :key="user" :value="user">
            {{ user }}
          </option>
        </select>
      </div>

      <div class="col-5">
        <label><strong>Coverage States</strong></label>
        <div class="used-state-list">{{ selectedStates.join(', ') }}</div>
      </div>

      <div class="col-2">
        <label><strong>State List</strong></label>
        <select v-model="selectedStateFromMap" class="form-control" @change="handleStateSelect">
          <option v-for="state in sortedStateManagerList" :key="state.stateName" :value="state.stateName">
            {{ state.stateName }}
          </option>
        </select>
      </div>
    </div>

    <div class="usa-map-container">
      <svg viewBox="0 0 959 593" class="usa-map" xmlns="http://www.w3.org/2000/svg">
        <g v-html="usMapSvg" @click="handleClick"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  sortedStateManagerList: {
    type: Array,
    required: true
  }
})

const usMapSvg = ref('')
const selectedStateFromMap = ref('')
const selectedUser = ref('')
const selectedStates = ref([])

const uniqueManagers = computed(() => {
  const names = props.sortedStateManagerList.map(i => i.managerName)
  return [...new Set(names.filter(name => name && name !== 'Not Assigned'))].sort()
})

function applyStateColors() {
  props.sortedStateManagerList.forEach(item => {
    const el = document.getElementById(item.stateName)
    if (!el) return
    el.style.fill = '#ccc'
  })

  props.sortedStateManagerList.forEach(item => {
    const el = document.getElementById(item.stateName)
    if (!el) return
    if (item.managerName && item.managerName !== 'Not Assigned' && !selectedStates.value.includes(item.stateName)) {
      el.style.fill = '#ffa500'
    }
  })

  selectedStates.value.forEach(stateName => {
    const el = document.getElementById(stateName)
    if (el) el.style.fill = '#28a745'
  })

  if (selectedStateFromMap.value && !selectedUser.value) {
    const el = document.getElementById(selectedStateFromMap.value)
    if (el) el.style.fill = '#28a745'
  }
}

function handleClick(event) {
  let node = event.target
  while (node && node !== document) {
    if (node.id) break
    node = node.parentNode
  }
  const id = node && node.id ? node.id : null
  if (!id) return

  const match = props.sortedStateManagerList.find(i => i.stateName === id)
  if (match) {
    selectedStateFromMap.value = match.stateName
    selectedUser.value = match.managerName
  } else {
    selectedStateFromMap.value = id
    selectedUser.value = ''
    selectedStates.value = [id]
    nextTick(() => applyStateColors())
  }
}

function handleUserSelect() {}
function handleStateSelect() {}

watch(() => props.sortedStateManagerList, () => {
  selectedStateFromMap.value = ''
  selectedUser.value = ''
  selectedStates.value = []
  nextTick(() => applyStateColors())
}, { deep: true, immediate: true })

watch(selectedUser, (user) => {
  if (user && user !== 'Not Assigned') {
    selectedStates.value = props.sortedStateManagerList
        .filter(i => i.managerName === user)
        .map(i => i.stateName)
    selectedStateFromMap.value = selectedStates.value[0] || ''
    nextTick(() => applyStateColors())
  } else {
    selectedStates.value = []
    nextTick(() => applyStateColors())
  }
})

watch(selectedStateFromMap, (state) => {
  const match = props.sortedStateManagerList.find(i => i.stateName === state)
  if (match) {
    selectedUser.value = match.managerName
  }
  nextTick(() => applyStateColors())
})

onMounted(async () => {
  try {
    const response = await fetch('./src/assets/images/us.svg');
    usMapSvg.value = await response.text();
    await nextTick()
    applyStateColors()
  } catch (err) {
    console.error('Failed to load US map svg:', err)
  }
})
</script>

<style scoped>
.usa-map {
  width: 100%;
  max-width: 900px;
  display: block;
  margin: 0 auto;
}
.usa-map-container {
  width: 40rem;
}
.used-state-list {
  height: 3.5rem;
  overflow: auto;
  border: 1px solid #d8d6de;
  border-radius: 0.3rem;
  padding: 0.2rem 0.4rem;
}
.form-control {
  height: 3.5rem;
}

.usa-map svg path,
.usa-map svg g {
  transition: fill 0.15s ease;
}

select:focus,
option,
.map-list {
  background: var(--background-color);
  color: var(--text-color);
}
</style>