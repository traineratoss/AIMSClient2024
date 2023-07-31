<template>
  <div class="pagination-container">
    <span
      v-for="pageNumber in generatePageNumbers()"
      :key="pageNumber"
      :class="{ 'page-number': true, active: pageNumber === currentPage }"
      @click="goToPage(pageNumber)"
    >
      {{ pageNumber }}
    </span>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const { currentPage, totalPages } = defineProps(["currentPage", "totalPages"]);
const emit = defineEmits(["changePage"]);

function generatePageNumbers() {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return pageNumbers;
}

function goToPage(pageNumber) {
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
