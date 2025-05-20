<template>
  <nav class="sidebar-menu">
    <ul>
      <template v-for="item in filteredMenu" :key="item.title">
        <li>
<!--          <RouterLink-->
<!--              v-if="!item.children?.length"-->
<!--              :to="{ name: item.route }"-->
<!--              class="menu-link"-->
<!--          >-->
<!--            <component :is="icons[item.icon]" class="icon" v-if="icons[item.icon]" />-->
<!--            {{ item.title }}-->
<!--          </RouterLink>-->

          <div class="menu-group">
            <div class="menu-group-title">
              <component :is="icons[item.icon]" class="icon" v-if="icons[item.icon]" />
              {{ item.title }}
            </div>
<!--            <ul>-->
<!--              <li v-for="child in getVisibleChildren(item)" :key="child.title">-->
<!--                <RouterLink :to="{ name: child.route }" class="menu-link child">-->
<!--                  {{ child.title }}-->
<!--                </RouterLink>-->
<!--              </li>-->
<!--            </ul>-->
          </div>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useScopeStore } from '@/stores/scope'
import { useAuthStore } from '@/stores/auth';
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

const userScopes = computed(() => scopeStore.scope || [])
const userType = computed(() => authStore.getUserType);

function hasAccess(item) {
  const scopesOk = !item.requiredScopes || item.requiredScopes.some(scope => userScopes.value.includes(scope))
  const typesOk = !item.requiredUserTypes || item.requiredUserTypes.includes(userType.value)
  return scopesOk && typesOk
}

const filteredMenu = computed(() =>
    menuItems.filter(item => {
      if (!hasAccess(item)) return false
      if (item.children) {
        item.children = item.children.filter(hasAccess)
        return item.children.length > 0
      }
      return true
    })
)

function getVisibleChildren(item) {
  return item.children?.filter(hasAccess) || []
}
</script>

<style scoped>
.sidebar-menu {
  padding: 1rem;
  background-color: #f4f4f4;
  height: 100%;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  color: #333;
  text-decoration: none;
}

.menu-link:hover {
  color: #007bff;
}

.menu-group {
  margin-top: 1rem;
}

.menu-group-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.icon {
  width: 18px;
  height: 18px;
  margin-right: 0.5rem;
}
.child {
  padding-left: 1.5rem;
}
</style>
