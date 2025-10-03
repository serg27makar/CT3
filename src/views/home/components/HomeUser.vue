<template>
  <div class="home-user">
    <h1>Cases I Manage</h1>
      <div class="row mb-1">
        <div class="col-3">
          <button v-if="authStore.userType !== 'Investigator'" @click="addCase" class="btn w-100">
            <span>{{ authStore.userType === "Client" ? "+ Add Claim" : "+ Add Case" }}</span>
          </button>
        </div>
        <div class="col-3">
          <button v-if="authStore.userType === 'User'" @click="openOperationsManagersModal" class="btn w-100">
            Operations Managers
          </button>
        </div>
        <div class="col-3">
          <div v-if="scopeStore.checkPermission('st2.searchcasesclientnotifications')">
            <Toggle v-model="onlyCheckIn" label="Only 3 Day Check-in"/>
          </div>
        </div>
        <div class="col-3">
          <Input v-model="searchTerm" placeholder="Search" class="search-input"/>
        </div>
      </div>

    <Table :items="caseStore.groupedCases" :columns="columns"/>

    <Pagination
        :totalPages="Math.ceil(caseStore.totalCaseCount / perPage)"
        :totalItems="caseStore.groupedCases.length"
        v-model:currentPage="currentPage"
        v-model:pageSize="perPage"
    />

    <OperationsManagersModal v-if="showOperationsModal" @close="showOperationsModal = false" />
  </div>
</template>

<script setup>
import {ref, onMounted, watch, computed} from 'vue'
import { useRouter } from 'vue-router'
import Table from '@/components/ui/Table.vue'
import Pagination from '@/components/ui/Pagination.vue'
import { useCaseStore } from '@/stores/case'
import { useAuthStore } from '@/stores/auth'
import { useScopeStore } from '@/stores/scope'
import OperationsManagersModal from "@/views/home/components/OperationsManagersModal.vue";
import Input from "@/components/ui/Input.vue";
import Toggle from "@/components/ui/Toggle.vue";

const router = useRouter()
const caseStore = useCaseStore()
const authStore = useAuthStore()
const scopeStore = useScopeStore()

// State
const currentPage = ref(1)
const perPage = ref(200)
const searchTerm = ref('')
const onlyCheckIn = ref(false)
const showOperationsModal = ref(false)

const dateFormater = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString("en-US");
}
const notifyFormat = (val) => {
  switch (val) {
    case 0 : return "Today";
    case 1 : return "Tomorrow";
    case 2 : return "Two Days";
    default: return "";
  }
}

const showFileNumber = (value) => {
  return authStore.userType === "Client" ? value.ClaimFileNo || value.FileNumber : value.FileNumber
}

const mgrDisplay = (item, val) => {
  if (authStore.userType === "User") {
    let text;
    text = val.IsAccountManager ? "Account Mgr, " : "";
    text = val.IsOperationsManager ? text + "Ops Mgr, " : text;
    text = val.IsPrimaryCaseAssistant ? text + "Research Mgr, " : text;
    text = val.IsSecondaryCaseAssistant ? text + "SIU Mgr, " : text;
    text = val.IsUSPManager ? text + "RCS Mgr, " : text;
    text = val.IsVendorManager ? text + "Vendor Mgr, " : text;
    text = val.IsCSRUser ? text + "CSR, " : text;
    text = val.IsBranchAM ? text + "BR AM, " : text;
    text = val.IsClientDealOwnerUser ? text + "Deal Owr, " : text;
    text = val.IsBranchDealOwnerUser ? text + "BR Deal Owr, " : text;
    text = text.substr(0, text.length - 2)
    return "(" + text + ")"
  }
}

const viewCase = (item) => {
  router.push('/cases/' + item.CaseID + '/detail')
}

const columnsUsually = [
  {
    label: "Case",
    field: "FileNumber",
    sortable: true,
    width: '4rem',
    link: (item) => `cases/${item.CaseID}/detail`,
    extra: showFileNumber,
    formatter: mgrDisplay
  },
  {
    label: "Client",
    field: "ClientName",
    sortable: true,
    width: '4rem',
    link: (item) => `clients/view/${item.ClientID}`,
    extra: (item) => item.ClientName,
  },
  {
    label: "Subject",
    field: "Subject",
    sortable: true,
    width: '4rem',
    link: (item) => `subject/${item.SubjectID}`,
    extra: (item) => item.Subject,
  },
  {
    label: "Created Date",
    field: "DateCreated",
    width: '8rem',
    sortable: true,
    formatter: dateFormater,
  },
  {
    label: "Case Due Date",
    field: "CaseDueDate",
    width: '8rem',
    sortable: true,
    formatter: dateFormater,
  },
  {
    label: "Completed Date",
    field: "CompletedDate",
    width: '8rem',
    sortable: true,
  },
  {
    label: "Operations Manager",
    field: "OperationsManager",
    sortable: true,
  },
  {
    label: "Location",
    field: "Location",
    sortable: true,
  },
  {
    label: "Logistics",
    field: "DatesToBeConducted",
    sortable: true,
  },
  {
    label: "Action",
    field: "Action",
    actions: [
      {
        text: "View Case",
        fun: viewCase,
      },
    ]
  }
]
const clientColumns = [
  {
    label: "Claim",
    field: "FileNumber",
    sortable: true,
    width: '4rem',
    link: (item) => `cases/${item.CaseID}/detail`,
    extra: showFileNumber,
    formatter: mgrDisplay
  },
  {
    label: "Subject",
    field: "Subject",
    sortable: true,
    width: '4rem',
  },
  {
    label: "Created Date",
    field: "DateCreated",
    width: '8rem',
    sortable: true,
  },
  {
    label: "Completed Date",
    field: "CompletedDate",
    width: '8rem',
    sortable: true,
  },
  {
    label: "Action Scheduled Date",
    field: "ActionDueDates",
    width: '8rem',
    sortable: true,
  },
  {
    label: "Operations Manager",
    field: "OperationsManager",
    sortable: true,
  },
  {
    label: "SIU Manager",
    field: "SecondAssistantManager",
    sortable: true,
  },
  {
    label: "Recommendations",
    field: "Recommendation",
    sortable: true,
  },
  {
    label: "Action",
    field: "Action",
    actions: [
      {
        text: "View Case",
        fun: viewCase,
      },
    ]
  }
]

const columns = computed(() => {
  let updatedColumns = [...columnsUsually]

  if (authStore.UserType === "Client") {
    updatedColumns = [...clientColumns]
  }

  if (scopeStore.checkPermission("st2.searchcasesclientnotifications")) {
    const newColumn = {
      label: "Next Client Checkin",
      field: "ClientNotifyDay",
      width: "8rem",
      sortable: true,
      formatter: notifyFormat,
    }
    const index = updatedColumns.findIndex(col => col.field === "CaseDueDate")
    if (index !== -1) {
      updatedColumns.splice(index + 1, 0, newColumn)
    }
    return updatedColumns
  }

  return updatedColumns
})

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
