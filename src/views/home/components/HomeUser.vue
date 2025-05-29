<template>
  <div class="home-user">
    <h1>Cases I Manage</h1>
    <div class="controls">
      <button v-if="authStore.userType !== 'Investigator'" @click="addCase" class="btn">+ Add Case</button>
      <button v-if="authStore.userType === 'User'" @click="openOperationsManagersModal" class="btn">Operations Managers</button>
      <div v-if="scopeStore.checkPermission('st2.searchcasesclientnotifications')">
        Only 3 Day Check-in
        <input type="checkbox" v-model="onlyCheckIn" />
      </div>
      <input v-model="searchTerm" placeholder="Search" class="search-input" />
    </div>

    <Table :items="caseStore.cases" :columns="columnsUsually"/>

    <Pagination
        :totalPages="caseStore.total"
        v-model:currentPage="currentPage"
        v-model:perPage="perPage"
    />

    <OperationsManagersModal v-if="showOperationsModal" @close="showOperationsModal = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Table from '@/components/ui/Table.vue'
import Pagination from '@/components/ui/Pagination.vue'
import { useCaseStore } from '@/stores/case'
import { useAuthStore } from '@/stores/auth'
import { useScopeStore } from '@/stores/scope'
import OperationsManagersModal from "@/views/home/components/OperationsManagersModal.vue";

const router = useRouter()
const caseStore = useCaseStore()
const authStore = useAuthStore()
const scopeStore = useScopeStore()

// State
const currentPage = ref(1)
const perPage = ref(50)
const searchTerm = ref('')
const onlyCheckIn = ref(false)
const showOperationsModal = ref(false)

const columnsUsually = [
      {
        label: "Case",
        field: "FileNumber",
      },
      {
        label: "Client",
        field: "ClientName",
      },
      {
        label: "Subject",
        field: "Subject",
      },
      {
        label: "Created Date",
        field: "DateCreated",
        width: '9rem',
      },
      {
        label: "Case Due Date",
        field: "CaseDueDate",
        width: '9rem',
      },
      {
        label: "Completed Date",
        field: "CompletedDate",
        width: '9rem',
      },
      {
        label: "Operations Manager",
        field: "OperationsManager",
      },
      {
        label: "Location",
        field: "Location",
      },
      {
        label: "Logistics",
        field: "DatesToBeConducted",
      },
      {
        label: "Action",
        field: "Action",
      }
    ]

// Init
onMounted(() => {
  caseStore.fetchCases({ page: currentPage.value, perPage: perPage.value, search: searchTerm.value, onlyCheckIn: onlyCheckIn.value })
})

// Watchers to reload data
watch([currentPage, perPage, searchTerm, onlyCheckIn], () => {
  caseStore.fetchCases({ page: currentPage.value, perPage: perPage.value, search: searchTerm.value, onlyCheckIn: onlyCheckIn.value })
})

// Actions
const addCase = () => {
  router.push('/cases/add')
}
const openOperationsManagersModal = () => {
  showOperationsModal.value = true
}
</script>


<style scoped>
.home-user {
  padding: 1rem;
}
.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.btn {
  background: #476dae;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
  cursor: pointer;
}
.search-input {
  padding: 0.5rem;
  flex: 1;
  min-width: 150px;
}
</style>
