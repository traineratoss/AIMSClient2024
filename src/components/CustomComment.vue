<script setup>
import { ref, onMounted } from "vue";
import {
  loadComments,
  postReply,
  loadReplies,
} from "../services/comment.service";
import { getCurrentUser } from "../services/user_service";

const props = defineProps({
  text: "",
  creationDate: "",
  userName: "",
  userId: "",
  ideaId: "",
  hasReplies: "",
  parentId: "",
  isReplay: "",
  elapsedTime: "",
  parentId: "",
  isReplay: "",
  elapsedTime: "",
});

const emits = defineEmits(["showReplies", "loadComments", "loadReplies"]);

let postToggle = ref(false);
let currentUser = ref("");
let commentReplies = ref([]);

onMounted(async () => {
  currentUser.value = getCurrentUser();
  console.log(currentUser.value.username);
});

function showReplies() {
  console.log("Emit button was pressed from CustomComment");
  emits("showReplies");
}

function loadParentComments() {
  console.log("loading order has been sent");
  emits("loadComments");
}

async function loadCommentReplies() {
  console.log("incercam sa trimitem reply");
  emits("loadReplies");
}
</script>

<template>
  <div class="container">
    <!-- <div class="main-container">
      <div class="header-container">
        <p>{{ props.userName }}</p>
        <div class="subheader-container">
          <i class="elapsedTime">{{ props.elapsedTime }} ago </i>
          <div class="righ-side">
            <span class="material-symbols-outlined"> menu </span>
          </div>
        </div>
      </div>
      <div class="comment-container">
        {{ props.text }}
      </div>
      <div class="footer-container">
        <span class="material-symbols-outlined"> ink_pen </span>
        <button @click="showReplies()" class="showPostAction"><span class="material-symbols-outlined"> expand_more </span></button>
        <span class="material-symbols-outlined"> expand_less </span>
        
        <span class="material-symbols-outlined"> visibility </span>
        <span class="material-symbols-outlined"> visibility_off </span>
        <button class="showPostAction" @click="postToggle = !postToggle">
          <span class="material-symbols-outlined"> ink_pen </span>
        </button>
      </div>
    </div> -->
    <button class="showPostAction" @click="postToggle = !postToggle">
          <span class="material-symbols-outlined"> ink_pen </span>
        </button>
    <div class="input-container" v-if="!props.isReplay && postToggle">
      <input type="text" v-model="commentText" />
      <button
        @click="
          postReply(currentUser.username, props.parentId, commentText);
          loadParentComments();
        "
      >
        Post reply
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  border: 1px solid slategray;
  padding: 10px;
  margin-top: 5px;
  max-width: 30vw;
  min-height: 20vh;
  max-height: 30vh;
}
.main-container {
  display: grid;
  grid-template-rows: 2rem auto 2rem;
}
.input-container{
  background-color: rgb(255, 255, 255);
}
.header-container {
  display: flex;
  justify-content: space-between;
  margin-right: 5px;
  margin-left: 5px;
  border-bottom: 1px solid #ffa941;
}
.subheader-container {
  display: flex;
  justify-content: space-between;
  margin-right: 5px;
  margin-left: 5px;
}
.footer-container {
  color: #ff8c00;
}

.header-container > i {
  margin-right: 10px;
}
.reply-container {
  max-width: 25vw;
  position: relative;
  left: 40px;
  margin-bottom: 30px;
}
.showReplies {
  color: orange;
  position: relative;
  left: 150px;
  top: 15px;
  font-size: 410%;
  border: none;
  background-color: unset;
}
.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
}

.showPostAction{
	background-color: white;
	border: none;
	padding: 0;
	font: inherit;
	cursor: pointer;
	outline: inherit;
}

</style>
