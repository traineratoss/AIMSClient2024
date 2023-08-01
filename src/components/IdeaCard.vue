<script setup>
import CustomComment from "../components/CustomComment.vue";
import { ref, onMounted } from "vue";
import router from "../router";
import {
  loadComments,
  loadReplies,
  postComment,
  postReply,
} from "../services/comment.service";
import { getCurrentUsername } from "../services/user_service";

const props = defineProps({
  title: "",
  text: "",
  status: "",
  username: "",
  ideaId: "",
});

onMounted(async () => {
  currentUser.value = getCurrentUsername();
  loadIdeaComments();
  console.log(comments.value);
  sendNumberOfComments();
});

const comments = ref([]);
const commentText = ref([]);
const showComments = ref(false);
const currentUser = ref("");
const buttonSelected = ref(false);
const postToggle = ref(false);
const commentReplies = ref([]);
const isSelected = ref(false);
const maxlength = 500;

async function loadIdeaComments() {
  const loadedComments = await loadComments(100, 0, "id", props.ideaId);
  comments.value = loadedComments.map((comment) => ({
    ...comment,
    expanded: false,
  }));

  comments.value.forEach((c) => {
    loadCommentReplies(c);
  });
}

function toggleCommentReplies(comment) {
  comment.expanded = !comment.expanded;
  loadCommentReplies(comment);
}

function showCommentReplies(comment) {
  comment.expanded = true;
  if (getRepliesForComment(comment.id).length === 0) {
    comment.isReply = false;
    comment.hasReplies = true;
  }
}

function redirectToCreateIdeaView() {
  router.push({ path: "/create-idea", query: { disableFields: true } });
}

function showDeletePopup() {
  router.push({ path: "/create-idea", query: { showDeletePopup: true } });
  console.log("redirect");
}

function toggleComments() {
  showComments.value = !showComments.value;
  console.log("toggle");
}

async function loadCommentReplies(comment) {
  const response = await loadReplies(comment.id);

  const existingRepliesIndex = commentReplies.value.findIndex(
    (entry) => entry[0] === comment.id
  );
  if (existingRepliesIndex !== -1) {
    commentReplies.value[existingRepliesIndex][1] = response;
  } else {
    commentReplies.value.push([comment.id, response]);
  }

  console.log(commentReplies.value);
}

function getCommentIdForReply(replyId) {
  return commentReplies.value.find((entry) =>
    entry[1].some((reply) => reply.id === replyId)
  )
    ? commentReplies.value.find((entry) =>
        entry[1].some((reply) => reply.id === replyId)
      )[0]
    : null;
}

function getRepliesForComment(commentId) {
  return commentReplies.value.find((entry) => entry[0] === commentId)
    ? commentReplies.value.find((entry) => entry[0] === commentId)[1]
    : [];
}

async function postCommentDynamic(username, ideaId, commentText) {
  try {
    if (commentText.length !== 0) {
      const comment = await postComment(username, ideaId, commentText);
      comment.elapsedTime = "0 seconds";
      comments.value.unshift(comment);
      clearInput();

      if (comments.value.length > 0) {
        showComments.value = true;
      }
    } else throw error;
  } catch (error) {
    alert("Comment text must not be empty");
  }
}

async function postReplyDynamic(username, parentId, commentText) {
  try {
    const reply = await postReply(username, parentId, commentText);
    reply.elapsedTime = "0 seconds";
    const parentReplies = getRepliesForComment(parentId);
    parentReplies.unshift(reply);

    const existingRepliesIndex = commentReplies.value.findIndex(
      (entry) => entry[0] === parentId
    );
    if (existingRepliesIndex !== -1) {
      commentReplies.value[existingRepliesIndex][1] = parentReplies;
    } else {
      commentReplies.value.push([parentId, parentReplies]);
    }
  } catch (error) {
    console.error("Error posting comment:", error);
  }
}

