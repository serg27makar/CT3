<template>
  <ul :class="className" :id="idName">
    <li
        v-for="(item, index) in items"
        :key="index"
        :class="activeLink(item) && item.children && item.is_heading ? 'iq-menu-title active' : activeLink(item) ? 'active' : ''"
    >
      <i v-if="item.is_heading && hideListMenuTitle" class="ri-subtract-line" />
      <span v-if="item.is_heading">{{ $t(item.name) }}</span>
      <router-link
          :to="item.link"
          v-if="!item.is_heading"
          :class="`iq-waves-effect`"
      >
        <span>{{ item.title }}</span>
        <template v-if="item.children && enableIcon">
          <template v-if="enableCustomIcon">
            <i :class="item.expanded_icon_class"></i>
            <i :class="item.collapse_icon_class"></i>
          </template>
          <i v-else class="ri-arrow-right-s-line iq-arrow-right" />
        </template>
        <small
            v-html="item.append"
            v-if="hideListMenuTitle"
            :class="item.append_class"
        />
      </router-link>
      <List
          v-if="item.children"
          :items="item.children"
          :sidebarGroupTitle="hideListMenuTitle"
          :idName="item.name"
          :className="`iq-submenu ${item.class_name}`"
      />
    </li>
  </ul>
</template>

<script setup>
import { computed } from 'vue';
import List from './CollapseMenu.vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  className: {
    type: String,
    default: 'iq-menu d-flex',
  },
  open: {
    type: Boolean,
    default: false,
  },
  idName: {
    type: String,
    default: 'iq-sidebar-toggle',
  },
  sidebarGroupTitle: {
    type: Boolean,
    default: true,
  },
  enableCustomIcon: {
    type: Boolean,
    default: false,
  },
  enableIcon: {
    type: Boolean,
    default: true,
  },
});

const hideListMenuTitle = computed(() => props.sidebarGroupTitle);

const activeLink = (item) => {
  // return core.getActiveLink(item, useRoute().name);
};
</script>

<style scoped>

</style>
