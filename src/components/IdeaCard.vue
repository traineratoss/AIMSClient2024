<script setup>
import CustomComment from "../components/CustomComment.vue";
import { ref, onMounted } from "vue";
import router from "../router";
import {
  loadComments,
  loadReplies,
  postComment,
} from "../services/comment.service";
import { getCurrentUser } from "../services/user_service";

const props = defineProps({
  title: "",
  text: "",
  status: "",
  username: "",
  ideaId: "",
  numberOfComments: "",
});

onMounted(async () => {
  console.log(comments);
  currentUser.value = getCurrentUser();
  console.log(currentUser.value.username);
});

let comments = ref([]);
let commentText = ref([]);
let showComments = ref(false);
let toggleReplies = ref(false);
let currentUser = ref("");
let buttonSelected = ref(false);
let postToggle = ref(false);
const ideaCard = document.querySelector('.idea-card');
const isSelected = ref(true)

// if(ideaCard){
//   ideaCard.addEventListener('click', function() {
//   isSelected.value =! isSelected.value
//   console.log('Div was clicked!');
// })}


async function loadIdeaComments() {
  const loadedComments = await loadComments(100, 0, "id", props.ideaId);
  comments.value = loadedComments.map((comment) => ({
    ...comment,
    expanded: false,
  }));
}

function toggleCommentReplies(comment) {
  comment.expanded = !comment.expanded;
}

function redirectToCreateIdeaView() {
  router.push({ path: "/create-idea", query: { disableFields: true } });
}

function showDeletePopup() {
  router.push({ path: "/create-idea", query: { showDeletePopup: true } });
}

function toggleComments() {
  showComments.value = !showComments.value;
}

async function loadCommentReplies(comment) {
  comment.replies = await loadReplies(comment.id);
}

async function postCommentDynamic(username, ideaId, commentText) {
  try {
    await postComment(username, ideaId, commentText);
    clearInput();
    await loadIdeaComments();
  } catch (error) {
    console.error("Error posting comment:", error);
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
    const rowText = text.substr(startIndex, maxLength);

    if (i === 0) {
      shortenedText += rowText + "\n"; // First row, no need to add spaces
    } else {
      const paddedRowText = rowText.padStart(rowText.length + 6, ' ');
      shortenedText += paddedRowText + "\n";
    }
  }

  return shortenedText.trimEnd() + ellipsis;
}
</script>

<template>
  <div class="container">
    <div class="idea-card">
      <div class="top-container">
        <div class="left-container">
          <div class="left-container-title">
            {{ props.title }}
          </div>
          <div class="left-container-text">
            {{ props.text }}
          </div>
          <div class="left-container-buttons">
            <div class="left-container-buttons-grouped" v-if="isSelected">
              <button>EDIT</button>
              <button>VIEW</button>
              <button>DELETE</button>
            </div>
            <div class="left-container-buttons-post">
           
            </div>
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
            {{ props.numberOfComments }}
            {{ props.status }}
            {{ props.username }}
          </div>
        </div>
      </div>
      <div class="bottom-container">
        <div class="bottom-container-left">

        </div>
        <div class="bottom-container-center">
          <button
          @click="
            loadIdeaComments();
            toggleComments();
          "
          id="view-replies-button"
        >
          <span v-if="!showComments" class="material-symbols-outlined">
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
        <div class="bottom-container-right">
          <span v-if="buttonSelected">
                <button
                  class="action-icon-button"
                  :style="{ color: 'orange' }"
                  @click="
                    postToggle = !postToggle;
                    buttonSelected = !buttonSelected;
                  "
                >
                  <span class="material-symbols-outlined"> add_comment </span>
                </button>
              </span>
              <span v-if="!buttonSelected">
                <button
                  class="action-icon-button"
                  @click="
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

    <div v-if="postToggle" class="comment-input-wrapper">
        <div class="comment-input-container">
          <textarea  id="comment-input-textarea" v-model="commentText">
          </textarea>
        </div>
        <div class="comment-input-bottom">
          <button @click="postCommentDynamic(currentUser.username,props.ideaId,commentText)">Post! </button>
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
        :userName="comment.username"
        :hasReplies="comment.hasReplies"
        :expanded="comment.expanded"
        :parentId="comment.id"
        :ideaId="comment.ideaId"
        @showReplies="toggleCommentReplies(comment)"
        @loadReplies="loadCommentReplies(comment)"
        @loadComments="loadIdeaComments()"
      />
      <div v-if="comment.expanded" class="replies-wrapper">
        <div v-for="commentReply in comment.replies" class="reply-container">
          <CustomComment
            :elapsedTime="commentReply.elapsedTime"
            :isReply="true"
            :replyId="commentReply.id"
            :parentId="commentReply.parentId"
            :text="commentReply.commentText"
            :userName="commentReply.username"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.idea-card {
  position: relative;
  background-color: white;
  width: 30vw;
  min-height: 200px;
  max-height: 30vh;
  margin-left: 5px;
  border-radius: 5px;
  border: 1px solid slategray;
  margin-top: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto 30px;
}

.top-container {
  display: grid;
  grid-template-columns: 70% 30%;
}

.bottom-container {
  display: grid;
  grid-template-columns: 25% 50% 25%;
}

.bottom-container-center{
  text-align: center;
}

.bottom-container-right{
  text-align: right;
}


.left-container {
  display: grid;
  grid-template-rows: 20% auto 30px;
  margin-left: 1vw;
}

.left-container-title {
  display: flex;
  align-items: center;
  margin-left: 1vw;
  margin-top: 1vh;
}

.left-container-text {
  margin-top: 1vh;
  margin-left: 1vw;
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
  grid-template-rows: 30px 40% 40% ;
  max-height: 20vh;
  
}
.right-container-image {
  display: flex;
  align-items: center;
  justify-content: center;
  border-left:1px solid  #ffa941 ;
}

.right-container-status{
  border-left:1px solid  #ffa941 ;
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
  padding-right: 7px;
}

.replies-wrapper::-webkit-scrollbar {
  display: none;
}

.replies-wrapper:hover::-webkit-scrollbar {
  display: block;
  width: 10px;
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
.material-symbols-outlined {
  background-color: inherit;
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
}

.comment-input-wrapper{
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
  margin-left: 5px;
}

#comment-input-textarea{
  margin-top: 0.5vw;
  resize: none;
  width: 29vw;
  height: 10vh;
  overflow:auto;
  box-sizing: border-box;
}

.comment-input-bottom{
  text-align: end;
  width: 29vw;
}
#view-replies-button {
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

.action-icon-button {
  background-color: rgba(255, 255, 255, 0);
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  margin-right: 10px;
}
</style>
