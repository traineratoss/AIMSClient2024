<template>
  <div class="pagination-container">
    <span
      v-for="pageNumber in pageNumbers"
      :key="pageNumber"
      :class="{ 'page-number': true, active: pageNumber === currentPage }"
      @click="goToPage(pageNumber)"
    >
      {{ pageNumber }}
    </span>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, onMounted } from "vue";

const props = defineProps(["currentPage", "totalPages"]);
const emit = defineEmits(["changePage"]);

const localTotalPages = ref(props.totalPages);
const pageNumbers = ref([]);

watch(
  () => props.totalPages,
  (newValue) => {
    localTotalPages.value = newValue;
    generatePageNumbers();
    console.log("localTotalPages updated: " + localTotalPages.value);
  }
);

onMounted(() => {
  generatePageNumbers();
});

function generatePageNumbers() {
  const numbers = [];
  for (let i = 1; i <= localTotalPages.value; i++) {
    numbers.push(i);
  }
  pageNumbers.value = numbers;
  console.log("Page numbers generated: " + pageNumbers.value);
}

function goToPage(pageNumber) {
  console.log("goToPage called with pageNumber: " + pageNumber);
  emit("changePage", pageNumber);
}
</script>

<style>
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.page-number {
  display: inline-block;
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #000;
  border-radius: 999px;
  background-color: transparent;
  cursor: pointer;
}

.page-number.active {
  background-color: #000;
  color: #fff;
}

.page-number:hover {
  background-color: #000;
  color: #fff;
}

.current-page {
  background-color: #000;
  color: #fff;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 999px;
  cursor: pointer;
}

.current-page:hover {
  text-decoration: underline;
}
</style>