function deleteCommentDynamic(commentId) {
  const indexToDelete = comments.value.findIndex((c) => c.id === commentId);
  if (indexToDelete !== -1) {
    comments.value.splice(indexToDelete, 1);
  }

  if (comments.value.length === 0) showComments.value = false;

  console.log("Comment Delete Successful");
}

function deleteReplyDynamic(replyId) {
  const entryIndex = commentReplies.value.findIndex((entry) => {
    const repliesArray = entry[1];
    return repliesArray.some((reply) => reply.id === replyId);
  });

  if (entryIndex !== -1) {
    const replyIndexToDelete = commentReplies.value[entryIndex][1].findIndex(
      (reply) => reply.id === replyId
    );

    if (replyIndexToDelete !== -1) {
      commentReplies.value[entryIndex][1].splice(replyIndexToDelete, 1);
      console.log("Reply Delete Successful");
      if (commentReplies.value[entryIndex][1].length === 0) {
        loadIdeaComments();
      }
    } else {
      console.error("Reply not found.");
    }
  } else {
    console.error("Comment not found.");
  }
}

function clearInput() {
  commentText.value = "";
}

function getShortenedTitle(title, maxLength) {
  return title.length > maxLength ? title.substr(0, maxLength) + "..." : title;
}

function getShortenedText(text, maxLength, maxRows) {
  let shortenedText = "";
  const totalCharacters = maxLength * maxRows;
  const ellipsis = text.length > totalCharacters ? "..." : "";

  for (let i = 0; i < maxRows; i++) {
    const startIndex = i * maxLength;
    const rowText = text.substring(startIndex, startIndex + maxLength);

    if (rowText.length === 0) {
      break;
    }

    shortenedText += (i === 0 ? "" : "\n") + rowText.trim();

    if (shortenedText.length >= totalCharacters) {
      break;
    }
  }

  return shortenedText.trimEnd() + ellipsis;
}

function selectIdea() {
  isSelected.value = !isSelected.value;
  if (showComments.value == true) {
    toggleComments();
  }
  console.log(isSelected.value);
}
</script>

