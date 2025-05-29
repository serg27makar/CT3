<template>
  <Teleport to="body">
    <TransitionGroup
      tag="div"
      name="notifications"
      class="notifications"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="`notification--${notification.type}`"
      >
        <div class="notification__content">
          <div v-if="notification.title" class="notification__title">
            {{ notification.title }}
          </div>
          <div class="notification__message">
            {{ notification.message }}
          </div>
        </div>
        <button
          v-if="notification.closable"
          class="notification__close"
          @click="removeNotification(notification.id)"
        >
          <span class="sr-only">Закрыть</span>
          <svg
            class="notification__close-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const notifications = computed(() => appStore.notifications)

const removeNotification = (id) => {
  appStore.removeNotification(id)
}
</script>

<style lang="scss" scoped>
.notifications {
  position: fixed;
  top: $spacing-4;
  right: $spacing-4;
  z-index: $z-index-tooltip;
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  max-width: 400px;
  pointer-events: none;
}

.notification {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  padding: $spacing-4;
  border-radius: $border-radius-lg;
  background-color: var(--background-secondary);
  box-shadow: $shadow-lg;
  transition: $transition-base;

  &--success {
    background-color: rgba($success, 0.1);
    color: $success;
  }

  &--error {
    background-color: rgba($danger, 0.1);
    color: $danger;
  }

  &--warning {
    background-color: rgba($warning, 0.1);
    color: $warning;
  }

  &--info {
    background-color: rgba($info, 0.1);
    color: $info;
  }

  &__content {
    flex: 1;
    margin-right: $spacing-4;
  }

  &__title {
    font-weight: $font-weight-semibold;
    margin-bottom: $spacing-1;
  }

  &__message {
    font-size: $font-size-sm;
    line-height: $line-height-base;
  }

  &__close {
    background: none;
    border: none;
    padding: $spacing-1;
    cursor: pointer;
    color: currentColor;
    opacity: 0.6;
    transition: $transition-base;

    &:hover {
      opacity: 1;
    }
  }

  &__close-icon {
    width: 16px;
    height: 16px;
  }
}

.notifications-enter-active,
.notifications-leave-active {
  transition: all 0.3s ease;
}

.notifications-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notifications-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.notifications-move {
  transition: transform 0.3s ease;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style> 