<script setup>
import { ref, onMounted } from "vue";
import { deleteComment, getLikesCount, deleteLike, postLike, getLike, reportComment, getReport, getReportsCountForComment, getReviewStatus } from "../services/comment.service";
import { getCurrentRole, getCurrentUserId} from "../services/user_service";
import CustomModal from "./CustomModal.vue";
import LikeButton from "../components/LikeButton.vue";


const props = defineProps({
  commentId: "",
  replyId: "",
  text: "",
  username: "",
  ideaId: "",
  hasReplies: "",
  isReply: "",
  parentId: "",
  elapsedTime: "",
  loggedUser: "",
});

// console.log("Initial props:", props);

const emits = defineEmits([
  "toggleReplies",
  "showReplies",
  "loadReplies",
  "postReply",
  "deleteComment",
  "deleteLike",
  "deleteReply",
  "getLikesCount",
  "postLike",
]);

const replyToggled = ref(false);
const postToggle = ref(false);
const currentUser = props.loggedUser;
const currentUserRole = ref("");
const commentText = ref("");
const buttonSelected = ref(false);
const showModal = ref(false);
const showModal2 = ref(false);
const maxlength = 500;
const likesCounts = ref([]);
const isBlackIcon = ref(false);
const isReported = ref(false);
const reportCount = ref(true);
const id = ref("");
const reviewStatus = ref("");
const isHovering = ref(false);
const userId=ref(0);
const reportsCountLoading = ref(false);
const likesCountLoading = ref(false);

onMounted(async () => {
  currentUserRole.value = getCurrentRole();
  userId.value=getCurrentUserId();
  fetchLikes();
  fetchLikesCount();
  fetchReportCount();
  getReviewStatusValue();
});

id.value = props.isReply ? props.replyId : props.commentId;


async function getReviewStatusValue() {
  try {
  const response = await getReviewStatus(id.value);
  reviewStatus.value = response;
  if(reviewStatus.value === 'OFFENSIVE') {
    reportCount.value = false;
  }
} catch (error) {
    console.error("Error geting review status:", error);
  }
}


async function fetchLikes() {

  try {
    isBlackIcon.value = await getLike(id.value, userId.value);
    isReported.value = await getReport(id.value, userId.value);
  } catch (error) {
    console.error("Error fetching like status:", error);
  }
}

async function fetchReportCount() {
  try {
    const count = await getReportsCountForComment(id.value);
    if(count > 5){
      reportCount.value = false;
    }
  } catch (error) {
    console.error("Failed to fetch report count:", error);
  }
  reportsCountLoading.value=true;
}

async function fetchLikesCount() {
  try {
    const data = await getLikesCount(id.value);
    likesCounts.value.push(data);
  } catch (error) {
    console.error("Failed to fetch likes count:", error);
  }
  likesCountLoading.value=true;
}

function loadCommentReplies() {
  emits("loadReplies");
}

async function postLikeForComment() {
  try {
    await postLike(props.commentId, userId.value);
    likesCounts.value[0]++;
    isBlackIcon.value = !isBlackIcon.value;
  } catch (error) {
    console.error("Error posting like:", error);
  }
}

async function postLikeForReply() {
  try {
    await postLike(props.replyId, userId.value);
    likesCounts.value[0]++;
    isBlackIcon.value = !isBlackIcon.value;
  } catch (error) {
    console.error("Error posting like:", error);
  }
}

