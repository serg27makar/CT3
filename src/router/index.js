import { useAuthStore } from '@/stores/auth';
import {useSecurityStore} from "@/auth/auth.js";
import { createRouter, createWebHistory } from 'vue-router';
import {loginCallback, logoutCallback} from "@/config/config.js";

const Layout = () => import("@/layouts/Layout.vue");
const MySchedule = () => import('@/views/calendar/Schedule.vue');
const Claims = () => import('@/views/claims/Claims.vue');
const UserProfile = () => import('@/views/user/UserProfile.vue');
const Login = () => import('@/views/Login.vue');
const ReopenClaim = () => import('@/views/claims/ReopenClaim.vue');
const OidcSigInCallBack = () => import('@/views/OidcSignInCallBack.vue');
const OidcSignOutCallBack = () => import('@/views/OidcSignOutCallBack.vue');

const childRoutes = [
  { path: '/my-schedule', name: 'layout.mySchedule', meta: { name: 'MySchedule' }, component: MySchedule },
  { path: '/claims/:caseID?', name: 'layout.claims', meta: { name: 'Claims' }, component: Claims },
  { path: '/reopen-claim/:caseID?', name: 'layout.reopenClaim', meta: { name: 'Reopen Claim' }, component: ReopenClaim },
  { path: '/user-profile', name: 'app.user-profile', meta: { name: 'User Profile' }, component: UserProfile },
  // { path: '/home', name: 'layout.claims', meta: { name: 'Claims' }, component: Claims },
];

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    beforeEnter: async (to, from, next) => {
      const authStore = useAuthStore();
      await authStore.checkLoginStatus();

      if (authStore.isLoggedIn === '1') {
        next('/claims');
      } else {
        next();
      }
    }
  },
  {
    path: '/',
    component: Layout,
    children: childRoutes
  },
  {
    path: loginCallback,
    name: 'signin-callback',
    component: OidcSigInCallBack
  },
  {
    path: logoutCallback,
    name: 'OidcSignOutCallback',
    component: OidcSignOutCallBack
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const securityStore = useSecurityStore();

  try {
    let isLoggedIn = await authStore.checkLoginStatus();

    if (isLoggedIn === '0') {
      isLoggedIn = await securityStore.isLoggedIn();
    }

    if ((isLoggedIn === '0') && !['Login', 'OidcSignOutCallback', 'signin-callback'].includes(to.name)) {
      console.log("Router is redirecting to login for auth required page");
      next('/');
    } else if ((isLoggedIn === '1') && to.path === '/') {
      console.log("User is logged in, redirecting to claims");
      next('/claims');
    } else {
      next();
    }
  } catch (error) {
    console.error("Error in route guard:", error);
    next('/');
  }
});


export default router;
