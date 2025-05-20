import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCaseStore = defineStore('case', () => {
    const groupedCases = ref({});
    const isLoadedCase = ref(null);

    return {
        groupedCases,
        isLoadedCase,
    };
});
