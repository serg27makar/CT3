import { defineStore } from 'pinia';
import { ref, computed } from "vue";
import APIService from '@/core/utils/APIService';
import {toast} from "vue3-toastify";
import axios from "axios";

const apiService = new APIService();

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref([]);

    async function fetchNotifications() {
        try {
            const response = await axios.get('/api/notifications/user');
            notifications.value = response.data;
        } catch (error) {
            toast.error('Error fetching notifications:', error);
        }
    }

    async function dismissAll() {
        try {
            await apiService.post('notifications/aknowledge');
            notifications.value = [];
        } catch (error) {
            toast.error('Error dismissing all notifications:', error);
        }
    }

    async function dismissNotification(notificationId) {
        try {
            notifications.value = notifications.value.filter(n => n.NotificationID !== notificationId);
            await apiService.post(`notifications/aknowledge?notificationId=${notificationId}`);
        } catch (error) {
            toast.error('Error dismissing notification:', error);
        }
    }

    return {
        notifications,
        fetchNotifications,
        dismissAll,
        dismissNotification,
        getNotifications: computed(() => notifications.value),
    }
});
