<script setup>
import { ref, computed, defineProps } from "vue";
import IdeaCard from "./IdeaCard.vue";
import loadPagedIdeas from "../services/idea.service.js";

const props = defineProps(["ideas"]); // Receive the 'ideas' prop from the parent component

const pageSize = ref(2); // Set the desired page size here
const currentPage = ref(1); // Set the current page number here

const displayedIdeas = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return props.ideas.slice(startIndex, endIndex);
});

const totalPages = computed(() =>
  Math.ceil(props.ideas.length / pageSize.value)
);

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
}

let data = ref([]);

</script>

<template>
  <div>
    <div v-for="idea in displayedIdeas" :key="idea.text" class="idea-container">
      <IdeaCard :title="idea.text" />
    </div>
    <div class="list-buttons">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span> Page {{ currentPage }} of {{ totalPages }} </span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Next
      </button>
    </div>
  </div>
  <div class="pagination"></div>
</template>

<style scoped>
.idea-container {
  display: flex;
  justify-content: center;
  position: relative;
}
.list-buttons {
  position: absolute;
}
</style>
