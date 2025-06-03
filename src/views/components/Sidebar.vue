<template>
  <nav class="sidebar-menu">
    <ul class="list-style-none">
      <template v-for="item in filteredMenu" :key="item.title">
        <li :class="{ active: isActiveRoute(item.route) }" >
          <RouterLink
              v-if="!item.children?.length"
              :to="'/' + item.route"
              class="menu-link"

          >
            <component :is="icons[item.icon]" class="icon" v-if="icons[item.icon]" />
            {{ item.title }}
          </RouterLink>

          <div v-else class="menu-group">
            <div class="menu-group-title" @click="toggleGroup(item.title)">
              <component :is="icons[item.icon]" class="icon" v-if="icons[item.icon]" />
              {{ item.title }}
              <span class="arrow">{{ openGroups.includes(item.title) ? '▾' : '▸' }}</span>
            </div>

            <transition name="slide-fade">
              <ul v-show="openGroups.includes(item.title)" class="list-style-none child-menu">
                <li
                    v-for="child in getVisibleChildren(item)"
                    :key="child.title"
                    :class="{ active: isActiveRoute(child.route) }"
                >
                  <RouterLink
                      :to="'/' + child.route"
                      class="menu-link child"
                  >
                    {{ child.title }}
                  </RouterLink>
                </li>
              </ul>
            </transition>

          </div>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useScopeStore } from '@/stores/scope'
import { useAuthStore } from '@/stores/auth'
import menuItems from '@/layouts/menuItems/menuItems.js'

import {
  HomeIcon, FolderIcon, CalendarIcon, FileIcon,
  CreditCardIcon, EyeIcon, UserCheckIcon, UsersIcon
} from 'lucide-vue-next'

const icons = {
  HomeIcon,
  FolderIcon,
  CalendarIcon,
  FileIcon,
  CreditCardIcon,
  EyeIcon,
  UserCheckIcon,
  UsersIcon
}

const scopeStore = useScopeStore()
const authStore = useAuthStore()
const route = useRoute()

const userScopes = computed(() => scopeStore.scope || [])
const userType = computed(() => authStore.getUserType)

function hasAccess(item) {
  const scopesOk = !item.requiredScopes || item.requiredScopes.some(scope => userScopes.value.includes(scope))
  const typesOk = !item.requiredUserTypes || item.requiredUserTypes.includes(userType.value)
  return scopesOk && typesOk
}

const openGroups = ref([])

function toggleGroup(title) {
  if (openGroups.value.includes(title)) {
    openGroups.value = []
  } else {
    openGroups.value = [title]
  }
}

function isActiveRoute(path) {
  return route.path === '/' + path
}

const filteredMenu = computed(() =>
    menuItems
        .map(item => {
          if (!hasAccess(item)) return null
          const children = item.children?.filter(hasAccess) || []
          return children.length || !item.children
              ? { ...item, children }
              : null
        })
        .filter(Boolean)
)

function getVisibleChildren(item) {
  return item.children?.filter(hasAccess) || []
}
</script>

<style scoped>
@import "./styles/styles.css";
</style>
