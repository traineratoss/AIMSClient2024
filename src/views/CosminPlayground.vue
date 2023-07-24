<script setup>
import { ref,onMounted } from "vue";
import IdeaCard from "../components/IdeaCard.vue";
import { loadPagedIdeas } from "../services/idea.service";
import { getCurrentUser } from "../services/user_service";

let ideas = ref([]);
let currentUser = ref('')

onMounted(async () => {
  ideas.value =  await loadPagedIdeas(4, 0, 'title', 'ASC')
  console.log(ideas.value)
  currentUser.value = getCurrentUser()
  console.log(currentUser.value)
});


</script>

<template>
  
  <!-- Implement store for getting user  -->
    <div class="idea-container" v-for="idea in ideas" :key="idea.title">
      <IdeaCard 
      :title="idea.title"
      :text ="idea.text"
      :status="idea.status"
      :user="idea.user"
      :ideaId="idea.id"
      />
      <button @click="loadIdeas">LOAD ALL PAGED IDEAS</button>
    </div>
 
</template>

<style scoped>

.idea-container {
 display: flex;
 flex-direction: column;
 align-items: center;
}
</style>
