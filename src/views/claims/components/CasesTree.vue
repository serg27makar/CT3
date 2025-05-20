<template>
  <div class="container mt-4">
    <div class="search-filter-block">
      <div class="d-flex mr-4">
        <input
            id="searchFilterTerm"
            v-model="searchFilterTerm"
            type="text"
            placeholder="Filter Claims"
            name="searchFilterTerm"
            class="search-filter form-control"
        />
        <i
            class="ri-search-line search-btn"
            :class="!searchFilterTerm ? 'disabled-btn' : ''"
            @click="filterSearch"
        />
        <i
            class="ri-close-circle-fill search-btn"
            :class="!searchFilterTerm ? 'disabled-btn' : ''"
            @click="clearFilterData"
        />
      </div>

      <div class="case-status">
        <label for="caseStatus">Case Status</label>
        <div>
          <label v-for="option in caseStatusOptions" :key="option.value" class="mr-3 ml-3">
            <input
                type="radio"
                :value="option.value"
                v-model="caseStatus"
                :id="'caseStatus-' + option.value"
                class="form-check-input"
            />
            {{ option.text }}
          </label>
        </div>
      </div>
    </div>

    <ul class="tree-root">
      <li v-for="year in yearsToShow" :key="year" class="mb-3 tree-node">
        <div class="tree-header">
          <i class="ri-calendar-line mr-1"> </i>
          <strong>{{ year }}</strong>
        </div>
        <div v-for="(monthGroup, month) in groupedCases[year]" :key="month" class="mb-2 month-group">
          <h5
              v-if="showMonth(month, monthGroup)"
              class="ms-3 cursor-pointer"
              style="padding: 0.3rem"
              @click="toggleCasesOnDate(monthGroup.startDate, monthGroup.endDate, year, month)"
          >
            {{ month }}
            <span v-if="!searchFilterTerm && !caseid" class="count-open-cases">
              <span v-if="caseStatus === false">
                {{ monthGroup.closedCount + " of " + (monthGroup.openCount + monthGroup.closedCount) }} Closed
              </span>
              <span v-else>
                {{ monthGroup.openCount + " of " + (monthGroup.openCount + monthGroup.closedCount) }} Open
              </span>
              <span v-if="monthGroup.isNotify">{{ '⭐' }}</span>
            </span>
          </h5>

          <div v-for="caseItem in monthGroup.cases" :key="caseItem.caseID" class="card mb-2">
            <div class="card-header d-flex justify-content-between">
              <span>
                <strong>{{ caseItem.claimFileNo || caseItem.fileNumber }}</strong> ({{ subjectData(caseItem) }})
                <span v-if="caseItem.isNotify">{{ '⭐' }}</span>
                <a
                   v-if="caseItem.isNotify"
                   class="btn btn-sm btn-outline-primary ml-2"
                   :href="'mailto:' + Client.RequestorEmail + '?subject=Re: Claim: ' +
                  (caseItem.claimFileNo || caseItem.fileNumber) + '&body=Client: ' + Client.Name + '%0D%0ARequestor: ' + Client.RequestorName"
                >Contact</a>
                <strong v-if="caseItem.closedDate" class="pl-3 "> Closed: {{ dateFormat(caseItem.closedDate) }}</strong>
                <router-link
                    v-if="caseItem.closedDate"
                    :to="'/reopen-claim/' + caseItem.caseID"
                    class="btn btn-sm btn-primary ml-3"
                >Reopen Claim</router-link>
              </span>
              <button v-if="caseItem.actions && caseItem.actions.length" class="btn btn-sm btn-outline-primary" @click="toggleActions(caseItem.caseID)">
                {{ visibleActions[caseItem.caseID] ? 'Hide Actions' : 'Show Actions' }}
              </button>
            </div>

            <div class="card-body">
              <CaseTable :caseItem="caseItem" />
              <div v-if="visibleActions[caseItem.caseID]">
                <h6 class="p-1 pt-3">Actions:</h6>
                <table class="table table-sm table-bordered">
                  <thead>
                  <tr>
                    <th>File Number</th>
                    <th>Scheduled Date</th>
                    <th>Activities</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="action in caseItem.actions" :key="action.actionId">
                    <td>{{ action.actionFileNumber }}</td>
                    <td>{{ dateFormat(action.scheduledDate) }}</td>
                    <td>
                      <button v-if="action.activities && action.activities.length" class="btn btn-sm btn-outline-primary" @click="toggleActivities(action.actionId)">
                        {{ visibleActivities[action.actionId] ? 'Hide Activities' : 'Show Activities' }}
                      </button>
                      <div v-if="visibleActivities[action.actionId]">
                        <ActivityTable :activities="action.activities" />
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="d-none">
      <button v-if="skip !== 0" class="btn btn-outline-primary" @click="prevPage">Previous</button>
      <button class="btn btn-outline-primary float-right" @click="nextPage">Next</button>
    </div>
  </div>
