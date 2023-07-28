<script setup>
import { ref, onMounted, computed } from "vue";
import IdeaCard from "../components/IdeaCard.vue";
import { loadPagedIdeas } from "../services/idea.service";
import { getCurrentUser } from "../services/user_service";

let ideas = ref([]);
let currentUser = ref("");
const pagesPerView = 2;
const pageNumber = ref(0);

onMounted(async () => {
  ideas.value = await loadPagedIdeas(
    pagesPerView,
    pageNumber.value,
    "title",
    "ASC"
  );
  console.log(ideas.value);
  currentUser.value = getCurrentUser();
  console.log(currentUser.value);
});

async function loadNextPage() {
  pageNumber.value = pageNumber.value + 1;
  ideas.value = await loadPagedIdeas(
    pagesPerView,
    pageNumber.value,
    "title",
    "ASC"
  );
}

async function loadPreviousPage() {
  pageNumber.value = pageNumber.value - 1;
  ideas.value = await loadPagedIdeas(
    pagesPerView,
    pageNumber.value,
    "title",
    "ASC"
  );
}
</script>

<template>
  <div class="idea-container" v-for="idea in ideas" :key="idea.title">
    <IdeaCard
      :title="idea.title"
      :text="idea.text"
      :status="idea.status"
      :username="idea.username"
      :ideaId="idea.id"
    />
  </div>
  <button @click="loadNextPage">Next</button>
  <button @click="loadPreviousPage">Previous</button>
</template>

<style scoped>
.idea-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
