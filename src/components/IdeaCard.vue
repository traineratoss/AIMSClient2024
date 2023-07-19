<!-- 
    FlorinCP
    Shall be either deleted of modified 
    It was created in order to assure better fiting for the components development
 -->

<!-- 
    The :key is not working !!!!
  -->

<script setup>
import { ref } from "vue";
import CustomComment from "../components/CustomComment.vue";

const props = defineProps({
  title: "",
});

const comments = ref([
  {
    commentText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    userName: "Gigel",
    hasReplies: true,
    replies: [{ commentText: "second reply", userName: "dan armeanca" }],
  },
  {
    commentText: "some comment text",
    userName: "Gigel",
    hasReplies: true,
    replies: [{ commentText: "first reply", userName: "dan armeanca" }],
  },
  { commentText: "just comment text", userName: "Crsiti", hasReplies: true },
]);

const showComments = ref(false);
</script>

<!-- 
    Generally speaking, v-if has higher toggle costs while v-show has higher initial render costs. 
    So prefer v-show if you need to toggle something very often, 
    and prefer v-if if the condition is unlikely to change at runtime.
 -->

<template>
  <div class="idea-card">
    <h1>{{ props.title }}</h1>
    <button @click="showComments = !showComments" class="showComments">
      ...
    </button>
  </div>
  <div
    class="comment-container"
    v-if="showComments"
    v-for="comment in comments"
    :key="comment.userName"
  >
    <CustomComment :text="comment.commentText" :userName="comment.userName" />
    <div class="reply-container" v-if="comment.hasReplies">
      <CustomComment :text="comment.replies" :userName="comment.userName" />
    </div>
  </div>
</template>

<style scoped>
.reply-container {
  max-width: 25vw;
  position: relative;
  left: 18%;
  margin-bottom: 30px;
}
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
  right: 45%;
  bottom: 5px;
  font-size: xx-large;
  border: none;
  background-color: unset;
}
</style>
