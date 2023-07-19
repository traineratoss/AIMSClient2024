<!-- 
    FlorinCP
    Shall be either deleted of modified 
    It was created in order to assure better fiting for the components development

 -->
<script setup>
import { ref } from "vue";
import CustomComment from "../components/CustomComment.vue";

const comments = ref([
  { commentText: "some comment text" },
  { commentText: "just comment text" },
]);
</script>

<template>
  <div class="idea-card">
    <h1>Idea Card</h1>
    <button class="showComments">Show Comments</button>
  </div>
  <div class="comment-container" v-for="comment in comments">
    <CustomComment :text="comment.commentText" />
  </div>
</template>

<style scoped>
.idea-card {
  position: relative;
  background-color: white;
  width: 30vw;
  height: 25vh;
  border: 1px solid black;
}
.showComments {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 40%;
  bottom: 5px;
}
</style>
