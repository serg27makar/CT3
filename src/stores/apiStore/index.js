import { defineStore } from 'pinia'
import APIService from "@/core/utils/APIService.js";
import {toast} from "vue3-toastify";

const apiService = new APIService();

const errorMsg = (err) => {
    toast.error("Response error", err);
}

export const useApiStore = defineStore('api', {
    state: () => ({}),

    actions: {
        async fetchUsers() {
            try {
                const res = await apiService.get('/api/users/user?isActiveOnly=true')
                return res.data.Users.map(d => ({
                    title: `${d.LastName}, ${d.FirstName}`,
                    value: d.UserAccountID
                }))
            } catch (err) {
                errorMsg(err)
                return []
            }
        },

        async fetchCoverage() {
            try {
                const res = await apiService.get('/api/operation-manager-coverage')
                return res.data.length ? res.data : []
            } catch (err) {
                errorMsg(err)
                return []
            }
        },


        // async fetchCases() { ... }
        // async fetchClientList() { ... }
    }
})
