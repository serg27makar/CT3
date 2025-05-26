<template>
  <div class="main-search-wrapper">
    <div class="main-search d-flex">
      <StDropdown
          v-model="category"
          :options="options"
          placeholder="Select Category"
          width="20rem"
      />
      <input
          class="input-control ml-4"
          v-model="search"
          @keydown.enter.prevent="emitSearch"
          @blur="emitSearch"
          placeholder="Search"
      />
      <i class="ri-search-2-line search-icon" @click="searchItem"/>
    </div>
  </div>

</template>

<script setup>
import { ref, watch } from 'vue'
import StDropdown from "@/components/ui/StDropdown.vue";
// import { useSearchStore } from '@/stores/search'

// // const store = useSearchStore()
// const category = ref(store.category)
// const search = ref(store.item)
const category = ref("")
const search = ref("")

const options = [
  { value: 'Internal Number', text: 'Internal Number' },
  { value: 'Claim Number', text: 'Claim Number' },
  { value: 'Subject', text: 'Subject' },
  { value: 'Requestor', text: 'Requestor' },
]

watch(category, val => {
  console.log(val)
})
// watch(category, val => store.setCategory(val))
// watch(search, val => store.setItem(val))
//
function emitSearch() {
  // if (category.value) store.search()
}

const searchItem = (val) => {
  console.log(val)
}
</script>

<style lang="scss">
.main-search-wrapper {
  width: 60%;
  justify-content: left;
}
.main-search {
  width: 80%;
  min-width: 30rem;
  justify-content: space-around;
}
.dark .input-control {
  color: #eee;
  background: #3c3c3c;
}
.input-control {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.35rem;
  background: white;
  width: 100%;
}
.search-icon {
  position: relative;
  font-size: 1.5rem;
  font-weight: bold;
  padding-left: 1rem;
  color: white;
}

</style>