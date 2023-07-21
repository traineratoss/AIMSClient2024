<script setup>
import { ref } from "vue";
import SidePanel from "../components/SidePanel.vue";
import IdeaCard from "../components/IdeaCard.vue";

const ideas = ref([{ text: "Ideea 1" }
]);

</script>

<template>
  
    <div class="idea-container" v-for="idea in ideas" :key="idea.text">
      <IdeaCard :title="idea.text"/>
    </div>
 
</template>

<style scoped>

.idea-container {
 display: flex;
 flex-direction: column;
 align-items: center;
}
</style>
