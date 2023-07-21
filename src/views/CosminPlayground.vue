<script setup>
import { ref } from "vue";
import IdeaCard from "../components/IdeaCard.vue";
import { loadPagedIdeas } from "../services/idea.service";
const ideas = ref([{ text: "Ideea 1" }
]);

</script>

<template>
  
    <div class="idea-container" v-for="idea in ideas" :key="idea.text">
      <IdeaCard :title="idea.text"/>
      <button @click="loadPagedIdeas(5,0,'ideaId','ASC')">LOAD ALL PAGED IDEAS</button>
    </div>
 
</template>

<style scoped>

.idea-container {
 display: flex;
 flex-direction: column;
 align-items: center;
}
</style>
