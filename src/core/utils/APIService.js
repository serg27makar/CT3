import axios from 'axios'
import {useSecurityStore} from "@/auth/auth";
import {useUserStore} from "@/stores/users/index.js";

const authStore = useSecurityStore();
const userStore = useUserStore();

const axiosIns = axios.create({
    timeout: 1000 * 120,
})

export const axiosInc = axios;

const catchError = (error) => {
    if (error?.response?.data?.toLowerCase().includes("invalid auth token") || error?.response?.data?.toLowerCase().includes("auth token not provided")) {
        return authStore.logout();
    } else {
        return Promise.reject(error);
    }
};

export default function APIService() {
    this.APIUrl = "/api/"
    this.get = function (path, signal = null) {
        return this.request("GET", path, null, signal)
            .catch(error => catchError(error))
    }
    this.post = (path, data, headers = null) => {
        return this.request("POST", path, data, headers)
            .catch(error => catchError(error))
    }
    this.put = (path, data) => {
        return this.request("PUT", path, data)
            .catch(error => catchError(error))
    }
    this.delete = (path) => {
        return this.request("DELETE", path)
            .catch(error => catchError(error))
    }
    this.request = (method, path, data = null, headers = null) => {
        userStore.setBackendActivity(true)
        switch (method) {
            case "GET":
                return axiosIns.get(this.APIUrl + path, headers);
            case "POST":
                return axiosIns.post(this.APIUrl + path, data, headers);
            case "PUT":
                return axiosIns.put(this.APIUrl + path, data);
            case "DELETE":
                return axiosIns.delete(this.APIUrl + path);
        }
    }
}
