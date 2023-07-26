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
  expanded:""
});

const emits = defineEmits(["showReplies", "loadComments", "loadReplies"]);

let postToggle = ref(false);
let currentUser = ref("");
let enableRepliesView = ref(true);
let commentText = ref('')

onMounted(async () => {
  currentUser.value = getCurrentUser();
  console.log(currentUser.value.username);
});

function showReplies() {
  enableRepliesView = !enableRepliesView;
  if (props.hasReplies) {
    emits("showReplies");
    loadCommentReplies();
  }
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
 <div v-if="props.isReplay" class="reply-container">
    <div class="reply-grid-main-container">
      <div class="header-container">
        <p>@{{ props.userName }}</p>
        <i class="elapsedTime">{{ props.elapsedTime }} ago </i>
      </div>

      <div class="">
        <textarea name="" id="reply-textarea" disabled>
        {{ props.text }}
      </textarea
        >
      </div>
      <div class="footer-container">
        <div class="left"></div>
        <div class="center"></div>
        <div class="right">
          <button class="action-icon-button" @click="postToggle = !postToggle">
            <span class="material-symbols-outlined"> ink_pen </span>
          </button>
          <button class="action-icon-button" @click="postToggle = !postToggle">
            <span class="material-symbols-outlined"> delete </span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!props.isReplay" class="comment-container">
    <div class="comment-grid-main-container">
      <div class="header-container">
        <p>{{ props.userName }}</p>
        <i class="elapsedTime">{{ props.elapsedTime }} ago </i>
      </div>

      <div class="comment-text-container">
            <p id="comment-textarea">{{ props.text }}</p>  
      </div>
      <div class="footer-container">
        <div class="left"></div>

        <div class="center" v-show="props.hasReplies">
          <button @click="showReplies()" id="view-replies-button">
            <span v-if="enableRepliesView" class="material-symbols-outlined">
              expand_more
            </span>
            <span v-else class="material-symbols-outlined"> expand_less </span>
          </button>
        </div>

        <div class="right">
          <button class="action-icon-button" @click="postToggle = !postToggle">
            <span class="material-symbols-outlined"> ink_pen </span>
          </button>
          <button class="action-icon-button" @click="postToggle = !postToggle">
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
  padding: 10px;
  margin-top: 5px;
  width: 30vw;
  min-height: 20vh;
  max-height: 45vh;
}
.reply-container  {
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  border: 1px solid slategray;
  padding: 10px;
  max-width: 30vw;
  min-height: 15vh;
  height: 15vh;
  max-height: 25vh;
}

.reply-grid-main-container {
  display: grid;
  grid-template-rows: 2rem 10vh 2rem;
}

.comment-grid-main-container {
  display: grid;
  grid-template-rows: 2rem 18vh 2rem;
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

.footer-container > #view-replies-button {
  align-items: center;
}

.reply-input-container {
  display: flex;
  min-height: 10vh;
  flex-direction: column;
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
}

.elapsedTime {
  margin-right: 5px;
}
.action-icon-button {
  background-color: white;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
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
  background-color: rgb(255, 255, 255);
  resize: none;
  min-height: 9vh;
  width: 29vw;
  border: 1px solid rgba(0, 4, 8, 0.537);
  border-radius: 5px;
  margin-left: 5px;
}

#comment-textarea {
  color: black;
  background-color: rgb(255, 0, 0);
  min-height: 15vh;
  max-height: 25vh;
  width: 29vw;
  resize: none;
  border: none;
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
  margin: 5px;
  align-self: flex-end;
}

textarea {
  resize: none;
  min-height: 10vh;
  width: 30vw;
  border: 1px solid rgba(0, 4, 8, 0.537);
  border-radius: 5px;
}
</style>
