<script setup>
import CustomComment from "../components/CustomComment.vue";
import { ref, defineEmits, onMounted } from "vue";
import {
  loadComments,
  postComment,
  postReply,
} from "../services/comment.service";
import { getCurrentUser } from "../services/user_service";

const props = defineProps({
  title: "",
  text: "",
  status: "",
  user: "",
  ideaId: "",
});

onMounted(async () => {
  comments.value = await loadComments(4, 0, "id", props.ideaId);
  console.log(comments);
  currentUser.value = getCurrentUser();
  console.log(currentUser.value.username);
});

let comments = ref([]);
let commentText = ref([]);
let showComments = ref(false);
let someVariable = ref(false);
let currentUser = ref("");

function toggle() {
  console.log("function was accesed");
  someVariable.value = !someVariable.value;
  console.log(someVariable);
}
</script>

<template>
  <div class="container">
    <div class="idea-card">
      <button @click="showComments = !showComments" class="showComments">
        ...
      </button>
      <div class="something">
        <div class="author-info">Author: {{ props.user }}</div>
        <div class="title">Title: {{ props.title }}</div>
        <div class="text">Text: {{ props.text }}</div>

        <div class="status">
          Status:
          <!-- @TODO make handle bla bla function  -->
          <select v-model="props.status" @change="handleChangeStatus">
            <option value="open">Open</option>
            <option value="draft">Draft</option>
            <option value="implemented">Implemented</option>
          </select>
        </div>
      </div>

      <div class="buttons-container">
        <button class="edit-button" @click="editIdea">Edit</button>
        <router-link :to="`/viewidea`" class="view-button"> View </router-link>
        <router-link :to="`/delete`" class="delete-button">
          Delete
        </router-link>
      </div>
      <img
        class="idea-image"
        src="https://play-lh.googleusercontent.com/5MTmOL5GakcBM16yjwxivvZD10sqnLVmw6va5UtYxtkf8bhQfiY5fMR--lv1fPR1i2c=w240-h480-rw"
        alt="image"
      />
      <div class="input-container">
        <input type="text" v-model="commentText" />
        <button
          @click="postComment(currentUser.username, props.ideaId, commentText)"
        >
          Post comment
        </button>
      </div>
    </div>
    <div
      class="comment-container"
      v-if="showComments"
      v-for="comment in comments"
      :key="comment.userName"
    >
      <CustomComment
        :text="comment.commentText"
        :userName="comment.userName"
        :hasReplies="comment.hasReplies"
        @showReplies="toggle()"
      />

      <div
        class="reply-container"
        v-if="someVariable"
        v-for="commentReply in comment.replies"
      >
        <CustomComment
          :parentId="comment.id"
          :text="commentReply.commentText"
          :userName="commentReply.userName"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-container {
  position: absolute;
  bottom: 25px;
  left: 40px;
  background-color: white;
  color: black;
  border: 1px solid rgb(93, 93, 93);
}
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
  height: 45vh;
  border: 7px solid #c8c0c0;
}
.author-info {
  position: absolute;
  bottom: 65px;
  right: 50px;
  font-size: 14px;
  font-weight: bold;
  color: black;
}
.number-of-comments {
  position: absolute;
  bottom: 95px;
  right: 50px;
  font-size: 14px;
  font-weight: bold;
  color: black;
}
.title {
  font-weight: bold;
  font-size: 14px;
  margin: 25px 0 0 20px;
}
.text {
  font-weight: bold;
  font-size: 14px;
  margin: 5px 0 0 20px;
}
.status {
  font-weight: bold;
  font-size: 14px;
  margin: 5px 0 0 20px;
}
.edit-button,
.view-button,
.delete-button {
  position: absolute;
  bottom: 65px;
  left: 10px;
  font-weight: bold;
  font-size: 14px;
  padding: 5px 10px;
  background-color: white;
  color: black;
  border: 1px solid black;
  cursor: pointer;
  transition: border-width 0.2s;
}
.view-button {
  left: 70px;
}
.delete-button {
  left: 135px;
}
.edit-button:hover,
.view-button:hover,
.delete-button:hover {
  background-color: #ffa941;
}
.edit-button:active,
.view-button:active,
.delete-button:active {
  border-width: 3px;
}
.idea-image {
  position: absolute;
  top: 30px;
  right: 45px;
  width: 80px;
  height: 80px;
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
