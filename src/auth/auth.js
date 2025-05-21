import { useAuthStore } from '@/stores/auth';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import axios from 'axios';
import { clientRoot, loginCallback, logoutCallback } from '@/config/config';
import { UserType } from '@/core/constant';
import {useUserStore} from "@/stores/users/index.js";
import {useScopeStore} from "@/stores/scope/index.js";

let oidcClient = null;

function setupOidcClient({ authority, clientId, scope, responseType }) {
    localStorage.setItem('oidc_authority', authority);
    localStorage.setItem('oidc_clientId', clientId);
    localStorage.setItem('oidc_scope', scope);
    localStorage.setItem('oidc_responseType', responseType);

    oidcClient = new UserManager({
        userStore: new WebStorageStateStore(),
        authority,
        client_id: clientId,
        redirect_uri: `${clientRoot}${loginCallback}`,
        response_type: responseType,
        scope,
        post_logout_redirect_uri: `${clientRoot}${logoutCallback}`,
        filterProtocolClaims: true,
        loadUserInfo: true,
    });

    oidcClient.events.addUserLoaded(user => {
        console.log('New User Loaded:', user);
    });

    oidcClient.events.addAccessTokenExpired(async () => {
        console.log('AccessToken Expired');
        await oidcClient.signoutRedirect();
    });

    oidcClient.events.addUserSignedOut(async () => {
        console.log('User Signed Out');
        await oidcClient.signoutRedirect();
    });
}

if (localStorage.getItem('oidc_authority')) {
    setupOidcClient({
        authority: localStorage.getItem('oidc_authority'),
        clientId: localStorage.getItem('oidc_clientId'),
        scope: localStorage.getItem('oidc_scope'),
        responseType: localStorage.getItem('oidc_responseType'),
    });
}

export const useSecurityStore = defineStore('security', () => {
    const startOfSession = ref(null);
    const authStore = useAuthStore();
    const userStore = useUserStore();
    const scopeStore = useScopeStore();

    async function login(email) {
        try {
            var result = await axios.post('/api/auth/getauthsettings', { email });
            const url = new URL(result.data.authRedirectUrl)
            const authority = url.origin
            const clientId = url.searchParams.get('client_id')

            if (authority.indexOf("auth0") !== -1) {
                localStorage.setItem('authority', authority);
                localStorage.setItem('clientId', clientId);
            }
            window.location = result.data.authRedirectUrl;
        } catch (error) {
            console.error(error);
            return error.response?.data;
        }
    }

    async function isLoggedIn() {
        if (authStore.getSessionEnds) return '1';
        try {
            var result = await axios.get('/api/auth/status');
            if (result.data.expires > 0) {
                if (result.data.userType === UserType.Investigator) {
                    await logout();
                }
                var establishedDate = new Date(result.data.established);
                localStorage.setItem('session-start', establishedDate);
                localStorage.setItem('userType',  result.data.userType);
                localStorage.setItem('userRole',  result.data.userRole);
                localStorage.setItem('expires',  result.data.expires);
                localStorage.setItem('sessionTimeout',  result.data.sessionTimeout);
                localStorage.setItem('isLoggedIn', '1');
                authStore.setUser(result.data);
                authStore.updateSessionStart(establishedDate);
                authStore.setExpires(result.data.expires);

                axios.get('/api/auth/scopes').then(scopesResponse => {
                    scopeStore.setScope(scopesResponse.data)
                })
                    .catch(err => {
                        scopeStore.setScope([])
                    });
                if (!localStorage.EMail || !localStorage.UID) {
                    axios.get('/api/user/profile').then(res => {
                        const fullName = res.data.FirstName + " " + res.data.LastName;
                        userStore.setUserFullName(fullName)
                        localStorage.setItem('EMail', res.data.EMail);
                        localStorage.setItem('UID', res.data.UserAccountID);
                        localStorage.setItem('FullName', fullName);
                    })
                }
                return '1';
            }
            localStorage.setItem('isLoggedIn', '0');
            return '0';
        } catch (error) {
            console.error(error);
            localStorage.setItem('isLoggedIn', '0');
            return '0';
        }
    }

    async function completeLogin() {
        try {
            const user = await oidcClient.signinRedirectCallback();
            localStorage.setItem('access-token', user.access_token);
            localStorage.setItem('id-token', user.id_token);

            const { data } = await axios.post('/api/auth/login', {
                accessToken: user.access_token,
                idToken: user.id_token,
            });
            authStore.setUser(data);
            return user;
        } catch {
            return { error: 'We could not verify your login with the server.' };
        }
    }

    async function logout() {
        const returnTo = `${clientRoot}${logoutCallback}`;
        try {
            localStorage.setItem('isLoggedIn', '0');
            const authority = localStorage.getItem('authority');
            const clientId = localStorage.getItem('clientId');
            if (authority && clientId) {
                window.location = `${authority}/v2/logout?returnTo=${returnTo}&client_id=${clientId}`;
            } else {
                await axios.get('/api/auth/logout');
                window.location = '/';
            }
            localStorage.clear();
            authStore.reset();
        } catch (error) {
            console.error(error);
        }
    }

    async function getAccessToken() {
        const user = await oidcClient.getUser();
        return user && !user.expired ? user.access_token : null;
    }

    return {
        login,
        isLoggedIn,
        completeLogin,
        logout,
        getAccessToken,
        startOfSession,
    };
});
