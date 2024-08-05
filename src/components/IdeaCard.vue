<script setup>
import { ref, watch, toRef, onUpdated } from "vue";
import CustomComment from "../components/CustomComment.vue";
import router from "../router";
import {
  loadComments,
  loadReplies,
  postComment,
  postReply,
} from "../services/comment.service";
import {
  getCurrentUsername,
  getCurrentRole,
  getCurrentUserId,
} from "../services/user_service";
import { getIdea } from "../services/idea.service";

const props = defineProps({
  title: "",
  text: "",
  status: "",
  username: "",
  ideaId: "",
  commentsNumber: "",
  elapsedTime: "",
  image: "",
  loggedUser: "",
  ratingAvg: "",
  isSubscribed: Boolean,
  nrOfRatings: "",
});

const emits = defineEmits([
  "commentCounterAdd",
  "commentCounterSub",
  "ideaNotValid",
  "revealOnScroll",
  "subscribeUser",
]);

const allLoadedComments = ref([]);
const commentText = ref([]);
const showCommentsToggle = ref(false);
const buttonSelected = ref(false);
const postToggle = ref(false);
const arrayOfCommentIdAndReplyPair = ref([]);
const isSelected = ref(false);
const maxCommentLength = 500;
const numberOfDisplayedComments = ref(10);
const userId = getCurrentUserId();

const isHovering = ref(false);


// console.log(userId);
async function editIdea() {
  const data = await getIdea(props.ideaId);

  if (data === "Idea doesn't exist.") {
    // emits("ideaNotValid", true)
    // TODO
  } else {
    const username = data.username;
    const title = data.title;
    const text = data.text;
    const categoryList = JSON.stringify(data.categoryList);
    const status = data.status;
    const image = data.image;
    if (
      getCurrentUsername() === data.username ||
      getCurrentRole() === "ADMIN"
    ) {
      router.push({
        name: "create-idea",
        query: {
          updateId: props.ideaId,
          updateUsername: username,
          updateTitle: title,
          updateText: text,
          updateCategoryList: categoryList,
          updateStatus: status,
        },
      });
    }
  }
}

async function loadIdeaComments() {
  const loadedComments = await loadComments(
    numberOfDisplayedComments.value,
    0,
    "creationDate",
    props.ideaId
  );

  allLoadedComments.value = loadedComments.map((comment) => ({
    ...comment,
  }));
}

async function loadCommentReplies(comment) {
  const response = await loadReplies(
    numberOfDisplayedComments.value,
    0,
    "creationDate",
    comment.id
  );

  const existingRepliesIndex = arrayOfCommentIdAndReplyPair.value.findIndex(
    (entry) => entry[0] === comment.id
  );
  if (existingRepliesIndex !== -1) {
    arrayOfCommentIdAndReplyPair.value[existingRepliesIndex][1] = response;
  } else {
    arrayOfCommentIdAndReplyPair.value.push([comment.id, response]);
  }
}

function toggleCommentReplies(comment) {
  comment.replyToggle = !comment.replyToggle;
  loadCommentReplies(comment);
  emits("revealOnScroll", true);
}

function showCommentReplies(comment) {
  comment.replyToggle = true;
  if (getRepliesForComment(comment.id).length === 0) {
    comment.hasReplies = true;
  }
}

function redirectToCreateIdeaView() {
  router.push({
    path: "/create-idea",
    query: { disableFields: true, id: props.ideaId },
  });
}

function showDeletePopup() {
  router.push({
    path: "/create-idea",
    query: { showDeletePopup: true, id: props.ideaId },
  });
}

function toggleComments() {
  loadIdeaComments();
  showCommentsToggle.value = !showCommentsToggle.value;
  emits("revealOnScroll", true);
}

function getRepliesForComment(commentId) {
  return arrayOfCommentIdAndReplyPair.value.find(
    (entry) => entry[0] === commentId
  )
    ? arrayOfCommentIdAndReplyPair.value.find(
        (entry) => entry[0] === commentId
      )[1]
    : [];
}

