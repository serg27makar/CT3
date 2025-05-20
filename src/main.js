import './assets/main.css'
import "@/assets/scss/global.scss";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.css";
import axios from 'axios';

const app = createApp(App)

app.provide('$http', axios);

app.use(createPinia())
app.use(router)

app.mount('#app')

import "bootstrap/dist/js/bootstrap.js";
