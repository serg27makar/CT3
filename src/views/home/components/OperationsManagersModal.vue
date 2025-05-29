<template>
  <div>
    <div class="blur-background" />
    <div class="operations-managers-modal">
      <div class="row mb-2">
        <div class="col-md-4">
          <h3>
            O.M. Coverage <span @click="changeList" class="btn-map">{{ listState }}</span>
          </h3>
        </div>
        <div class="col-md-3">
          <div>
            <label v-for="opt in options" :key="opt.value">
              <input type="radio" v-model="categoryType" :value="opt.value" />
              {{ opt.text }}
            </label>
          </div>
        </div>
        <div class="col-md-4">
          <div class="center-justified toggle-text">
            Sort by State or Manager Name
            <input type="checkbox" v-model="sortByManager" />
          </div>
        </div>
        <div class="close-btn" @click="closeUp">+</div>
      </div>

      <UsaMap v-if="listState === 'List'" :sorted-state-manager-list="sortedStateManagerList" />
      <div v-else class="states-grid">
        <div v-for="item in sortedStateManagerList" :key="item.stateCode" class="state-item">
          <strong class="state-name">{{ item.stateName }}</strong> — {{ item.managerName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import UsaMap from '@/components/map/USMap.vue'
import { useApiStore } from '@/stores/apiStore'
import { StatesList } from '@/core/constant'

// State
const listState = ref('Map')
const categoryType = ref('0')
const sortByManager = ref(false)
const options = [
  { text: 'Surveillance', value: '0' },
  { text: 'SIU', value: '1' },
]

const users = ref([])
const coverageSurveillance = ref([])
const coverageSIU = ref([])

// API Loading
const apiStore = useApiStore()

onMounted(async () => {
  users.value = await apiStore.fetchUsers()
  const coverage = await apiStore.fetchCoverage()
  coverageSurveillance.value = coverage.find(i => i.categoryType === 0)?.users || []
  coverageSIU.value = coverage.find(i => i.categoryType === 1)?.users || []
})

// Computed list
const stateManagerList = computed(() => {
  const coverage = categoryType.value === '1' ? coverageSIU.value : coverageSurveillance.value
  return StatesList.map(state => {
    const found = coverage.find(item => item.stateCode === state)
    const user = users.value.find(u => u.value === found?.userAccountId)
    return {
      stateCode: state,
      stateName: state,
      managerName: user ? user.title : 'Not Assigned'
    }
  })
})

const sortedStateManagerList = computed(() => {
  if (!sortByManager.value) return stateManagerList.value
  const grouped = {}
  stateManagerList.value.forEach(item => {
    if (!grouped[item.managerName]) grouped[item.managerName] = []
    grouped[item.managerName].push(item)
  })
  return Object.keys(grouped).sort().flatMap(manager => grouped[manager])
})

// Handlers
const changeList = () => {
  listState.value = listState.value === 'List' ? 'Map' : 'List'
}
const closeUp = () => {
  emit('close')
}
</script>

<style scoped>
.blur-background {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}
.operations-managers-modal {
  position: fixed; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: white; border: 2px solid #476dae; border-radius: 0.5rem;
  width: 60rem; height: 40rem; padding: 1rem; z-index: 99999; overflow: auto;
}
.states-grid { column-count: 3; column-gap: 1rem; max-height: 38rem; overflow-y: auto; }
@media (max-width: 992px) { .operations-managers-modal { width: 40rem; } .states-grid { column-count: 2; } }
@media (max-width: 576px) { .operations-managers-modal { width: 20rem; } .states-grid { column-count: 1; } }
.state-item { break-inside: avoid; margin-bottom: 0.12rem; background-color: #f8f9fa; padding: 0.12rem 0.6rem; border-radius: 6px; border: 1px solid #dee2e6; display: block; font-size: 1rem; }
.state-name { display: inline-block; width: 1.8rem; }
.toggle-text { font-size: 0.9rem; display: flex; justify-content: space-between; }
.close-btn { display: inline-block; transform: rotate(45deg); cursor: pointer; font-size: 2rem; position: absolute; top: 0; right: 1rem; color: #6E6B7B; }
.btn-map { cursor: pointer; color: #476dae; text-decoration: underline; }
</style>
