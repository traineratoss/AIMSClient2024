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
  console.log(comments.value);
  currentUser.value = getCurrentUser();
  console.log(currentUser.value.username);
  loadIdeaComments();
});

const comments = ref([]);
const commentText = ref([]);
const showComments = ref(false);
const toggleReplies = ref(false);
const currentUser = ref("");
const buttonSelected = ref(false);
const postToggle = ref(false);
const commentReplies = ref([]);
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

  comments.value.forEach((c) => {
    loadCommentReplies(c);
  });
}

function toggleCommentReplies(comment) {
  comment.expanded = !comment.expanded;
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
}

function toggleComments() {
  showComments.value = !showComments.value;
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
        toggleCommentReplies(
          comments.value.filter((c) => c.id === getCommentIdForReply(replyId))
        );
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
            Title: {{ getShortenedTitle(title, 25) }}
          </div>
          <div class="left-container-text">
            Text: {{ getShortenedText(text) }}
          </div>
          <div class="left-container-buttons">
            <div class="left-container-buttons-grouped" v-if="isSelected">
              <button @click="editIdea" class="idea-button">EDIT</button>
              <button @click="redirectToCreateIdeaView"  class="idea-button">VIEW</button>
              <button  @click="showDeletePopup" class="idea-button">DELETE</button>
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
          <div v-if="props.numberOfComments !=0">
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
        :replies="getRepliesForComment(comment.id)"
        @toggleReplies="toggleCommentReplies(comment)"
        @showReplies="showCommentReplies(comment)"
        @loadReplies="loadCommentReplies(comment)"
        @postReply="postReplyDynamic"
        @deleteComment="deleteCommentDynamic"
      />
      <div v-if="comment.expanded" class="replies-wrapper">
        <div v-for="reply in getRepliesForComment(comment.id)" class="reply-container">
          <CustomComment
            :elapsedTime="reply.elapsedTime"
            :isReply="true"
            :replyId="reply.id"
            :text="reply.commentText"
            :userName="reply.username"
            @deleteReply="deleteReplyDynamic"
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

.idea-button{
  background-color:white;
  border: 1px solid black;
  border-radius: 5px;
  margin-right: 10px;
  min-width: 9vh;
  max-width: 10vh;
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
