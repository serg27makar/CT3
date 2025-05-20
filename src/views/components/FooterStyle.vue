<template>
  <div v-if="sessionStart && isLoggedIn" class="d-flex justify-content-between w-100 p-1">
    <div>
      Session-Time: {{ hours }} hours {{ minutes }} mins
    </div>
    <div>
      Last Login: {{ formattedSessionStart }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import moment from 'moment'

const authStore = useAuthStore()

const sessionStart = ref(null)
const timeAlive = ref(0)

const isLoggedIn = computed(() => authStore.isLoggedIn)

const formattedSessionStart = computed(() =>
    sessionStart.value
        ? moment(sessionStart.value).format('MMMM Do, hh:mm A')
        : ''
)

onMounted(() => {
  setInterval(() => {
    sessionStart.value = authStore.sessionStart
    if (sessionStart.value) {
      timeAlive.value = Date.now() - new Date(sessionStart.value).getTime()
    }
  }, 1000)
})

const hours = computed(() =>
    sessionStart.value ? Math.trunc(timeAlive.value / (1000 * 60 * 60)) : 0
)
const minutes = computed(() =>
    sessionStart.value ? Math.trunc((timeAlive.value / (1000 * 60)) % 60) : 0
)
</script>

<style scoped>
</style>
