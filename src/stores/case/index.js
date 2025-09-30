// stores/case.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import APIService from '@/core/utils/apiService';

const apiService = new APIService();

export const useCaseStore = defineStore('case', () => {
    const groupedCases = ref({});
    const isLoadedCase = ref(false);
    const totalCount = ref(0);

    const fetchCases = async ({ page = 1, perPage = 20, search = '', onlyCheckIn = false } = {}) => {
        isLoadedCase.value = false;

        const skip = (page - 1) * perPage;

        try {
            const response = await apiService.get(
                `cases/dashboard?searchFilterTerm=${encodeURIComponent(search)}&skip=${skip}&max=${perPage}&isClientNotify=${onlyCheckIn}`
            );

            groupedCases.value = response.data.Cases || [];
            totalCount.value = response.data.TotalCount || 0;
            isLoadedCase.value = true;
        } catch (error) {
            console.error('❌ Failed to fetch cases:', error);
            groupedCases.value = {};
            totalCount.value = 0;
            isLoadedCase.value = false;
        }
    };

    return {
        groupedCases,
        isLoadedCase,
        totalCount,
        fetchCases,
    };
});