</template>

<script>
import {computed, ref, onMounted, reactive, watch} from 'vue';
import { useCaseStore } from '@/stores/case';
import CaseTable from "@/views/claims/components/CaseTable.vue";
import ActivityTable from "@/views/claims/components/ActivityTable.vue";
import { useRouter } from 'vue-router';
import APIService from "@/core/utils/APIService.js";

const apiService = new APIService();

export default {
  components: { ActivityTable, CaseTable },
  props: {
    caseid: {
      type: String,
      default: "",
    }
  },
  setup(props) {
    const caseStore = useCaseStore();
    const router = useRouter();

    const searchFilterTerm = ref('');
    const caseStatus = ref(null);
    const skip = ref(0);
    const take = ref(100);
    const fromDate = ref('');
    const toDate = ref('');
    const isChanged = ref(false);
    const isLoadedCase = ref(null);
    const yearsToShow = ref([]);

    const visibleActions = reactive({});
    const visibleActivities = reactive({});

    const sortedYears = computed(() => Object.keys(caseStore.groupedCases).sort((a, b) => b - a));
    const groupedCases = computed(() => caseStore.groupedCases);

    const caseStatusOptions = ref([
      { text: "All", value: null },
      { text: "Open", value: true },
      { text: "Closed", value: false },
    ]);

    const Client = ref({
      Name: localStorage.getItem("ClientName"),
      RequestorEmail: localStorage.getItem("EMail"),
      RequestorName: localStorage.getItem("FullName"),
    });

    watch(caseStatus, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        yearsToShow.value = [...sortedYears.value];
      }
    });

    watch(sortedYears, (val) => {
      if (!searchFilterTerm.value) yearsToShow.value = val
    });

    watch(searchFilterTerm, (val) => {
      isChanged.value = !!val;
      if (!val) clearFilterData(true)
    })

    onMounted(async () => {
      await getDateTree();
    });

    const getDateTree = async () => {
      const response = await apiService.get("client-portal/cases/dates");
      if (response && response.data) {
        caseStore.groupedCases = transformData(response.data);
        if (props.caseid) loadCaseById(props.caseid);
      }
    };

    const transformData = (inputData) => {
      return inputData.reduce((result, { year, months }) => {
        result[year] = {};
        months.forEach(({ monthNumber, closedCount, openCount, isNotify }) => {
          const date = new Date(year, monthNumber - 1, 1);
          const monthName = date.toLocaleString("en-US", { month: "long" });
          const startDate = `${year}-${String(monthNumber).padStart(2, "0")}-01`;
          const lastDay = new Date(year, monthNumber, 0).getDate();
          const endDate = `${year}-${String(monthNumber).padStart(2, "0")}-${lastDay}`;

          result[year][monthName] = {
            startDate,
            endDate,
            cases: [],
            closedCount,
            openCount,
            isNotify,
          };
        });
        return result;
      }, {});
    };

    const filterSearch = () => {
      if (!searchFilterTerm.value) return;
      if (props.caseid) router.push('/claims');
      fromDate.value = "";
      toDate.value = "";
      clearCases();
      loadCases();
    };

    const clearFilterData = (forcedly = false) => {
      if (!searchFilterTerm.value && !forcedly) return;
      if (props.caseid) router.push('/claims');
      searchFilterTerm.value = '';
      yearsToShow.value = sortedYears.value;
      clearCases();
    };

    const expandAll = (data) => {
      const selectedCases = data.map(i => i.caseID);
      const selectedActions = [];
      for (const item in data) {
        data[item].actions.map(a => {
          selectedActions.push(a.actionId)
        });
      }
      selectedCases.map(c => toggleActions(c))
      selectedActions.map(a => toggleActivities(a))
    }

    const dateFormat = (val) => {
      if (!val) return "";
      const date = new Date(val);
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return date.toLocaleDateString("en-US", options);
    };

    const toggleActions = (caseID) => {
      visibleActions[caseID] = !visibleActions[caseID];
    };

    const toggleActivities = (actionId) => {
      visibleActivities[actionId] = !visibleActivities[actionId];
    };

    const clearCases = () => {
      for (const year in caseStore.groupedCases) {
        for (const month in caseStore.groupedCases[year]) {
          caseStore.groupedCases[year][month].cases = [];
        }
      }
    };

    const loadCases = async (dateToggle = false) => {
      const endpoint = `client-portal/cases?skip=${skip.value}` +
          `&take=${take.value}` +
          `&searchFilterTerm=${searchFilterTerm.value}` +
          `&fromDate=${fromDate.value}` +
          `&toDate=${toDate.value}` +
          ((caseStatus.value !== null) ? `&IsOnlyActiveCases=${caseStatus.value}` : "")
      const response = await apiService.get(endpoint);
      if (response && response.data) {
        if (searchFilterTerm.value) {
          if (!dateToggle) yearsToShow.value = [];
          expandAll(response.data)
        }
        addGroupedCases(response.data);
        isChanged.value = false;
      }
    };

    const loadCaseById = (caseID) => {
      if (isLoadedCase.value) return
      apiService
          .get("client-portal/cases/" + caseID)
          .then(res => {
            yearsToShow.value = [];
            expandAll([res.data])
            addGroupedCases([res.data])
            isLoadedCase.value = res.data;
            searchFilterTerm.value = res.data.claimFileNo || res.data.fileNumber
          })
    }

    const subjectData = (val) => {
      let text = `${val.subjectName}:`;
      return text.slice(0, -1);
    }

    const nextPage = () => {};

    const prevPage = () => {};

    const showMonth = (month, monthGroup) => {
      if (!props.caseid && !searchFilterTerm.value) return true;
      if (!props.caseid && searchFilterTerm.value && !isChanged.value) {
        return !!monthGroup.cases.length
      }
      if (isLoadedCase.value) {
        const m = new Date(isLoadedCase.value.createdDate).toLocaleString("default", {
          month: "long",
        });
        return month === m;
      }
      return true
    }

    const addGroupedCases = (cases) => {
      cases.forEach((caseItem) => {
        const year = new Date(caseItem.createdDate).getFullYear();
        const month = new Date(caseItem.createdDate).toLocaleString("default", {
          month: "long",
        });
        if ((searchFilterTerm.value || props.caseid) && yearsToShow.value.indexOf(year) === -1) {
          yearsToShow.value.push(year)
        }
        if (!caseStore.groupedCases[year][month].cases.filter(i => i.caseID === caseItem.caseID).length)
          caseStore.groupedCases[year][month].cases.push(caseItem);
      });
    }

    const toggleCasesOnDate = (start, end, year, month) => {
      if (caseStore.groupedCases[year][month].cases.length) {
        caseStore.groupedCases[year][month].cases = [];
      } else {
        if (props.caseid) {
          expandAll([isLoadedCase])
          addGroupedCases([isLoadedCase])
        } else {
          fromDate.value = start;
          toDate.value = end;
          loadCases(true);
        }
      }
    }

    return {
      props,
      yearsToShow,
      searchFilterTerm,
      caseStatus,
      caseStatusOptions,
      isChanged,
      isLoadedCase,
      skip,
      groupedCases,
      visibleActions,
      visibleActivities,
      Client,
      filterSearch,
      clearFilterData,
      clearCases,
      loadCases,
      nextPage,
      prevPage,
      showMonth,
      toggleCasesOnDate,
      toggleActions,
      toggleActivities,
      addGroupedCases,
      subjectData,
      dateFormat,
      loadCaseById,
    };
  },
};

</script>
<style scoped>
@import "../styles/styles.css";
</style>
