<template>
  <ul :class="className" :id="idName">
    <li v-for="(item, index) in items" :key="index" :class="getItemClass(item)">
      <router-link
          :to="item.link"
          v-if="!item.is_heading"
          :class="getLinkClass(item)"
          v-b-toggle="item.name"
      >
        <i v-if="item.name && hideListMenuTitle" :class="item.icon_class || ''"></i>
        <template v-else v-html="item.icon"></template>
        <span>{{ item.title }}</span>
        <i v-if="item.children" :class="item.expanded_icon_class" />
        <i v-if="item.children" :class="item.collapse_icon_class" />
        <small v-html="item.append" v-if="hideListMenuTitle" :class="item.append_class" />
      </router-link>
      <List
          v-if="item.children"
          :items="item.children"
          :sidebarGroupTitle="hideListMenuTitle"
          :open="isActiveLink(item)"
          :idName="item.name"
          :accordianName="`sidebar-accordion-${item.class_name}`"
          :className="`iq-submenu ${item.class_name}`"
      />
    </li>
  </ul>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import List from './CollapseMenu.vue';

const route = useRoute();

const props = defineProps({
  items: Array,
  className: { type: String, default: 'iq-menu' },
  open: { type: Boolean, default: false },
  idName: { type: String, default: 'sidebar' },
  accordianName: { type: String, default: 'sidebar' },
  sidebarGroupTitle: { type: Boolean, default: true }
});

const hideListMenuTitle = computed(() => props.sidebarGroupTitle);

const isActiveLink = (item) => {
  const activeRoute = route.name
  let active = false
  if (item.children !== undefined) {
    item.children.filter(function (child) {
      if (child.link.name === activeRoute) {
        active = true
      }
      if (child.children !== undefined) {
        child.children.filter(function (inChild) {
          if (inChild.link.name === activeRoute) {
            active = true
          }
        })
      }
    })
  } else {
    if (item.link.name === activeRoute) {
      active = true
    }
  }
  return active
}

const getItemClass = (item) => {
  return isActiveLink(item) && item.children ? 'active' : isActiveLink(item) ? 'active' : '';
};

const getLinkClass = (item) => {
  return `iq-waves-effect ${isActiveLink(item) && item.children ? 'active' : isActiveLink(item) ? 'active' : ''}`;
};
</script>

<style scoped>
</style>
