<template>
    <div>
      <IdeaCard
        v-for="idea in ideas"
        :key="idea.id"
        :title="idea.title"
        @delete-idea="handleDeleteIdea(idea.title)"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";

    const ideas = ref([{},{},{}]);
  
  // delete function
  const handleDeleteIdea = (title) => {
    const index = ideas.value.findIndex((idea) => idea.title === title);
    if (index !== -1) {
      ideas.value.splice(index, 1);
    }
  };
  </script>
  
  <style scoped>
     /* need to add styles */
  </style>
  