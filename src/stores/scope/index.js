import { defineStore } from 'pinia';
import {ref, computed, watch} from 'vue';

export const useScopeStore = defineStore('scope', () => {
    const scope = ref( localStorage.getItem('userScopes') || []);

    const setScope = (data) => {
        scope.value = data;
    }

    const getScope = computed(() => scope.value);

    watch([scope], () => {
        localStorage.setItem('userScopes', JSON.stringify(scope.value));
    })

    return {
        setScope,
        getScope,
        scope,
    }
})