async function deleteCommentById(commentId) {
  try {
    const response = await deleteComment(commentId);

    if (response.ok) {
      emits("deleteComment", commentId);
      showModal.value = false;
      console.log("Comment deleted successfully");
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
    loadCommentReplies();
    if (response.ok) {
      emits("deleteReply", replyId);
      showModal.value = false;
      console.log("Reply deleted successfully");
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
  replyToggled.value = !replyToggled.value;
  emits("toggleReplies");
}

function postReply(username, parentId, commentText) {
  emits("postReply", username, parentId, commentText);
  clearInput();
  showReplies();
  replyToggled.value = true;
}

function clearInput() {
  commentText.value = "";
}

async function deleteLikeAll() {
  try {
    await deleteLike(id.value, userId.value);
    likesCounts.value[0]--;
    isBlackIcon.value = !isBlackIcon.value;
  } catch (error) {
    console.error("Error deleting like:", error);
  }

}

async function handleReport() {
  try {
    const result = await reportComment(id.value, userId.value);
    console.log("Comment reported:", result);
    isReported.value = true;
    showModal2.value = false;

  } catch (error) {
    console.error("Error reporting comment:", error);
  }
}

const checkMouseLeave = () => {
  setTimeout(() => {
    isHovering.value = false;
  }, 200);
};

</script>

<template>
  <div v-if="props.isReply && reportsCountLoading && likesCountLoading" class="reply-container">
    <div class="reply-grid-main-container">
      <div class="header-container-reply">
        <p>@{{ props.username }}</p>
        <p class="elapsedTime">{{ props.elapsedTime }} ago</p>
      </div>
      <div class="comment-text-container">
        <div v-html="text"></div>
      </div>
      <div class="footer-container">
        <div class="footer-container-left"></div>
        <div class="footer-container-center"></div>
        <div v-if="reportCount" class="footer-container-right">
          <button v-if="currentUser !== props.username && currentUserRole !== 'ADMIN'" class="action-icon-button"
            @click="showModal2 = true" :disabled="isReported">
            <span class="material-symbols-outlined" :style="{ color: isReported ? 'red' : 'black' }"> report </span>
          </button>
          <Teleport to="body">
            <CustomModal :show="showModal2" @close="showModal2 = false" @delete="handleReport()">
              <template #header>
                <h3>Do you want to report this reply?</h3>
              </template>
            </CustomModal>
          </Teleport>
          <LikeButton @deleteLike="deleteLikeAll" @addLike="postLikeForReply" v-if="!isReported && currentUser != props.username"
            :isBlackIcon="isBlackIcon" />
          <b v-if="!isReported && currentUser == props.username && likesCounts[0] > 0">Likes: </b>
          <span v-if="!isReported && likesCounts[0] > 0" v-for="(count, index) in likesCounts" :key="index" class="likes-count">{{ count
          }}</span>
          <button v-if="currentUser === props.username || currentUserRole === 'ADMIN'" class="action-icon-button"
            @click="showModal = true">
            <span class="material-symbols-outlined"> delete </span>
          </button>
          <Teleport to="body">
            <CustomModal :show="showModal" @close="showModal = false" @delete="deleteReplyById(props.replyId)">
              <template #header>
                <h3>Do you want to delete this reply?</h3>
              </template>
            </CustomModal>
          </Teleport>
        </div>
      </div>
    </div>
  </div>

  <div v-if="!props.isReply && reportsCountLoading && likesCountLoading" class="comment-container">
    <div class="comment-grid-main-container">
      <div class="header-container">
        <p>{{ props.username }}</p>
        <p class="elapsedTime">{{ props.elapsedTime }} ago</p>
      </div>
      <div class="comment-text-container">
        <div v-html="text"></div>
      </div>

      <div class="footer-container">
        <div class="footer-container-left"></div>

        <div class="footer-container-center">
          <div v-if="props.hasReplies && reportCount <= 5">
            <button @click="toggleReplies()" id="view-replies-button">
              <span v-if="!replyToggled" class="material-symbols-outlined" @click="getReviewStatusValue()">
                expand_more
              </span>
              <span v-else class="material-symbols-outlined" :style="{ color: 'orange' }">
                expand_less
              </span>
            </button>
          </div>
        </div>
        <div v-if="reportCount" class="footer-container-right">
          <button v-if="currentUser !== props.username && currentUserRole !== 'ADMIN'" class="action-icon-button"
            @click="showModal2 = true" :disabled="isReported">
            <span class="material-symbols-outlined" :style="{ color: isReported ? 'red' : 'black' }"> report </span>
          </button>
          <Teleport to="body">
            <CustomModal :show="showModal2" @close="showModal2 = false" @delete="handleReport()">
              <template #header>
                <h3>Do you want to report this comment?</h3>
              </template>
            </CustomModal>
          </Teleport>
          <LikeButton @deleteLike="deleteLikeAll" @addLike="postLikeForComment"
            v-if="!isReported && currentUser != props.username" :isBlackIcon="isBlackIcon" />
          <b v-if="!isReported && currentUser == props.username && likesCounts[0] > 0">Likes: </b>
          <span v-if="!isReported && likesCounts[0] > 0" v-for="(count, index) in likesCounts" :key="index" class="likes-count">{{ count
          }}</span>
          <span v-if="buttonSelected">
            <button class="action-icon-button" :style="{ color: 'orange' }" @click="
              postToggle = !postToggle;
            buttonSelected = !buttonSelected;
            ">
              <span class="material-symbols-outlined"> add_comment </span>
            </button>
          </span>
          <span v-if="!buttonSelected">
            <button class="action-icon-button" @click="
              postToggle = !postToggle;
            buttonSelected = !buttonSelected;
            ">
              <span class="material-symbols-outlined"> add_comment </span>
            </button>
          </span>
          <button v-if="currentUser === props.username || currentUserRole === 'ADMIN'" class="action-icon-button"
            @click="showModal = true">
            <span class="material-symbols-outlined"> delete </span>
          </button>
          <Teleport to="body">
            <CustomModal :show="showModal" @close="showModal = false" @delete="deleteCommentById(props.commentId)">
              <template #header>
                <h3>Do you want to delete this comment?</h3>
              </template>
            </CustomModal>
          </Teleport>
        </div>
      </div>
    </div>
    <div class="reply-input-container" v-if="postToggle">
      <textarea :maxlength="maxlength" v-model="commentText" placeholder="Write your reply here ..."
        id="insert-reply-textarea" style="padding: 10px;">
      </textarea>
      <div class="chars">
        <button id="legend-text-format" class="material-symbols-outlined" 
              @mouseover="isHovering = true" 
              @mouseleave="isHovering = false">
              text_fields
            </button>
            <div class="tooltip" :class="{ show: isHovering }" @mouseenter="isHovering = true" 
            @mouseleave="checkMouseLeave">
              <p><b>**Bold Text**</b> for <b>Bold Text</b></p>
              <p><i>*Italic Text*</i> for <i>Italic Text</i></p>
              <p><b><i>***Bold and Italic Text***</i></b> for <i>Bold and Italic Text</i></p>
              <p><b>![Logo OpenAI](LinkForYourPicture)</b> for inserting pictures</p>
            </div>
        <p>{{ commentText.length }} / 500</p>
        <button id="postButton" @click="
          postReply(currentUser, props.parentId, commentText);
        postToggle = !postToggle;
        buttonSelected = !buttonSelected;
        ">
          Post reply
        </button>
      </div>
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
  min-height: 9vh;
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
  margin-left: 10px;
  width: 28.5vw;
  min-height: 5vh;
  max-height: 40vh;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 96% 4%;
}

.reply-grid-main-container {
  display: grid;
  grid-template-rows: 2rem auto 2rem;
}

.shrink-container {
  min-width: 10px;
  border-right: 1px solid slategray;
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
  margin-bottom: 2px;
  border-bottom: 1px solid #ffa941;
  align-items: center;
  max-width: 29vw;
}

.header-container-reply {
  background-color: rgb(255, 255, 255);
  display: flex;
  justify-content: space-between;
  margin-right: 5px;
  margin-left: 5px;
  margin-bottom: 2px;
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
  min-height: 4vh;
  max-height: 15vh;
  max-width: 29vw;
  min-width: 25vw;
  border-radius: 5px;
  overflow-y: auto;
  margin-bottom: 10px;
  overflow-x: hidden;
  padding-right: 7px;
  word-wrap: break-word;
}

.footer-container {
  display: grid;
  grid-template-columns: 25% 50% 25%;
}

.footer-container-right {
  text-align: right;
}

.footer-container-center {
  text-align: center;
}

.reply-input-container {
  display: flex;
  min-height: 7vh;
  flex-direction: column;
  word-wrap: break-word;
}

.material-symbols-outlined {
  background-color: inherit;
}

.elapsedTime {
  margin-right: 5px;
}

.action-icon-button {
  background-color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

button:hover {
  color: #ffa941;
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
  min-height: 5vh;
  max-width: 29vw;
  border: 1px solid slategray;
  border-radius: 3px;
  word-wrap: break-word;
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
  word-wrap: break-word;
}

#postButton {
  margin-bottom: 10px;
  align-self: flex-end;
  background-color: white;
  border: 1px solid #000000;
  border-radius: 3px;
  height: 30px;
}


.likes-count {
  color: black;
  font-weight: bold;
  margin-left: 1.5px;
  margin-right: 10px;
}

.chars {
  text-align: center;
  display: grid;
  grid-template-columns: 25% 50% 25%;
  position: relative;
}

#legend-text-format {
  margin-bottom: 10px;
  align-self: flex-end;
  background-color: white;
  border: 1px solid #000000;
  border-radius: 3px;
  height: 30px;
  width: 40px;
  }

  .tooltip {
  position: absolute;
  text-align: center;
  background-color: #ffa941;
  color:  white;
  border: 2px solid #d48806;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  left: -25%;
  top:-80px;
  transform: translateX(-50%);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
  font-size: 1.1em;
  height: 100px; 
  width: 220px;
  overflow-y: auto;
}

.tooltip.show {
  opacity: 1;
  visibility: visible;
}

.tooltip::-webkit-scrollbar {
  display: block;
  width: 10px;
}

.tooltip:hover::-webkit-scrollbar {
  display: block;
  width: 10px;
}

.tooltip::-webkit-scrollbar-thumb {
  background-color: white;
  border-radius: 5px;
  border: 1px solid slategray;
}

</style>
