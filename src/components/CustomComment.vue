<script setup>
import { ref, onMounted } from "vue";
import { postReply, deleteComment } from "../services/comment.service";
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

const emits = defineEmits(["showReplies", "loadComments", "loadReplies"]);

let postToggle = ref(false);
let currentUser = ref("");
let enableRepliesView = ref(false);
let commentText = ref("");

onMounted(async () => {
  currentUser.value = getCurrentUser();
  console.log(currentUser.value.username);
});

async function deleteCommentById(commentId) {
  try {
    await deleteComment(commentId);
    emits("loadComments");
    console.log("Comment deleted successfully!");
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
}

async function deleteReplyById(replyId) {
  try {
    await deleteComment(replyId);
    await loadCommentReplies();

    console.log("Reply deleted successfully!");
  } catch (error) {
    console.error("Error deleting reply:", error);
  }
}

function showReplies() {
  enableRepliesView = !enableRepliesView;
  if (props.hasReplies) {
    emits("showReplies");
    loadCommentReplies();
  }
}

async function loadCommentReplies() {
  emits("loadReplies");
}

async function postReplyDynamic(username, parentId, commentText) {
  try {
    await postReply(username, parentId, commentText);
    clearInput();
    await loadCommentReplies();
    if (!props.hasReplies) emits("loadComments");
  } catch (error) {
    console.error("Error posting reply:", error);
  }
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
        <div class="left"></div>
        <div class="center"></div>
        <div class="right">
<<<<<<< HEAD
          <button class="action-icon-button" disabled>
            <span class="material-symbols-outlined"> ink_pen </span>
          </button>
          <button
            class="action-icon-button"
            @click="deleteReplyById(props.replyId)"
          >
=======
          <button class="action-icon-button" @click="postToggle = !postToggle">
>>>>>>> 2be47b6b159a3396a3c46dd562ae8ab0f6496b8a
            <span class="material-symbols-outlined"> delete </span>
          </button>
        </div>
      </div>
    </div>
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
          <button class="dummy-button" disabled>
            <span class="material-symbols-outlined"> ink_pen </span>
          </button>
          <button class="dummy-button" disabled>
            <span class="material-symbols-outlined"> delete </span>
          </button>
        </div>

        <div class="footer-container-center" v-show="props.hasReplies">
          <button @click="showReplies()" id="view-replies-button">
            <span
              v-if="!props.isReply && props.hasReplies && !props.expanded"
              class="material-symbols-outlined"
            >
              expand_more
            </span>
            <span v-else class="material-symbols-outlined"> expand_less </span>
          </button>
        </div>

        <div class="footer-container-right">
          <button class="action-icon-button" @click="postToggle = !postToggle">
            <span class="material-symbols-outlined"> ink_pen </span>
          </button>
          <button
            class="action-icon-button"
            @click="deleteCommentById(props.commentId)"
          >
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
          postReplyDynamic(currentUser.username, props.parentId, commentText)
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
  padding: 10px;
  width: 29vw;
  min-height: 5vh;
  max-height: 30vh;
  box-sizing: border-box;
}

.reply-grid-main-container {
  display: grid;
  grid-template-rows: 2rem auto 2rem;
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
}

.comment-text-container {
  color: black;
  margin-left: 5px;
  min-height: 3vh;
  max-height: 10vh;
  max-width: 29vw;
  border-radius: 5px;
}

.footer-container {
  background-color: rgb(255, 255, 255);
  display: flex;
  justify-content: space-between;
}

.footer-container-right {
  margin-right: 7px;
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
  background-color: rgba(255, 255, 255, 0);
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
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

<<<<<<< HEAD
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

=======
>>>>>>> 2be47b6b159a3396a3c46dd562ae8ab0f6496b8a
#postButton {
  margin-top: 5px;
  margin-bottom: 10px;
  align-self: flex-end;
  background-color: white;
  border: 1px solid #6d3d02;
  border-radius: 3px;
}
</style>
