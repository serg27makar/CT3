<template>
  <div>
    <div class="search-toggle cursor-pointer" @click="toggleNotification">
      <i class="ri-notification-3-line"></i>
      <span v-if="Notifications && Notifications.length" class="badge badge-primary count-mail rounded-circle">{{ Notifications.length }}</span>
      <span class="bg-primary"></span>
    </div>
    <div v-if="showNotification" class="iq-sub-dropdown dropdown-menu">
      <div class="card shadow-none m-0">
        <div class="card-body p-0 ">
          <div class="p-2 notification-bar">
            <div class="row notification-dismiss-all m-0">
              <div class="col-lg-12">
                <span
                  class="cursor-pointer"
                  @click="dismissAll"
                >
                  Dismiss All
                </span>
              </div>
            </div>
            <div class="notification-block">
              <div v-if="!Notifications.length" class="notification-item">You don't have any notifications yet</div>
              <div
                v-for="Notification in Notifications"
                :key="Notification.NotificationID"
                class="row m-0"
              >
                <div class="col-lg-12 notification-item">
                  <span>
                    <span class="bell-icon">
                      <i class="las la-bell"></i>
                    </span>
                    <span class="title-notification">
                      {{ Notification.NotificationTitle }}
                    </span>
                    <span class="float-right notification-date">
                      <span class="pr-1">
                        {{ dateFormat(Notification.Timestamp) }}
                      </span>
                      <span
                        class="close-btn"
                        @click.prevent="closeNotificationToId(Notification.NotificationID)"
                      >
                        +
                      </span>
                    </span>
                  </span>
                  <div
                    v-if="Notification.OnClickURL"
                    class="pl-3 text-notification"
                  >
                    <router-link
                      :to="'/' + Notification.OnClickURL"
                      target="_blank"
                      style="white-space: pre-line"
                    >
                      {{ Notification.NotificationText }}
                    </router-link>
                  </div>
                  <div
                    v-else
                    class="pl-3 text-notification"
                    style="white-space: pre-line"
                  >
                    {{ Notification.NotificationText }}
                  </div>
                  <div
                    v-if="Notification.URLReference"
                    class="pl-3 text-notification"
                  >
                    <a
                      :href="Notification.URLReference"
                      target="_blank"
                    >
                      Additional info…
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useNotificationStore } from "@/stores/notifications";

export default {
  name: "Notifications",
  setup() {
    const showNotification = ref(false);
    const notificationStore = useNotificationStore();
    const Notifications = computed(() => notificationStore.getNotifications);

    const toggleNotification = () => {
      showNotification.value = !showNotification.value;
    };

    const dismissAll = async () => {
      await notificationStore.dismissAll();
      await notificationStore.fetchNotifications();
    };

    const closeNotificationToId = async (notificationId) => {
      await notificationStore.dismissNotification(notificationId);
      await notificationStore.fetchNotifications();
    };

    onMounted(() => {
      notificationStore.fetchNotifications();
      setInterval(notificationStore.fetchNotifications, 60000);
    });

    const dateFormat = (val) => {
      const inputVal = new Date(val)
      const currentTime = new Date();
      const inputTime = new Date(inputVal.getTime() - (inputVal.getTimezoneOffset() * 60000));

      const differentMs = (currentTime - inputTime);
      const different = Math.floor(differentMs / 60000);

      const day = Math.floor(different / 1440);
      const hours = Math.floor((different - day * 1440) / 60);
      const minutes = Math.floor((different - hours * 60));

      const output = day ? day + (day === 1 ? " day " : " days ") : hours ? hours + " hours " : minutes + " minutes "

      return output + "ago"
    };

    return {
      Notifications,
      showNotification,
      toggleNotification,
      dismissAll,
      closeNotificationToId,
      dateFormat,
    };
  },
};

</script>

<style scoped>
@import "../styles/styles.css";
</style>