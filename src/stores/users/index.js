import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
    const user = ref({});
    const fullName = ref(localStorage.getItem('FullName') || '');
    const clientName = ref(localStorage.getItem('ClientName') || '');
    const accountManager = ref(JSON.parse(localStorage.getItem('AccountManager')) || {});
    const userToEdit = ref({});
    const isBackendActivity = ref(false);

    const getCurrentUser = computed(() => user.value);
    const getClientName = computed(() => clientName.value);
    const getUserFullName = computed(() => fullName.value);
    const getAccountManager = computed(() => accountManager.value);
    const getUserToEdit = computed(() => userToEdit.value);
    const getBackendActivity = computed(() => isBackendActivity.value);

    const setCurrentUser = (data) => {
        user.value = { ...data };
    };

    const setUserFullName = (data) => {
        fullName.value = data;
        localStorage.setItem('FullName', data);
    };

    const setClientName = (data) => {
        clientName.value = data;
        localStorage.setItem('ClientName', data);
    };

    const setAccountManager = (data) => {
        accountManager.value = { ...data };
        localStorage.setItem('AccountManager', JSON.stringify(data));
    };

    const setUserToEdit = (data) => {
        userToEdit.value = { ...data };
    };

    const setBackendActivity = (data) => {
        isBackendActivity.value = data;
    };

    return {
        user,
        fullName,
        clientName,
        accountManager,
        userToEdit,
        isBackendActivity,
        getCurrentUser,
        getClientName,
        getUserFullName,
        getAccountManager,
        getUserToEdit,
        getBackendActivity,
        setCurrentUser,
        setUserFullName,
        setClientName,
        setAccountManager,
        setUserToEdit,
        setBackendActivity,
    };
});
