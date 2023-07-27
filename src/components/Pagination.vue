<template>
    <div class="pagination-container">
        <span
          v-if="currentPage !== 1 && totalPages > 1"
          class="page-number arrow"
          @click="goToPage(1)"
        >
        <span class="material-symbols-outlined">
          keyboard_double_arrow_left
        </span>
        </span>
        <span
          v-if="currentPage > 2"
          class="page-number arrow"
          @click="goToPage(currentPage - 1)"
        >
        <span class="material-symbols-outlined">
          navigate_before
        </span>
        </span>
        <span class="page-number current-page">
          {{ currentPage }}
        </span>
        <span
          v-if="currentPage < totalPages - 1"
          class="page-number arrow"
          @click="goToPage(currentPage + 1)"
        >
        <span class="material-symbols-outlined">
          navigate_next
        </span>
        </span>
        <span
          v-if="currentPage !== totalPages && totalPages > 1"
          class="page-number arrow"
          @click="goToPage(totalPages)"
        >
        <span class="material-symbols-outlined">
          keyboard_double_arrow_right
        </span>
        </span>
      </div>
</template>

<script setup>

import { ref, computed, defineProps } from "vue";

const props = defineProps(["ideas"]);
const ideasPerPage = 2;
const currentPage = ref(1);

const paginatedIdeas = computed(() => {
  const startIndex = (currentPage.value - 1) * ideasPerPage;
  return ideas.value.slice(startIndex, startIndex + ideasPerPage);
});

const totalPages = computed(() => Math.ceil(ideas.value.length / ideasPerPage));

function goToPage(pageNumber) {
  currentPage.value = pageNumber;
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

.arrow {
  cursor: pointer;
}

.arrow:hover {
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