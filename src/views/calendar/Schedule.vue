<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-lg-12 mb-4">
          <div class="py-4 border-bottom">
            <div class="d-flex align-items-center justify-content-between">
              <div class="form-title">
                <h3> Activity for {{ ClientName }}</h3>
              </div>
              <AccountManagerInfo />
            </div>
          </div>
        </div>
        <div class="col-lg-12">
          <div class="row">
            <div class="col-lg-12">
              <div class="card card-block card-stretch">
                <div class="card-body">
                  <FullCalendar ref="calendar" :options="calendarOptions"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, computed, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/users'; // Pinia store
import FullCalendar from '@fullcalendar/vue3';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import moment from 'moment';
import AccountManagerInfo from '@/layouts/header/AccountManagerInfo.vue';
import APIService from '@/core/utils/APIService';

export default defineComponent({
  name: 'Schedule',
  components: {
    AccountManagerInfo,
    FullCalendar
  },
  setup() {
    const store = useUserStore();
    const router = useRouter();
    const apiService = new APIService();

    const actionTypes = ref([]);
    const selectValue = ref('');

    const option1 = ref([
      { value: 1, text: 'Working Hours' },
      { value: 2, text: 'Default Hours' },
      { value: 3, text: 'Working Hours' },
      { value: 4, text: 'Learning Hours' },
    ]);

    const ClientName = computed(() => store.getClientName);

    const calendarOptions = ref({
      plugins: [
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
        listPlugin,
        bootstrapPlugin
      ],
      timeZone: 'UTC',
      themeSystem: 'bootstrap',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      },
      weekNumbers: false,
      initialView: 'dayGridMonth',
      editable: false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      eventClick: handleDateSelect,
      dateClick: handleDateClick,
      events: fetchEvents
    });

    async function getActionTypes() {
      try {
        const response = await apiService.get('action-types');
        actionTypes.value = response.data
            .filter(i => i.actionClassId === 3)
            .map(item => ({ title: item.name, value: item.name, id: item.actionTypeId }));
      } catch (error) {
        console.error('Error fetching action types:', error);
      }
    }

    function fetchEvents(fetchInfo, successCallback, failureCallback) {
      const formatDate = (dateStr) => {
        return moment(new Date(dateStr)).format('YYYY-MM-DD');
      };

      apiService.get('client-portal/actions', {
        params: {
          fromDate: formatDate(fetchInfo.startStr),
          toDate: formatDate(fetchInfo.endStr)
        }
      })
          .then(response => successCallback(sortEvents(response.data)))
          .catch(error => failureCallback(error));
    }

    function sortEvents(events) {
      return events.flatMap(i =>
          (i.actions || []).map(a => {
            if (actionTypes.value.some(type => type.id === a.actionTypeID)) {
              const [start, end] = getTargetDate(a.scheduleDate, a.timeWindowStart, a.timeWindowEnd);
              return {
                id: i.caseID,
                title: `${i.claimFileNo || a.actionFileNumber}, ${i.subjectFirstName} ${i.subjectLastName}`,
                start,
                end,
              };
            }
            return null;
          }).filter(Boolean)
      );
    }

    function getTargetDate(scheduleDate, timeWindowStart, timeWindowEnd) {
      const baseDate = new Date(scheduleDate + 'Z');

      function parseTime(baseDate, timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const dateWithTime = new Date(baseDate);
        dateWithTime.setHours(hours, minutes, 0, 0);
        return dateWithTime;
      }

      let start = baseDate, end = baseDate;
      if (timeWindowStart && timeWindowEnd) {
        start = parseTime(baseDate, timeWindowStart);
        end = parseTime(baseDate, timeWindowEnd);
        if (end <= start) end.setDate(end.getDate() + 1);
      }
      return [start, end];
    }

    function handleDateClick(arg) {
      alert('Date clicked! ' + arg.dateStr);
    }

    function handleDateSelect(val) {
      router.push(`/claims/${val.event.id}`);
    }

    onBeforeMount(() => {
      getActionTypes();
    });

    return {
      ClientName,
      calendarOptions,
      actionTypes,
      selectValue,
      option1,
      handleDateClick,
      handleDateSelect
    };
  }
});
</script>
<style lang="scss">


.v-select{
  height: 38px !important;
  background: #fff !important;
  padding-top: 2px !important;
  line-height:37px  !important;
  margin-bottom: 5px !important;
  background: #fff !important;

  .v-select-toggle
  {
    background: unset  !important;
    border: unset !important;
    font-size: 16px  !important;
    color:#535f6b  !important;
  }
  .v-select-toggle > :first-child{
    padding-right: 20px  !important;
  }
  .v-dropdown-container
  {
    margin-bottom: 2px  !important;
    margin-top: 0px  !important;
    z-index: 98  !important;
  }
  .v-dropdown-item
  {

    background: unset  !important;
    font-size: 16px  !important;
    border: unset !important;
    padding: 4px 24px  !important;
    line-height:32px  !important;
    color:#535f6b  !important;
  }
  .v-dropdown-item:hover
  {
    background-color: #f5f6fa  !important;
    color: #1b2734  !important;
  }}
</style>