import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const sessionStart = ref(new Date(localStorage.getItem('session-start')) || 0);
    const userType = ref(localStorage.getItem('userType') || '');
    const userRole = ref(localStorage.getItem('userRole') || '');
    const userName = ref(localStorage.getItem('userName') || '');
    const isLoggedIn = ref('0');
    const expires = ref(localStorage.getItem('expires'));
    const sessionEnds = ref(false);

    const getUserType = computed(() => userType.value);
    const getUserRole = computed(() => userRole.value);
    const getExpires = computed(() => expires.value);
    const getSessionEnds = computed(() => sessionEnds.value);

    function updateSessionStart(val) {
        sessionStart.value = val;
    }

    function setUserType(val) {
        userType.value = val;
    }

    function setUserRole(val) {
        userRole.value = val;
    }

    function setUser(val) {
        userType.value = val.userType;
        userRole.value = val.userRole;
    }

    function setLoginStatus(val) {
        isLoggedIn.value = val;
    }

    function setExpires(val) {
        expires.value = val;
    }

    function setSessionEnds(val) {
        sessionEnds.value = val;
    }

    function reset() {
        isLoggedIn.value = '0';
        userType.value = '';
        userRole.value = '';
        expires.value = undefined;
        sessionStart.value = undefined;
    }

    async function checkLoginStatus() {
        if (localStorage.getItem('isLoggedIn') === '1') {
            isLoggedIn.value = '1';
        } else {
            isLoggedIn.value = '0';
        }
        return isLoggedIn.value;
    }

    watch([userType, userRole, sessionStart, isLoggedIn], () => {
        localStorage.setItem('userType', userType.value);
        localStorage.setItem('userRole', userRole.value);
        localStorage.setItem('session-start', sessionStart.value);
    });

    return {
        sessionStart,
        userType,
        userRole,
        isLoggedIn,
        expires,
        sessionEnds,
        getUserType,
        getUserRole,
        getExpires,
        getSessionEnds,
        setUserType,
        setUserRole,
        setLoginStatus,
        setUser,
        setExpires,
        setSessionEnds,
        checkLoginStatus,
        updateSessionStart,
        reset,
    };
});
