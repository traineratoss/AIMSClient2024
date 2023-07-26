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
let enableRepliesView = ref(false)

onMounted(async () => {
  currentUser.value = getCurrentUser();
  console.log(currentUser.value.username);
});

function showReplies() {
  console.log("Emit button was pressed from CustomComment");
  enableRepliesView =! enableRepliesView
  loadCommentReplies();
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

async function postReplyDynamic(username, parentId, commentText) {
  try {
    await postReply(username, parentId, commentText);
    await loadCommentReplies();
  } catch (error) {
    console.error("Error posting reply:", error);
  }
}
</script>

<template>
  <div v-if="!props.isReplay" class="container" >
    <div class="main-container">
      <div class="header-container">
        <p>{{ props.userName }}</p>
        <i class="elapsedTime">{{ props.elapsedTime }} ago </i>
      </div>

      <div class="comment-container">
        <textarea name="" id="contentTextArea" cols="30" rows="10" disabled>
         {{ props.text }}
      </textarea
        >
      </div>
      <div class="footer-container">
        <div class="left"></div>


        <div class="center">
          
          <button @click="showReplies()" id="expandPost" v-if="!enableRepliesView">
            <span class="material-symbols-outlined"> expand_more </span>
          </button>

          <button @click="showReplies()" class="showPostAction" v-if="enableRepliesView">
              <span class="material-symbols-outlined"> expand_less </span>
            </button>
          
        </div>


        <div class="right">
          <button class="showPostAction" @click="postToggle = !postToggle">
            <span class="material-symbols-outlined"> ink_pen </span>
          </button>
          <button class="showPostAction" @click="postToggle = !postToggle">
            <span class="material-symbols-outlined"> delete </span>
          </button>
        </div>
      </div>
    </div>
    <div class="input-container" v-if="postToggle">
      <textarea
        v-model="commentText"
        placeholder="Comment text."
        id="commentTextArea"
      >
      </textarea>
      <button
        id="postButton"
        @click="
          postReplyDynamic(currentUser.username, props.parentId, commentText)
        "
      >
        Post reply
      </button>
    </div>
  </div>
  <div v-else class="reply-container" >
    <div class="main-container">
      <div class="header-container">
        <p>{{ props.userName }}</p>
        <i class="elapsedTime">{{ props.elapsedTime }} ago </i>
      </div>

      <div class="">
        <textarea name="" id="replyContentTextArea" cols="30" rows="10" disabled>
        {{ props.text }}
      </textarea
        >
      </div>
      <div class="footer-container">
        <div class="left"></div>
        <div class="center"></div>
        <div class="right">
          <button class="showPostAction" @click="postToggle = !postToggle">
            <span class="material-symbols-outlined"> ink_pen </span>
          </button>
          <button class="showPostAction" @click="postToggle = !postToggle">
            <span class="material-symbols-outlined"> delete </span>
          </button>
        </div>
      </div>
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
  width: 30vw;
  min-height: 20vh;
  max-height: 45vh;
}
.reply-container{
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  border: 1px solid slategray;
  padding: 10px;
  margin-top: 5px;
  width: 30vw;
  max-height: 25vh;
}

.main-container {
  display: grid;
  grid-template-rows: 2rem 15vh 2rem;
}
.input-container {
  display: flex;
  min-height: 10vh;
  flex-direction: column;
}

#postButton {
  margin: 5px;
  align-self: flex-end;
}

.header-container {
  background-color: rgb(255, 255, 255);
  display: flex;
  justify-content: space-between;
  margin-right: 5px;
  margin-left: 5px;
  border-bottom: 1px solid #ffa941;
  align-items: center;
}

.footer-container {
  background-color: rgb(255, 255, 255);
  display: flex;
  justify-content: space-between;
}

.footer-container > button {
  align-self: center;
}

.footer-container > #expandPost {
  align-items: center;
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
}

.showPostAction {
  background-color: white;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

#expandPost {
  background-color: white;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}
.elapsedTime {
  margin-right: 5px;
}

textarea {
  resize: none;
  min-height: 10vh;
  width: 30vw;
  border: 1px solid rgba(0, 4, 8, 0.537);
  border-radius: 5px;
}
#commentTextArea {
  resize: none;
  min-height: 9vh;
  width: 29vw;
  border: 1px solid rgba(0, 4, 8, 0.537);
  border-radius: 5px;
  margin-left: 5px;
}

#contentTextArea {
  color: black;
  background-color: rgb(255, 255, 255);
  height: 18vh;
  width: 29vw;
  resize: none;
  border: none;
  margin: 1vh;
}

#replyContentTextArea{
  color: black;
  background-color: rgb(255, 255, 255);
  height: 12vh;
  width: 29vw;
  resize: none;
  border: none;
  margin: 1vh;
}
</style>
