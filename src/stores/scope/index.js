import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useScopeStore = defineStore('scope', () => {
    const scope = ref();

    const setScope = (data) => {
        scope.value = data;
    }

    const getScope = computed(() => scope.value);

    return {
        setScope,
        getScope,
        scope,
    }
})