<template>
  <div class="container">
    <div class="clickable-container" @click="selectIdea()">
      <div class="wrapper" v-bind:class="isSelected ? 'selected-class' : ''">
        <div
          class="border"
          v-bind:style="
            isSelected
              ? {
                  'background-color': '#ffa941',
                  'animation-play-state': 'paused',
                }
              : { 'background-color': 'white' }
          "
        ></div>
        <div class="idea-card">
          <div class="top-container">
            <div class="left-container">
              <div class="left-container-title">
                {{ getShortenedTitle(title, 25) }}
              </div>
              <div class="status">
                {{ props.status }}
              </div>
              <div class="left-container-text">
                <div class="text" v-if="isSelected">
                  {{ getShortenedText(props.text, 500, 3) }}
                </div>
                <div class="text" v-else>
                  {{ getShortenedText(props.text, 50, 3) }}
                </div>
              </div>
              <div class="left-container-buttons">
                <Transition>
                  <div
                    class="left-container-buttons-grouped"
                    v-show="isSelected"
                  >
                    <button @click.stop="editIdea()" class="idea-button">
                      EDIT
                    </button>
                    <button
                      @click.stop="redirectToCreateIdeaView()"
                      class="idea-button"
                    >
                      VIEW
                    </button>
                    <button @click.stop="showDeletePopup()" class="idea-button">
                      DELETE
                    </button>
                  </div>
                </Transition>
                <div class="left-container-buttons-post"></div>
              </div>
            </div>
            <div class="right-container">
              <div class="dummy-div"></div>
              <div class="right-container-image">
                <img
                  class="idea-image"
                  src="https://play-lh.googleusercontent.com/5MTmOL5GakcBM16yjwxivvZD10sqnLVmw6va5UtYxtkf8bhQfiY5fMR--lv1fPR1i2c=w240-h480-rw"
                  alt="image"
                />
              </div>
              <div class="right-container-status">
                <div class="number-of-comments">
                  {{ comments.length }}
                  <span class="material-symbols-outlined"> comment </span>
                </div>
                <div class="author"><i> by </i>{{ props.username }}</div>
              </div>
            </div>
          </div>
          <div class="bottom-container">
            <div class="bottom-container-left"></div>
            <div class="bottom-container-center">
              <Transition>
                <div v-if="comments.length > 0 && isSelected">
                  <button
                    @click.stop="
                      loadIdeaComments();
                      toggleComments();
                    "
                    id="view-replies-button"
                  >
                    <span
                      v-if="!showComments"
                      class="material-symbols-outlined"
                    >
                      expand_more
                    </span>
                    <span
                      v-else
                      class="material-symbols-outlined"
                      :style="{ color: 'orange' }"
                    >
                      expand_less
                    </span>
                  </button>
                </div>
              </Transition>
            </div>

            <div class="bottom-container-right">
              <span v-if="buttonSelected">
                <button
                  class="action-icon-button"
                  :style="{ color: 'orange' }"
                  @click.stop="
                    postToggle = !postToggle;
                    buttonSelected = !buttonSelected;
                  "
                >
                  <span class="material-symbols-outlined"> add_comment </span>
                </button>
              </span>
              <span v-if="!buttonSelected && isSelected">
                <button
                  class="action-icon-button"
                  @click.stop="
                    postToggle = !postToggle;
                    buttonSelected = !buttonSelected;
                  "
                >
                  <span class="material-symbols-outlined"> add_comment </span>
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="postToggle" class="comment-input-wrapper">
      <div class="comment-input-container">
        <textarea
          id="comment-input-textarea"
          v-model="commentText"
          :maxlength="maxlength"
          placeholder="  Write your comment here .."
        >
        </textarea>
      </div>

      <div class="comment-input-bottom">
        <div class="chars">
          <div></div>
          <p>{{ commentText.length }} / 500</p>
          <button
            id="post-button"
            @click.stop="
              postCommentDynamic(currentUser, props.ideaId, commentText);
              postToggle = !postToggle;
              buttonSelected = !buttonSelected;
            "
          >
            Post comment
          </button>
        </div>
      </div>
    </div>
    <div
      class="comment-container"
      v-if="showComments"
      v-for="comment in comments"
      :key="comment.id"
    >
      <CustomComment
        :elapsedTime="comment.elapsedTime"
        :isReply="false"
        :commentId="comment.id"
        :text="comment.commentText"
        :username="comment.username"
        :hasReplies="comment.hasReplies"
        :expanded="comment.expanded"
        :parentId="comment.id"
        :ideaId="comment.ideaId"
        :replies="getRepliesForComment(comment.id)"
        @toggleReplies="toggleCommentReplies(comment)"
        @showReplies="showCommentReplies(comment)"
        @loadReplies="loadCommentReplies(comment)"
        @postReply="postReplyDynamic"
        @deleteComment="deleteCommentDynamic"
      />
      <div v-if="comment.expanded" class="replies-wrapper">
        <div
          v-for="reply in getRepliesForComment(comment.id)"
          class="reply-container"
        >
          <CustomComment
            :elapsedTime="reply.elapsedTime"
            :isReply="true"
            :replyId="reply.id"
            :text="reply.commentText"
            :username="reply.username"
            @deleteReply="deleteReplyDynamic"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 30vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.wrapper {
  width: 30vw;
  display: grid;
  grid-template-columns: 1vw 29vw;
  min-height: 200px;
  max-height: 30vh;
  border-radius: 5px;
  border: 1px solid slategray;
  position: relative;
  overflow: hidden;
  background-color: white;
  cursor: pointer;
  user-select: none;
}
/*
   I know it might be repetitive but at the moment
  i do no have enough time to further investigate this issue but 
  i suspect that you can exclude a specific class from beeing hovered over
*/

.wrapper:hover:not(.selected-class) .border {
  background-color: #ffa941;
  animation: 1s normalState;
}

.selected-class {
  border: 1px solid black;
}

.border {
  width: 2vw;
  min-height: 200px;
  max-height: 30vh;
  background-color: white;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  animation: 1s hover;
}

