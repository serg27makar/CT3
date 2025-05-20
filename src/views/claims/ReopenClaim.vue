<template>
  <div>
    <div id="reopen-page" class="container mt-2">
      <Card>
        <template #headerTitle>
          <div class="reopen-header">
            <h3 class="card-title">Reopen Claim</h3>
            <div>
              <h4>Are you sure you wish to Reopen this Claim?</h4>
              <router-link :to="'/claims/' + CaseID" class="btn btn-warning float-right">
                No, Back to Claim
              </router-link>
            </div>
          </div>
        </template>

        <template #body>
          <div class="row">
            <div class="col">
              <div class="form-group mb-4 required-data">
                <label for="budgetHours">Budget Hours</label>
                <input id="budgetHours" type="number" class="form-control" v-model="budgetHours">
                <small v-if="validationErrors.budgetHours" class="text-danger">
                  {{ validationErrors.budgetHours }}
                </small>
              </div>
            </div>
            <div class="col">
              <div class="form-group mb-4">
                <label for="newBudget">New Budget $</label>
                <input id="newBudget" type="number" class="form-control" v-model="newBudget">
              </div>
            </div>
            <div class="col">
              <div class="form-group required-data">
                <label for="dueDate">Due Date</label>
                <input type="date" class="form-control" id="dueDate" v-model="dueDate">
                <small v-if="validationErrors.dueDate" class="text-danger">
                  {{ validationErrors.dueDate }}
                </small>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <div class="form-group">
                <label for="datesConducted">Dates to be Conducted</label>
                <textarea id="datesConducted" class="form-control" v-model="datesConducted"></textarea>
              </div>
            </div>
            <div class="col">
              <div class="form-group required-data">
                <label for="reasonReopen">Reason for Reopen</label>
                <textarea id="reasonReopen" class="form-control" v-model="reasonReopen"></textarea>
                <small v-if="validationErrors.reasonReopen" class="text-danger">
                  {{ validationErrors.reasonReopen }}
                </small>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <div class="form-group required-data">
                <label for="services">Services</label>
                <Multiselect
                    v-model="services"
                    :options="servicesOption"
                    :multiple="true"
                    label="text"
                    track-by="value"
                    placeholder="Select services"
                />
                <small v-if="validationErrors.services" class="text-danger">
                  {{ validationErrors.services }}
                </small>
              </div>
            </div>
            <div class="col">
              <div class="reopen-btn-block">
                <button
                    class="btn btn-primary"
                    @click="reopenClaim"
                    :disabled="afterClick || !validationSuccess"
                >
                  Reopen Claim
                </button>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import {ref, computed, watch, onMounted, reactive} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import APIService from '@/core/utils/APIService';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Card from "@/components/cards/card.vue";
import {toast} from "vue3-toastify";

const apiService = new APIService();

export default {
  name: 'ReopenClaim',
  components: {Card, Multiselect},
  setup() {
    const route = useRoute();
    const router = useRouter();

    const budgetHours = ref(0);
    const newBudget = ref(0);
    const dueDate = ref('');
    const datesConducted = ref('');
    const reasonReopen = ref('');
    const services = ref([]);
    const servicesOption = ref([]);
    const servicesOptionAll = ref([]);
    const InvestigationServiceIds = ref([]);
    const afterClick = ref(false);

    const validationErrors = reactive({
      budgetHours: null,
      dueDate: null,
      reasonReopen: null,
      services: null,
    });
    const validationSuccess = computed(() => {
      return Object.values(validationErrors).every(err => !err);
    });

    const CaseID = computed(() => route.params.caseID || null);

    const validateForm = (field) => {
      const errorMessage = 'This field is required';

      const fields = {
        budgetHours: budgetHours.value,
        dueDate: dueDate.value,
        reasonReopen: reasonReopen.value,
        services: services.value,
      };

      validationErrors[field] = null;

      if (!fields[field] || (typeof fields[field] === "string" && fields[field].trim() === "") ||
          (Array.isArray(fields[field]) && fields[field].length === 0) ||
          (typeof fields[field] === "number" && fields[field] <= 0)) {
        validationErrors[field] = errorMessage;
      }
    };

    const loadServiceTypes = async () => {
      try {
        const response = await apiService.get('investigation-services');
        servicesOptionAll.value = response.data.map(i => ({
          text: i.name, value: i.id, isDeleted: i.isDeleted
        })).sort((a, b) => a.text.toLowerCase() === 'other' ? 1 : b.text.toLowerCase() === 'other' ? -1 : a.text.localeCompare(b.text));

        servicesOption.value = servicesOptionAll.value.filter(i => !i.isDeleted);
      } catch (error) {
        toast.error('Error loading services:', error);
      }
    };

    const reopenClaim = async () => {
      ['budgetHours', 'dueDate', 'reasonReopen', 'services'].forEach(validateForm);
      if (!validationSuccess.value) return;

      afterClick.value = true;
      const postData = {
        BudgetHours: budgetHours.value,
        BudgetDollars: newBudget.value,
        CaseDueDate: dueDate.value,
        DatesToBeConducted: datesConducted.value,
        ReopenReason: reasonReopen.value,
        ReceivedSource: 'Logged in Client',
        InvestigationServiceIds: InvestigationServiceIds.value,
        RequestedServices: 'Other'
      };

      try {
        const res = await apiService.post(`case/${CaseID.value}/reopen`, postData);
        afterClick.value = false;
        if (res) {
          toast.success("This claim was reopened", {position: "top-center"})
          await router.push(`/claims/${res.data.CaseID}`);
        }
      } catch (error) {
        toast.error(`'Error reopening claim:', ${error}`, {position: "top-center"});
        afterClick.value = false;
      }
    };

    watch(services, (val) => {
      InvestigationServiceIds.value = val.map(s => s.value);
      validateForm('services');
    });

    watch(budgetHours, () => validateForm('budgetHours'));
    watch(dueDate, () => validateForm('dueDate'));
    watch(reasonReopen, () => validateForm('reasonReopen'));

    onMounted(loadServiceTypes);

    return {
      budgetHours,
      newBudget,
      dueDate,
      datesConducted,
      reasonReopen,
      services,
      servicesOption,
      afterClick,
      validationErrors,
      validationSuccess,
      CaseID,
      reopenClaim
    };
  }
};

</script>

<style scoped>
@import "./styles/styles.css";
</style>