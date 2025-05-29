import { useAuthStore } from '@/stores/auth';
import {useSecurityStore} from "@/auth/auth.js";
import { createRouter, createWebHistory } from 'vue-router';
import {loginCallback, logoutCallback} from "@/config/config.js";

const Layout = () => import("@/layouts/Layout.vue");
const Home = () => import('@/views/home/Home.vue');
const UserProfile = () => import('@/views/user/UserProfile.vue');
const Login = () => import('@/views/Login.vue');
const OidcSigInCallBack = () => import('@/views/OidcSignInCallBack.vue');
const OidcSignOutCallBack = () => import('@/views/OidcSignOutCallBack.vue');

const childRoutes = [
  { path: '/user-profile', name: 'app.user-profile', meta: { name: 'User Profile' }, component: UserProfile },
  { path: '/home', name: 'layout.home', meta: { name: 'Home' }, component: Home },
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
        next('/home');
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
      console.log("User is logged in, redirecting to home");
      next('/home');
    } else {
      next();
    }
  } catch (error) {
    console.error("Error in route guard:", error);
    next('/');
  }
});


export default router;
