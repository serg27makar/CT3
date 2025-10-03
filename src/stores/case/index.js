// stores/case.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import APIService from '@/core/utils/apiService';

const apiService = new APIService();

export const useCaseStore = defineStore('case', () => {
    const groupedCases = ref([]);
    const groupedActions = ref([]);
    const totalCaseCount = ref(0);
    const totalActionCount = ref(0);

    const fetchCases = async ({ page = 1, perPage = 20, search = '', onlyCheckIn = false } = {}) => {
        const skip = (page - 1) * perPage;

        try {
            const response = await apiService.get(
                `cases/dashboard?searchFilterTerm=${encodeURIComponent(search)}&skip=${skip}&max=${perPage}&isClientNotify=${onlyCheckIn}`
            );

            groupedCases.value = response.data.Cases || [];
            totalCaseCount.value = response.data.TotalCount || 0;
        } catch (error) {
            console.error('❌ Failed to fetch cases:', error);
            groupedCases.value = [];
            totalCaseCount.value = 0;
        }
    };

    const fetchAssignments = async ({ page = 1, perPage = 20, search = '' }) => {
        const skip = (page - 1) * perPage;

        try {
            const response = await apiService.get(
                `actions/dashboard?searchFilterTerm=${encodeURIComponent(search)}&skip=${skip}&max=${perPage}`
            );

            groupedActions.value = response.data.Actions || [];
            totalActionCount.value = response.data.TotalCount || 0;
        } catch (error) {
            console.error('❌ Failed to fetch actions:', error);
            groupedActions.value = [];
            totalActionCount.value = 0;
        }
    }

    return {
        groupedCases,
        groupedActions,
        totalCaseCount,
        totalActionCount,
        fetchCases,
        fetchAssignments,
    };
});
