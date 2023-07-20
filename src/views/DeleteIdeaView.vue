<template>
    <div class="delete-idea-view">
      <h1>Delete Your Idea</h1>
      <div>
        <p>Title: {{ ideaTitle }}</p>
        <p>Status: {{ status }}</p>
        <p>Category: {{ category }}</p>
      </div>
      <p>Idea Text: {{ ideaText }}</p>
      <button @click="deleteIdea">Delete</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  
  const router = useRouter();
  
  const ideaTitle = ref(""); 
  const status = ref(""); 
  const category = ref(""); 
  const ideaText = ref(""); 
  
  function deleteIdea() {
    router.push("/"); 
  }
  </script>
  
  <style scoped>
    /* STYLES */
  </style>
  