async function postCommentDynamic(username, ideaId, commentText) {
  try {
    if (commentText.length !== 0) {
      const comment = await postComment(username, ideaId, commentText);
      comment.elapsedTime = "0 seconds";
      allLoadedComments.value.unshift(comment);
      clearInput();
      emits("commentCounterAdd");
      if (allLoadedComments.value.length > 0) {
        showCommentsToggle.value = true;
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

    const existingRepliesIndex = arrayOfCommentIdAndReplyPair.value.findIndex(
      (entry) => entry[0] === parentId
    );
    if (existingRepliesIndex !== -1) {
      arrayOfCommentIdAndReplyPair.value[existingRepliesIndex][1] =
        parentReplies;
    } else {
      arrayOfCommentIdAndReplyPair.value.push([parentId, parentReplies]);
    }
  } catch (error) {}
}

function deleteCommentDynamic(commentId) {
  const indexToDelete = allLoadedComments.value.findIndex(
    (c) => c.id === commentId
  );
  if (indexToDelete !== -1) {
    allLoadedComments.value.splice(indexToDelete, 1);
  }
  emits("commentCounterSub");
  if (allLoadedComments.value.length === 0) showCommentsToggle.value = false;
}

function deleteReplyDynamic(replyId) {
  const entryIndex = arrayOfCommentIdAndReplyPair.value.findIndex((entry) => {
    const repliesArray = entry[1];
    return repliesArray.some((reply) => reply.id === replyId);
  });

  if (entryIndex !== -1) {
    const replyIndexToDelete = arrayOfCommentIdAndReplyPair.value[
      entryIndex
    ][1].findIndex((reply) => reply.id === replyId);

    if (replyIndexToDelete !== -1) {
      arrayOfCommentIdAndReplyPair.value[entryIndex][1].splice(
        replyIndexToDelete,
        1
      );
      if (arrayOfCommentIdAndReplyPair.value[entryIndex][1].length === 0) {
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

function getShortText(text, numberOfRows, numberOfCharacters) {
  let shortText = "";
  let row = "";
  let countRows = 1;
  let splitVar = false;

  if (text.length <= numberOfCharacters * numberOfRows) return text;

  for (let i = 0; i < text.length; i++) {
    if (text[i] == " ") {
      splitVar = true;
    }
  }
  if (splitVar) {
    const wordsArray = text.split(" ");
    for (let word of wordsArray) {
      if (row.length + word.length <= numberOfCharacters - 1) row += " " + word;
      else {
        if (countRows === numberOfRows) {
          row += " ";
          for (let letter of word) {
            if (row.length <= numberOfCharacters - 4) row += letter;
          }
          row += "...";
          shortText += row;
          break;
        } else {
          row += "\n";
          shortText += row;
          countRows++;
          row = word;
        }
      }
    }

    return shortText;
  } else {
    const splitArray = [];
    let returnText = "";

    for (let i = 0; i < text.length; i += numberOfCharacters) {
      splitArray.push(text.slice(i, i + numberOfCharacters));
    }

    for (let i = 0; i < splitArray.length; i++) {
      returnText += splitArray[i] + "\n";
    }

    for (let word of returnText) {
      if (row.length + word.length <= numberOfCharacters - 1) row += "" + word;
      else {
        if (countRows === numberOfRows) {
          row += " ";
          for (let letter of word) {
            if (row.length <= numberOfCharacters - 4) row += letter;
          }
          row += "...";
          shortText += row;
          break;
        } else {
          row += "\n";
          shortText += row;
          countRows++;
          row = word;
        }
      }
    }
    return shortText;
  }
}

function selectIdea() {
  isSelected.value = !isSelected.value;
  if (showCommentsToggle.value == true) {
    toggleComments();
  }
}

function isSelectedRating() {
  isSelected.value = false;
}

function isSelectedSubscription() {
  isSelected.value = true;
}

const isAdmin = getCurrentRole() === "ADMIN";

watch(
  allLoadedComments,
  (comments) => {
    comments.forEach((comment) => {
      watch(
        () => comment.replyToggle,
        () => {
          if (comment.replyToggle === true) triggerExpandAnimation(comment.id);
          else triggerCollapseAnimation(comment.id);
        }
      );
    });
  }
);

function triggerExpandAnimation(commentId) {
  const reply = document.getElementById("customReply" + commentId);
  if (reply !== null) {
    const animation = reply.animate(
      [
        { transform: "translateY(-40px)", opacity: 0.001 },
        { transform: "translateY(0px)", opacity: 1 },
      ],
      {
        duration: 250,
        easing: "ease-in-out",
        delay: 5,
      }
    );

    animation.onfinish = () => {
      reply.style.transform = "";
      reply.style.opacity = "";
    };
  }
}

function triggerCollapseAnimation(commentId) {
  const reply = document.getElementById("customReply" + commentId);
  if (reply !== null) {
    const animation = reply.animate(
      [
        { transform: "translateY(0px)", opacity1: 1 },
        { transform: "translateY(20px)", opacity: 0.001 },
      ],
      {
        duration: 300,
        easing: "ease-in-out",
        delay: 5,
      }
    );

    animation.onfinish = () => {
      reply.style.transform = "";
      reply.style.opacity = "";
    };
  }
}

// const ratingAvg = ref(props.ratingAvg);

// const updateRating = async (newRating) => {
//   try {
//     await postRating(props.ideaId, userId, newRating);
//     const response = await getIdea(props.ideaId);
//     ratingAvg.value = response.ratingAvg;
//   } catch (error) {
//     console.error("Error", error);
//   }
// };

const currentStatusSubscribe = ref(props.isSubscribed);

function subscribeUserAction() {
  emits("subscribeUser", props.ideaId, userId);
  isSelected.value = true;
}

watch(toRef(props, "isSubscribed"), (newVal) => {
  currentStatusSubscribe.value = newVal;
});

watch(() => props.ideaId, async () => {
  allLoadedComments.value  = []
  allLoadedComments.value = await loadComments(
    numberOfDisplayedComments.value,
    0,
    "creationDate",
    props.ideaId
  );
})

const countRatings = (ideaId) => {
  const rating = props.nrOfRatings.find(rating => rating.ideaid == ideaId);
  return rating ? rating.ratingcount : 0;
}

</script>

<template>
  <div class="container">
    <div
      class="clickable-container"
      @click="
        selectIdea();
        loadIdeaComments();
      "
    >
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
          <div class="top-container" @dblclick="redirectToCreateIdeaView()">
            <div class="left-container">
              <div class="left-container-title">
                <div
                  class="text"
                  v-if="isSelected"
                  @dblclick="redirectToCreateIdeaView()"
                >
                  {{ getShortenedTitle(title, 40) }}
                </div>
                <div class="text" v-else>
                  {{ getShortenedTitle(title, 32) }}
                </div>
              </div>
              <div class="status">
                {{ props.status }}
              </div>
              <div class="left-container-text">
                <div
                  class="text"
                  v-if="isSelected"
                  @dblclick="redirectToCreateIdeaView()"
                >
                <div v-html="getShortText(props.text, 3, 49) "></div>
                </div>
                <div class="text" v-else>
                  <div v-html="getShortText(props.text, 2, 49) "></div>
                </div>
              </div>
              <div class="left-container-buttons">
                <div class="left-container-buttons-grouped" v-if="isSelected">
                  <div class="action-on-idea">
                    <button
                      v-if="props.loggedUser === props.username || isAdmin"
                      @click.stop="editIdea()"
                      class="idea-button"
                    >
                      EDIT
                    </button>
                    <button
                      @click.stop="showDeletePopup()"
                      v-if="props.loggedUser === props.username || isAdmin"
                      class="idea-button"
                    >
                      DELETE
                    </button>
                    <!-- <RatingStars
                      :initialRating="ratingAvg"
                      @ratingUpdated="updateRating"
                      @click="isSelectedRating"
                      class="rating-stars"
                    /> -->
                  </div>
                </div>
                <div class="left-container-buttons-post"></div>
              </div>
            </div>
            <div class="right-container">
              <div class="right-container-icon">
                <span
                  class="material-symbols-outlined subscription"
                  @click="subscribeUserAction()"
                  :class="{ filled: currentStatusSubscribe }"
                  v-if="
                    $route.path !== '/my' &&
                    !(props.loggedUser === props.username)
                  "
                >
                  visibility
                </span>
              </div>

              <div class="right-container-image">
                <img class="idea-image" :src="props.image" alt="image" />
              </div>
              <div class="right-container-info">
                <div class="number-of-comments">
                  <span class="material-symbols-outlined"> comment </span>
                  <p>{{ props.commentsNumber }}</p>
                </div>
                <div class="ratings-info">
                  <span class="ratingAvg">
                    <span class="material-symbols-outlined star">star</span>
                    <span>{{ props.ratingAvg }}</span>
                  </span>                  
                  <span class="reviews">({{ countRatings(ideaId) }} reviews)</span>
                </div>
                <div class="author">
                  <div>{{ props.elapsedTime }} ago</div>
                  <div><i> by </i>{{ props.username }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="bottom-container">
            <div class="bottom-container-left"></div>
            <div class="bottom-container-center">
              <div v-if="isSelected">
                <button
                  v-if="props.commentsNumber > 0"
                  @click.stop="toggleComments()"
                  id="view-replies-button"
                >
                  <span
                    v-if="!showCommentsToggle"
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
          :maxlength="maxCommentLength"
          placeholder="  Write your comment here .."
        >
        </textarea>
      </div>

      <div class="comment-input-bottom">
        <div class="chars">
          <button id="legend-text-format" class="material-symbols-outlined" 
            @mouseover="isHovering = true" 
            @mouseleave="isHovering = false">
            text_fields
          </button>
          <div class="tooltip" :class="{ show: isHovering }">
            <p><b>**Text**</b> for <b>Bold</b></p>
            <p><i>*Text*</i> for <i>Italic</i></p>
          </div>
          <p>{{ commentText.length }} / 500</p>
          <button
            id="post-button"
            @click.stop="
              postCommentDynamic(props.loggedUser, props.ideaId, commentText);
              postToggle = !postToggle;
              buttonSelected = !buttonSelected;
            "
          >
            Post comment
          </button>
        </div>
      </div>
    </div>
    
    <transition-group duration="300" name="nested" v-if="showCommentsToggle">
      <div
        class="comment-container"
        v-for="comment in allLoadedComments"
        :key="comment.id"
      >
        <CustomComment
          :elapsedTime="comment.elapsedTime"
          :isReply="false"
          :commentId="comment.id"
          :text="comment.commentText"
          :username="comment.username"
          :hasReplies="comment.hasReplies"
          :parentId="comment.id"
          :ideaId="comment.ideaId"
          :loggedUser="props.loggedUser"
          @toggleReplies="toggleCommentReplies(comment)"
          @showReplies="showCommentReplies(comment)"
          @loadReplies="loadCommentReplies(comment)"
          @postReply="postReplyDynamic"
          @deleteComment="deleteCommentDynamic"
        />
        <div
          class="replies-wrapper"
          v-if="comment.replyToggle"
          :id="'customReply' + comment.id"
        >
          <transition-group duration="300" name="rnested">
            <div
              v-for="reply in getRepliesForComment(comment.id)"
              :key="reply.id"
              class="reply-container"
            >
              <div class="custom-reply">
                <CustomComment
                  :elapsedTime="reply.elapsedTime"
                  :isReply="true"
                  :replyId="reply.id"
                  :text="reply.commentText"
                  :username="reply.username"
                  :loggedUser="props.loggedUser"
                  @deleteReply="deleteReplyDynamic"
                />
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>

.ratings-info{
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .4rem;
}

.reviews{
  font-size: .7rem;
}

.ratingAvg{
  display: flex;
  align-items: center;
  justify-content: center;
}

.expand-animation {
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
  transition-delay: 0.05s;
  transform: translateY(-20px);
  opacity: 0.001;
}

.nested-enter-active {
  transition: all 0.1s ease-in-out;
  transition-delay: 0.05s;
}

.nested-enter-from {
  transform: translateY(-20px);
  opacity: 0.001;
}

.nested-leave-active {
  transition: all 0.1s ease-in-out;
  transition-delay: 0.05s;
}

.nested-leave-to {
  transform: translateY(30px);
  opacity: 0.001;
}

.rnested-enter-active {
  transition: all 0.1s ease-in-out;
  transition-delay: 0.05s;
}

.rnested-enter-from {
  transform: translateY(-20px);
  opacity: 0.001;
}

.rnested-leave-active {
  transition: all 0.1s ease-in-out;
  transition-delay: 0.05s;
}

.rnested-leave-to {
  transform: translateY(30px);
  opacity: 0.001;
}

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
  margin-left: 10px;
}

.left-container-title {
  display: flex;
  align-items: center;
  margin-left: 5px;
  margin-top: 1vh;
  font-weight: 600;
  font-size: large;
}

.left-container-text {
  margin-left: 3px;
  word-wrap: break-word;
  color: black;
  min-height: 4vh;
  max-height: 20vh;
  max-width: 23vw;
  min-width: 18vw;
  border-radius: 5px;
  overflow-y: auto;
  margin-bottom: 10px;
  overflow-x: hidden;
}

.left-container-text::-webkit-scrollbar {
  display: block;
  height: 5px;
  cursor: pointer;
  width: 7px;
}

.left-container-text::-webkit-scrollbar-thumb {
  background-color: #eb9224;
  border-radius: 5px;
  border: 1px solid slategray;
  cursor: pointer;
}

.left-container-buttons {
  margin-left: 1vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-container-buttons-grouped {
  display: flex;
}

.action-on-idea {
  display: flex;
  flex-direction: row;
  display: flex;
  align-items: center;
}

.right-container {
  display: grid;
  grid-template-rows: 50% 50%;
}

.right-container-icon {
  position: absolute;
  align-items: right;
  right: 0px;
  display: flex;
  justify-content: right;
}

.right-container-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.author {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.right-container-info {
  margin-left: 10px;
  display: grid;
  grid-template-rows: 20% 20%;
}

.status {
  margin-left: 5px;
  font-weight: 400;
  font-size: medium;
}

.number-of-comments {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
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
  margin: 5px;
  display: flex;
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
  transition: all 1s;
}

.replies-wrapper::-webkit-scrollbar {
  display: block;
  width: 5px;
  background-color: rgba(128, 128, 128, 0.259);
}

.replies-wrapper::-webkit-scrollbar-thumb {
  background-color: #ffa941;
  border-radius: 5px;
  border: 1px solid slategray;
}

.idea-image {
  margin: 15px;
  height: 3.5vw;
  width: 5vw;
}

img {
  border: 1px solid slategray;
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
  word-wrap: break-word;
}

#comment-input-textarea {
  margin-top: 0.5vw;
  resize: none;
  width: 29vw;
  height: 10vh;
  overflow: auto;
  box-sizing: border-box;
  border: 1px solid slategray;
  border-radius: 3px;
  word-wrap: break-word;
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
  cursor: pointer;
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
  border: 1px solid #000000;
  border-radius: 3px;
  height: 30px;
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

/* .chars {
  text-align: center;
  display: grid;
  grid-template-columns: 33% 33% 33%;
} */

.chars {
  text-align: center;
  display: grid;
  grid-template-columns: 25% 50% 25%;
}

.subscription.filled {
  font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
}

.tooltip {
  position: absolute;
  background-color: #ffa941;
  color:  white;
  border: 2px solid #d48806;
  padding: 1px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  top: 300px; 
  left: -12%;
  transform: translateX(-50%);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
  font-size: 1.1em;
}

.tooltip.show {
  opacity: 1;
  visibility: visible;
}

.star{
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  color: black;
}
</style>
