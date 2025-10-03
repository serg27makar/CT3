<template>
  <div class="home-user">
    <h1>Active Assignments</h1>

    <div class="row mb-1">
      <div class="col-6">
        <Input v-model="searchFilterTerm" placeholder="Search" class="search-input" />
      </div>
      <div class="col-6 text-end">
        <button class="btn">
          Refresh
        </button>
      </div>
    </div>

    <Table :items="caseStore.groupedActions" :columns="columns" />

    <Pagination
        :totalPages="Math.ceil(caseStore.totalActionCount / perPage)"
        :totalItems="caseStore.totalActionCount.length"
        v-model:currentPage="currentPage"
        v-model:pageSize="perPage"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Table from '@/components/ui/Table.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Input from '@/components/ui/Input.vue'
import { useCaseStore } from '@/stores/case'
import { useAuthStore } from "@/stores/auth/index.js";

// router
const router = useRouter()

// store
const caseStore = useCaseStore()
const authStore = useAuthStore()

// state
const currentPage = ref(1)
const perPage = ref(50)
const searchFilterTerm = ref('')

// formatters
const dateFormatter = (val) => {
  if (!val) return ''
  return new Date(val).toLocaleDateString('en-US')
}
const timeFormatter = (val) => {
  if (!val) return ''
  return new Date('1970-01-01T' + val + 'Z').toLocaleTimeString('en-US', {
    timeZone: 'UTC',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
  })
}

// columns
const columnsUser = [
  {
    label: 'Action',
    field: 'ActionFileNumber',
    sortable: true,
    link: (item) => `/cases/edit-action/${item.ActionID}`,
    extra: (item) => item.ActionFileNumber,
  },
  {
    label: 'Subject',
    field: 'Subject',
    sortable: true,
    link: (item) => `/subject/${item.SubjectID}`,
    extra: (item) => item.Subject,
  },
  {
    label: "City",
    field: "Location",
  },
  {
    label: 'Scheduled Date',
    field: 'ScheduledDate',
    sortable: true,
    formatter: dateFormatter,
  },
  {
    label: 'Start Time',
    field: 'TimeWindowStart',
    sortable: true,
    formatter: timeFormatter,
  },
  {
    label: "Case",
    field: "CaseFileNumber",
    sortable: true,
  },
  {
    label: "Action",
    field: "Action",
  },
]

const restColumns = [
  {
    label: "Action",
    field: "ActionFileNumber",
    sortable: true,
  },
  {
    label: "Subject",
    field: "Subject",
    sortable: true,
  },
  {
    label: "City",
    field: "Location",
    sortable: true,
  },
  {
    label: "Scheduled Date",
    field: "ScheduledDate",
    sortable: true,
  },
  {
    label: "Daily Instructions",
    field: "DailyInstructions",
    sortable: true,
  },
  {
    label: "Time Window",
    field: "TimeWindow",
    sortable: true,
  },
  {
    label: "Action",
    field: "Action",
  },
]

const columns = computed(() => {
  let updatedColumns = [...restColumns]
  if (authStore.userType === "User") {
    updatedColumns = [...columnsUser]
  }
  return updatedColumns
})

const fetchAssignments = async () => {
  await caseStore.fetchAssignments({
    page: currentPage.value,
    perPage: perPage.value,
    search: searchFilterTerm.value,
  })
}

onMounted(() => {
  fetchAssignments()
})

watch([currentPage, perPage, searchFilterTerm], () => {
  fetchAssignments()
})
</script>

<style scoped>
.home-user {
  padding: 1rem;
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
