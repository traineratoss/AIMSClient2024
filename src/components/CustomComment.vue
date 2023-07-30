<script setup>
import { ref, onMounted } from "vue";
import { deleteComment } from "../services/comment.service";
import { getCurrentUser } from "../services/user_service";

const props = defineProps({
  commentId: "",
  replyId: "",
  text: "",
  creationDate: "",
  userName: "",
  userId: "",
  ideaId: "",
  hasReplies: "",
  isReply: "",
  parentId: "",
  elapsedTime: "",
  expanded: "",
});

const emits = defineEmits([
  "toggleReplies",
  "showReplies",
  "loadReplies",
  "postReply",
  "deleteComment",
  "deleteReply",
  "toggleHasReplies",
]);

let postToggle = ref(false);
let currentUser = ref("");
let commentText = ref("");
let buttonSelected = ref(false)

onMounted(async () => {
  currentUser.value = getCurrentUser();
  console.log(currentUser.value.username);
});

function loadCommentReplies(){
  emits('loadReplies')
}

async function deleteCommentById(commentId) {
  try {
    const response = await deleteComment(commentId);

    if (response.ok) {
      emits("deleteComment", commentId);
    } else {
      console.log("Unable to delete");
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
}

async function deleteReplyById(replyId) {
  try {
    const response = await deleteComment(replyId);
    loadCommentReplies()
    if (response.ok) {
      emits("deleteReply", replyId);
    } else {
      console.log("Unable to delete");
    }
  } catch (error) {
    console.error("Error deleting reply:", error);
  }
}

function showReplies() {
  emits("showReplies"); 
}

function toggleReplies() {
  if (props.hasReplies) {
    emits("toggleReplies"); 
  }
}

function postReply(username, parentId, commentText) {
  emits("postReply", username, parentId, commentText);
  clearInput();
  showReplies();
}

function clearInput() {
  commentText.value = "";
}
</script>

<template>
  <div v-if="props.isReply" class="reply-container">
    <div class="reply-grid-main-container">
      <div class="header-container">
        <p>@{{ props.userName }}</p>
        <p class="elapsedTime">{{ props.elapsedTime }} ago</p>
      </div>

      <div class="comment-text-container">
        <p>{{ props.text }}</p>
      </div>

      <div class="footer-container">
        <div class="footer-container-left"></div>
        <div class="footer-container-center"></div>
        <div class="footer-container-right">
          <button class="action-icon-button" @click="deleteReplyById(props.replyId)">
            <span class="material-symbols-outlined"> delete </span>
          </button>
        </div>
      </div>
    </div>
    <div class="shrink-container"></div>
  </div>
  <div v-if="!props.isReply" class="comment-container">
    <div class="comment-grid-main-container">
      <div class="header-container">
        <p>{{ props.userName }}</p>
        <p class="elapsedTime">{{ props.elapsedTime }} ago</p>
      </div>

      <div class="comment-text-container">
        <p>{{ props.text }}</p>
      </div>

      <div class="footer-container">
        <div class="footer-container-left">
        </div>

        <div class="footer-container-center" >
          <div v-if="props.hasReplies">
          <button @click="toggleReplies()" id="view-replies-button">
            <span
              v-if="!props.isReply && props.hasReplies && !props.expanded"
              class="material-symbols-outlined" 
            >
              expand_more
            </span>
            <span v-else class="material-symbols-outlined" :style="{'color':'orange'}"> expand_less </span>
          </button>
        </div>
        </div>
        <div class="footer-container-right">
          <span v-if="buttonSelected">
            <button
              class="action-icon-button" :style="{'color':'orange'}"
              @click="postToggle = !postToggle;buttonSelected=!buttonSelected">
              <span class="material-symbols-outlined"> ink_pen </span>
            </button>
            </span>
            <span v-if="!buttonSelected">
            <button
              class="action-icon-button"
              @click="postToggle = !postToggle;buttonSelected=!buttonSelected">
              <span class="material-symbols-outlined"> ink_pen </span>
            </button>
            </span>
          <button
            class="action-icon-button"
            @click="deleteCommentById(props.commentId)">
            <span class="material-symbols-outlined"> delete </span>
          </button>
      </div>

    </div>

    </div>
    <div class="reply-input-container" v-if="postToggle">
      <textarea
        v-model="commentText"
        placeholder="  Write your reply here .."
        id="insert-reply-textarea"
      >
      </textarea>
      <button
        id="postButton"
        @click="
          postReply(currentUser.username, props.parentId, commentText);postToggle = !postToggle
        "
      >
        Post reply
      </button>
    </div>
  </div>
</template>

<style scoped>
.comment-container {
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  border: 1px solid slategray;
  padding-left: 10px;
  padding-right: 10px;
  margin: 5px;
  width: 30vw;
  min-height: 7vh;
  max-height: 45vh;
  box-sizing: border-box;
}
.reply-container {
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  border: 1px solid slategray;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  width: 30vw;
  min-height: 5vh;
  max-height: 40vh;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 96% auto;
}

.reply-grid-main-container {
  display: grid;
  grid-template-rows: 2rem auto 2rem;
}

.shrink-container {
  min-width: 10px;
}

.comment-grid-main-container {
  display: grid;
  grid-template-rows: 2rem auto 2rem;
}

.header-container {
  background-color: rgb(255, 255, 255);
  display: flex;
  justify-content: space-between;
  margin-right: 5px;
  margin-left: 5px;
  border-bottom: 1px solid #ffa941;
  align-items: center;
  max-width: 29vw;
}

.text-wrapper {
  max-width: 29vw;
  overflow-x: auto;
}

.comment-text-container {
  color: black;
  margin-left: 5px;
  min-height: 3vh;
  max-height: 20vh;
  max-width: 29vw;
  min-width: 25vw;
  border-radius: 5px;
}

.footer-container {
  display: grid;
  grid-template-columns: 25% 50% 25%;
}

.footer-container-right {
  text-align: right;
}

.footer-container-center{
  text-align: center;
}

.reply-input-container {
  display: flex;
  min-height: 7vh;
  flex-direction: column;
}

.material-symbols-outlined {
  background-color: inherit;
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
}

.elapsedTime {
  margin-right: 5px;
}
.action-icon-button {
  background-color: rgba(255, 255, 255, 0.797);
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

button:hover{
  color:#ffa941 ;
}

.dummy-button {
  background-color: rgba(255, 255, 255, 0);
  border: none;
  padding: 0;
  font: inherit;
  outline: inherit;
  color: white;
  user-select: none;
}

#view-replies-button {
  background-color: white;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

#insert-reply-textarea {
  resize: none;
  min-height: 4vh;
  max-width: 28vw;
  border: 1px solid rgba(0, 4, 8, 0.537);
  border-radius: 3px;
}

#reply-textarea {
  color: black;
  background-color: rgb(47, 47, 249);
  box-sizing: border-box;
  min-height: 8vh;
  max-height: 30vh;
  width: 29vw;
  resize: none;
  border: none;
}

#postButton {
  margin-top: 5px;
  margin-bottom: 10px;
  align-self: flex-end;
  background-color: white;
  border: 1px solid #6d3d02;
  border-radius: 3px;
}
</style>