@keyframes normalState {
  from {
    transform: translateX(-100%);
    left: 0;
  }
  to {
    left: 100%;
    transform: translateX(0);
    background-color: #ffa941;
  }
}

@keyframes hover {
  0% {
    transform: translateX(0);
    left: 0;
    background-color: #ffa941;
  }
  100% {
    left: 100%;
    transform: translateX(-100%);
  }
}
.idea-card {
  position: relative;
  background-color: white;
  width: 29vw;
  min-height: 200px;
  max-height: 30vh;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto 30px;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}

.top-container {
  display: grid;
  grid-template-columns: 70% 30%;
}

.bottom-container {
  display: grid;
  grid-template-columns: 25% 50% 25%;
}

.bottom-container-center {
  text-align: center;
  margin-right: 1vw;
}

.bottom-container-right {
  text-align: right;
}

.left-container {
  display: grid;
  grid-template-rows: 20% 30px auto;
}

.left-container-title {
  display: flex;
  align-items: center;
  margin-left: 3px;
  margin-top: 1vh;
}

.left-container-text {
  margin-left: 3px;
}

.left-container-buttons {
  margin-left: 1vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-container-buttons-grouped {
  display: flex;
  gap: 5px;
}
.right-container {
  display: grid;
  grid-template-rows: 10% 60% 30%;
}
.right-container-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-container-status {
  margin-left: 10px;
}

.status {
  margin-left: 5px;
}

.number-of-comments {
}
.reply-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-container {
  position: absolute;
  bottom: 25px;
  left: 40px;
  background-color: white;
  color: black;
  border: 1px solid rgb(93, 93, 93);
}

.comment-container > .replies-wrapper {
  margin-bottom: 10px;
  margin-top: 10px;
}

.replies-wrapper {
  border: 1px solid slategray;
  margin: 5px;
  display: flex;
  gap: 5px;
  gap: 5px;
  flex-direction: column;
  margin-top: 5px;
  overflow-y: auto;
  max-height: 300px;
  border-radius: 5px;
  width: 30vw;
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
  box-sizing: border-box;
}

.replies-wrapper:hover {
  padding-right: 3px;
}

.replies-wrapper::-webkit-scrollbar {
  display: none;
}

.replies-wrapper:hover::-webkit-scrollbar {
  display: block;
  width: 5px;
}

.replies-wrapper:hover::-webkit-scrollbar-thumb {
  background-color: #ffa941;
  border-radius: 5px;
  border: 1px solid slategray;
}

.idea-image {
  margin: 20px;
  object-fit: cover;
  height: auto;
  width: 6vw;
}
.material-symbols-outlined {
  background-color: inherit;
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
}

.comment-input-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 30vw;
  background-color: white;
  border: 1px solid slategray;
  border-radius: 5px;
  min-height: 17vh;
  max-height: 22vh;
  box-sizing: border-box;
  margin-top: 10px;
}

#comment-input-textarea {
  margin-top: 0.5vw;
  resize: none;
  width: 29vw;
  height: 10vh;
  overflow: auto;
  box-sizing: border-box;
}

.comment-input-bottom {
  width: 29vw;
}

#view-replies-button {
  pointer-events: all;
  background-color: white;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  min-height: 12px;
  max-height: 24px;
}

button:hover {
  color: #ffa941;
}

.idea-button {
  pointer-events: all;
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
  margin-right: 10px;
  min-width: 9vh;
  max-width: 10vh;
}

.idea-button:hover {
  background-color: #ffa941;
  color: black;
  font-weight: 600;
}

.action-icon-button {
  pointer-events: all;
  background-color: rgba(255, 255, 255, 0);
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  margin-right: 10px;
}

#post-button {
  margin-bottom: 10px;
  align-self: flex-end;
  background-color: white;
  border: 1px solid #6d3d02;
  border-radius: 3px;
  height: 30px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
}

.chars {
  text-align: center;
  display: grid;
  grid-template-columns: 33% 33% 33%;
}
</style>
