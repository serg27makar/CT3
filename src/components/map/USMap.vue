<template>
  <div class="usa-map-container">
    <input
        v-model="searchQuery"
        @input="highlightState"
        placeholder=""
        class="form-control mb-3"
    />

    <svg
        viewBox="0 0 959 593"
        class="usa-map"
        xmlns="http://www.w3.org/2000/svg"
    >
      <g v-html="usMapSvg" @click="handleClick"></g>
    </svg>

    <p v-if="selectedState" class="mt-3">
      State: <strong>{{ selectedState }}</strong>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {StatesList} from "@/core/constant.js";

const selectedState = ref('');
const highlightedState = ref('');
const searchQuery = ref('');
const usMapSvg = ref('');

onMounted(async () => {
  const response = await fetch('./src/assets/images/us.svg');
  usMapSvg.value = await response.text();
});

function handleClick(event) {
  const stateId = event.target.id;
  console.log(event.target);
  if (stateId) {
    selectedState.value = getStateNameById(stateId);
    highlightedState.value = stateId;
    highlightSvgState(stateId);
  }
}

function highlightState() {
  const input = searchQuery.value.toLowerCase();
  const state = getStateByName(input);
  if (state) {
    highlightedState.value = state.id;
    highlightSvgState(state.id);
  } else {
    highlightedState.value = '';
    clearSvgHighlights();
  }
}

function getStateNameById(id) {
  const state = states.find((s) => s.id === id);
  return state ? state.name : '';
}

function getStateByName(name) {
  return states.find((s) => s.name.toLowerCase() === name);
}

function highlightSvgState(stateId) {
  clearSvgHighlights();
  const svgElement = document.getElementById(stateId);
  if (svgElement) {
    svgElement.style.fill = '#ffc107';
  }
}

function clearSvgHighlights() {
  states.forEach((state) => {
    const svgElement = document.getElementById(state.id);
    if (svgElement) {
      svgElement.style.fill = '#fff';
    }
  });
}

const states = StatesList.map((state) => {
  return {id: state}
});

</script>

<style scoped>
.usa-map {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: block;
}
</style>
