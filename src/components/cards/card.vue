<template>
  <div :class="['card', props.className]">
    <slot name="cardImage" />

    <div v-if="hasHeaderTitleSlot || hasHeaderActionSlot" :class="['card-header d-flex justify-content-between', props.headerClass]">
      <div class="header-title">
        <slot name="headerTitle" />
      </div>
      <div class="card-header-toolbar d-flex align-items-center">
        <slot name="headerAction" />
      </div>
    </div>

    <div v-if="hasBodySlot" :class="['card-body', props.bodyClass]">
      <slot name="body" />
    </div>

    <slot />

    <div v-if="hasFooterSlot" :class="['card-footer', props.footerClass]">
      <slot name="footer" />
    </div>
  </div>
</template>
<script setup>
import { useSlots } from 'vue';

const props = defineProps({
  className: { type: String, default: '' },
  bodyClass: { type: String, default: '' },
  headerClass: { type: String, default: '' },
  footerClass: { type: String, default: '' }
});

const slots = useSlots();
const hasHeaderTitleSlot = !!slots.headerTitle;
const hasHeaderActionSlot = !!slots.headerAction;
const hasBodySlot = !!slots.body;
const hasFooterSlot = !!slots.footer;
</script>

