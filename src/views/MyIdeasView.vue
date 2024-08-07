<script setup>
import { ref, onMounted, computed, watch, toRaw } from "vue";
import CustomSidePanel from "../components/CustomSidePanel.vue";
import IdeaCard from "../components/IdeaCard.vue";
import { filterIdeas, getPagedIdeasFromUser } from "../services/idea.service";
import { getCurrentUserId, getCurrentUsername } from "../services/user_service";
import Pagination from "../components/Pagination.vue";
import CustomLoader from "../components/CustomLoader.vue";
import searchValue from "../utils/search-title";
import { useRoute } from "vue-router";
import CuriositySearch from "../views/CuriositySearch.vue";
import PageSizeSelect from "../components/PageSizeSelect.vue";
import {getAllRatings, getNumberOfRatings} from "@/services/rating_service";
import { getSubscriptions, subscribeUser, unsubscribeUser } from "../services/subscriptionService";

const currentUsername = getCurrentUsername();
// console.log(currentUsername);

const ideaPerPage = ref(5);
const currentPage = ref(1);
const ideas = ref([]);
const sortOrder = ref(0);
const totalPages = ref(0);

// updated by ref inputs
const inputTitle = ref("");
const inputText = ref("");
const inputStatus = ref([]);
const inputCategory = ref([]);
const inputUser = ref([]);
const inputSelectedDateFrom = ref("");
const inputSelectedDateTo = ref("");
const inputRating = ref("");

// non updated inputs, for sorting
// if i leave the refs and if i press sort, it will filter, which should not happen
// we put it non reactive so we update it only when the filter is pressed and the inputs are updated
let currentTitle = "";
let currentText = "";
let currentStatus = [];
let currentCategory = [];
let currentUser = [];
let currentSelectedDateFrom = "";
let currentSelectedDateTo = "";
let currentRating = "";

const implementedIdeasCount = ref(0);
const implementationPercentage = ref(0);

const route = useRoute();
const loadingPage = ref(true);

// fade images variables
const ideasTransitionContainer = ref(null);
let prevScrollPosition = 0;

const noIdeasFoundCondition = ref(false);

onMounted(async () => {
  ideasTransitionContainer.value.addEventListener("scroll", scrollFade);
  ideasTransitionContainer.value.style.overflowY = "hidden";

  if (
    searchValue &&
    searchValue.value &&
    searchValue.value.text !== undefined
  ) {
    inputTitle.value = searchValue.value.text;
  } else {
    inputTitle.value = "";
  }
  const data = await filterIdeas(
    inputTitle.value,
    currentText,
    currentStatus,
    currentCategory,
    currentUser,
    currentSelectedDateFrom,
    currentSelectedDateTo,
    currentPage.value - 1,
    ideaPerPage.value,
    currentUsername,
    currentRating,
    "ASC"
  );

  //checking if i get some errors in the backend
  if (data === "No ideas found.") {
    noIdeasFoundCondition.value = true;
    sortOrder.value = 0;
    totalPages.value = 0;
    ideas.value = [];
  } else {
    noIdeasFoundCondition.value = false;
    sortOrder.value = 0;
    totalPages.value = Math.ceil(data.totalElements / ideaPerPage.value);
    ideas.value = data.content;
    setTimeout(() => {
      scrollFade();
      ideasTransitionContainer.value.style.overflowY = "auto";
      document.getElementById("scrollable-middle").scrollTop = "0";
    }, 0);
  }
});

watch(searchValue, async (newValue) => {
  if (newValue && newValue.key === "Enter" && newValue.text !== undefined) {
    setCurrentVariables();
    ideasTransitionContainer.value.style.overflowY = "hidden";
    inputTitle.value = searchValue.value.text;
    ideas.value = [];
    const data = await filterIdeas(
      inputTitle.value,
      currentText,
      currentStatus,
      currentCategory,
      currentUser,
      currentSelectedDateFrom,
      currentSelectedDateTo,
      currentPage.value - 1,
      ideaPerPage.value,
      currentUsername,
      currentRating,
      sortOrder.value
    );

    if (data === "No ideas found.") {
      noIdeasFoundCondition.value = true;
      totalPages.value = 0;
      ideas.value = [];
    } else {
      noIdeasFoundCondition.value = false;
      updateIdeas(data); // we need to update the for multiple use cases
      setTimeout(() => {
        scrollFade();
        document.getElementById("scrollable-middle").scrollTop = "0";
      }, 0);
    }
  }
});

function scrollFade() {
  // Firstly, we take the items that have this class (reveal)
  // Calculate our scroll direction (up <-> down)
  // Get the height of our container that has the scrollable
  // The element top is the distance between the top of our idea card and the whole container top
  // We compare it to a gap we introduce manually so we know when the idea should fade in or out (elementTop < gap)
  // The other comparison is used to work the upper ideas which should fade up (elementTop > containerTopHeight - distanceTop)
  // The bottom ones should fade down
  // The distances differ, so we have cases when we scroll up or down
  // If these are true, we put them active so they have 1 opacity
  // Now the cases to check if it should up or down, modifying the translation (+- 150px)

  const reveals = ideasTransitionContainer.value.querySelectorAll(".reveal");

  const currentScrollPosition = ideasTransitionContainer.value.scrollTop;

  const scrollDirection =
    currentScrollPosition > prevScrollPosition ? "down" : "up";
  prevScrollPosition = currentScrollPosition;

  for (let i = 0; i < reveals.length; i++) {
    var ideasTransitionHeight = ideasTransitionContainer.value.clientHeight;

    const containerTopHeight = ideasTransitionContainer.value.offsetTop;

    var elementTop =
      reveals[i].getBoundingClientRect().bottom -
      ideasTransitionContainer.value.getBoundingClientRect().top;

    var elementBottom =
      reveals[i].getBoundingClientRect().top -
      ideasTransitionContainer.value.getBoundingClientRect().bottom;

    let distanceBottom = scrollDirection === "down" ? 30 : -30;

    let distanceTop = scrollDirection === "down" ? 120 : -80;

    const gapTop = distanceBottom;

    const gapBottom = distanceTop;

    // If the card is visible

    // console.log(reveals[4].getBoundingClientRect().top -
    //   ideasTransitionContainer.value.getBoundingClientRect().bottom)

    if (elementTop > gapTop && elementBottom < gapBottom) {
      reveals[i].classList.add("active");
      reveals[i].style.transform = `translateY(0px)`;

      // Setting the opacities of the top elements to fade in and out

      let shouldFade = true;

      if (shouldFade) {
        if (elementBottom < -30) {
          const topOpacityPercentage =
            -10 / 3 -
            (reveals[i].getBoundingClientRect().top -
              ideasTransitionContainer.value.getBoundingClientRect().bottom) /
              30;
          reveals[i].style.opacity = `${topOpacityPercentage}`;
        }

        // if (elementBottom < -200 && scrollDirection === "up") {
        //   reveals[4].style.opacity = `1`;
        // }

        // Setting the opacities of the bottom elements to fade in and out

        if (elementTop < 125) {
          const topOpacityPercentage =
            -75 / 50 +
            (reveals[i].getBoundingClientRect().top -
              ideasTransitionContainer.value.getBoundingClientRect().bottom) /
              50;
          reveals[i].style.opacity = `${topOpacityPercentage}`;
        }
        //   console.log(reveals[1].getBoundingClientRect().bottom -
        // ideasTransitionContainer.value.getBoundingClientRect().top)

        // if (
        //   ideasTransitionContainer.value.clientHeight -
        //     reveals[i].getBoundingClientRect().bottom <
        //     -50 &&
        //   ideasTransitionContainer.value.clientHeight -
        //     reveals[i].getBoundingClientRect().bottom >
        //     -300
        // ) {
        //   const distanceDown =
        //     ideasTransitionContainer.value.clientHeight -
        //     reveals[i].getBoundingClientRect().bottom;

        //   const bottomOpacityPercentage = (distanceDown + 300) / 200;

        //   reveals[i].style.opacity = `${bottomOpacityPercentage}`;
        // }
      }

      // If the card doesnt respect the conditions, it isn't active anymore and I check which direction it will go
    } else {
      reveals[i].classList.remove("active");

      if (
        ideasTransitionContainer.value.clientHeight -
          reveals[i].getBoundingClientRect().bottom >
        -100
      ) {
        reveals[i].style.transform = `translateY(-200px)`;
      } else if (
        reveals[i].getBoundingClientRect().top -
          ideasTransitionContainer.value.getBoundingClientRect().top >
        50
      ) {
        reveals[i].style.transform = `translateY(200px)`;
      }
    }
  }
}

async function changePage(pageNumber) {
  // every time i change the page, i should filter the pages to check from the server every page, same aplies for every method which implies changing the ideas.value
  // the ideas.value represents the ideas shown on the page, not all the images
  // this is because, from the servers, i get a list of pageSize ideas (2, 3, ...), not the whole nr of ideas
  // i emited all the filtering options for us to know which inputs are completed

  ideas.value = [];
  noIdeasFoundCondition.value = false;
  ideasTransitionContainer.value.style.overflowY = "hidden";

  const data = await filterIdeas(
    currentTitle,
    currentText,
    currentStatus,
    currentCategory,
    currentUser,
    currentSelectedDateFrom,
    currentSelectedDateTo,
    pageNumber - 1,
    ideaPerPage.value,
    currentUsername,
    currentRating,
    sortOrder.value === 0 ? "ASC" : "DESC"
  );

  if (data === "No ideas found.") {
    noIdeasFoundCondition.value = true;
    totalPages.value = 0;
    ideas.value = [];
  } else {
    noIdeasFoundCondition.value = false;
    ideas.value = data.content;
    currentPage.value = pageNumber;
    setCurrentVariables();

    setTimeout(() => {
      scrollFade();
      ideasTransitionContainer.value.style.overflowY = "auto";
      document.getElementById("scrollable-middle").scrollTop = "0";
    }, 0);
  }
}

// to update the current values, not the reactive ones
function setCurrentVariables() {
  currentTitle = inputTitle.value;
  currentText = inputText.value;
  currentStatus = inputStatus.value;
  currentCategory = inputCategory.value;
  currentUser = inputUser.value;
  currentSelectedDateFrom = inputSelectedDateFrom.value;
  currentSelectedDateTo = inputSelectedDateTo.value;
  currentRating = inputRating.value;
}

// here, the page asc or desc is happening
async function updateSortOrder() {
  if (sortOrder.value == 0) {
    ideasTransitionContainer.value.style.overflowY = "hidden";
    ideas.value = [];

    sortOrder.value = 0;
    const data = await filterIdeas(
      currentTitle,
      currentText,
      currentStatus,
      currentCategory,
      currentUser,
      currentSelectedDateFrom,
      currentSelectedDateTo,
      currentPage.value - 1,
      ideaPerPage.value,
      getCurrentUsername(),
      currentRating,
      "ASC"
    );

    if (data === "No ideas found.") {
      noIdeasFoundCondition.value = true;
      totalPages.value = 0;
      ideas.value = [];
    } else {
      noIdeasFoundCondition.value = false;
      ideas.value = data.content;
      setTimeout(() => {
        scrollFade();
        ideasTransitionContainer.value.style.overflowY = "auto";
        document.getElementById("scrollable-middle").scrollTop = "0";
      }, 0);
    }
  } else if (sortOrder.value == 1) {
    sortOrder.value = 1;

    ideasTransitionContainer.value.style.overflowY = "hidden";
    ideas.value = [];
    const data = await filterIdeas(
      currentTitle,
      currentText,
      currentStatus,
      currentCategory,
      currentUser,
      currentSelectedDateFrom,
      currentSelectedDateTo,
      currentPage.value - 1,
      ideaPerPage.value,
      getCurrentUsername(),
      currentRating,
      "DESC"
    );

    if (data === "No ideas found.") {
      noIdeasFoundCondition.value = true;
      totalPages.value = 0;
      ideas.value = [];
    } else {
      noIdeasFoundCondition.value = false;
      ideas.value = data.content;
      setCurrentVariables();
      setTimeout(() => {
        scrollFade();
        ideasTransitionContainer.value.style.overflowY = "auto";
        document.getElementById("scrollable-middle").scrollTop = "0";
      }, 0);
    }
  }
}

// here, the filtering happens
async function updateIdeas(filteredIdeas) {
  ideasTransitionContainer.value.style.overflowY = "hidden";
  ideas.value = [];
  totalPages.value = Math.ceil(filteredIdeas.totalElements / ideaPerPage.value); // the total nr of pages after filtering needs to be updated
  if (totalPages.value === 0) {
    noIdeasFoundCondition.value = true;
    setCurrentVariables();
    currentPage.value = 0;
    ideas.value = [];
    return 0;
  }
  if (currentPage.value > totalPages.value) {
    // here, the use-case: if im on page 2 and after filtering, there is only one page left, it goes behind, etc
    // here, we go behind with one page each time so wwe know when we got to our good pageNumber
    // we have to filter each time with each page to get our good ideas
    currentPage.value = 1;
    ideas.value = [];
    // if (currentPage.value == totalPages.value) {
    const data = await filterIdeas(
      inputTitle.value,
      inputText.value,
      inputStatus.value,
      inputCategory.value,
      inputUser.value,
      inputSelectedDateFrom.value,
      inputSelectedDateTo.value,
      currentPage.value - 1,
      ideaPerPage.value,
      currentUsername,
      currentRating,
      sortOrder.value
    );

    if (data === "No ideas found.") {
      noIdeasFoundCondition.value = true;
      totalPages.value = 0;
      ideas.value = [];
    } else {
      noIdeasFoundCondition.value = false;
      setCurrentVariables();
      ideas.value = data != null ? data.content : [];
      setTimeout(() => {
        scrollFade();
        ideasTransitionContainer.value.style.overflowY = "auto";
        document.getElementById("scrollable-middle").scrollTop = "0";
      }, 0);
    }
    // }
    // }
  } else {
    ideas.value = [];
    if (filteredIdeas === "No ideas found.") {
      noIdeasFoundCondition.value = true;
      totalPages.value = 0;
      ideas.value = [];
    } else {
      noIdeasFoundCondition.value = false;
      // being sure the current page doesnt go below 0
      currentPage.value = 1;
      setCurrentVariables();
      ideas.value = filteredIdeas.content;
      setTimeout(() => {
        scrollFade();
        ideasTransitionContainer.value.style.overflowY = "auto";
        document.getElementById("scrollable-middle").scrollTop = "0";
      }, 0);
    }
  }
}

// Here I pass the vars from the side panel
const onPassInputVariables = (
  inputTitleParam,
  inputTextParam,
  inputStatusParam,
  inputCategoryParam,
  inputUserParam,
  inputRatingParam,
  inputSelectedDateFromParam,
  inputSelectedDateToParam
) => {
  inputTitle.value = inputTitleParam;
  inputText.value = inputTextParam;
  inputStatus.value = inputStatusParam;
  inputCategory.value = inputCategoryParam;
  inputUser.value = inputUserParam;
  inputRating.value = inputRatingParam;
  inputSelectedDateFrom.value = inputSelectedDateFromParam;
  inputSelectedDateTo.value = inputSelectedDateToParam;
};

//if the item has an image in the db, we return it. if not, we return a default one
const getImageUrl = (item) => {
  if (item && item.image) {
    return `data:image/${item.image.fileType};name=${item.image.fileName};base64,${item.image.base64Image}`;
  } else {
    return "https://play-lh.googleusercontent.com/5MTmOL5GakcBM16yjwxivvZD10sqnLVmw6va5UtYxtkf8bhQfiY5fMR--lv1fPR1i2c=w240-h480-rw";
  }
};

async function changeDisplay(pageSize) {
  ideas.value = [];
  ideasTransitionContainer.value.style.overflowY = "hidden";

  ideaPerPage.value = pageSize;
  currentPage.value = 1;
  const data = await filterIdeas(
    inputTitle.value,
    currentText,
    currentStatus,
    currentCategory,
    currentUser,
    currentSelectedDateFrom,
    currentSelectedDateTo,
    currentPage.value - 1,
    ideaPerPage.value,
    currentUsername,
    currentRating,
    "ASC"
  );

  //checking if i get some errors in the backend
  if (data === "No ideas found.") {
    noIdeasFoundCondition.value = true;
    sortOrder.value = 0;
    totalPages.value = 0;
    ideas.value = [];
  } else {
    noIdeasFoundCondition.value = false;
    sortOrder.value = 0;
    totalPages.value = Math.ceil(data.totalElements / ideaPerPage.value);
    ideas.value = data.content;
    setTimeout(() => {
      scrollFade();
      ideasTransitionContainer.value.style.overflowY = "auto";
      document.getElementById("scrollable-middle").scrollTop = "0";
    }, 0);
  }
}

function scrollFadeOnExpand() {
  setTimeout(() => {
    scrollFade();
  }, 600);
}

function setIdeasEmptyFunction() {
  ideas.value = [];
}

const ratingsFetched = ref([]);
const userId = getCurrentUserId();

const fetchRatings = async () => {
  try{
    const response = await getAllRatings(userId);
    ratingsFetched.value = response;
  } catch (error) {
    console.error("Error getting ratings", error);
  }
}

function formatRating(rating) {
    if (rating === null || rating === undefined) {
        return 0;
    }
    return rating.toFixed(2);
}

const ratings = ref([]);

async function getTotalRatings(){
  try {
    const response = await getNumberOfRatings();
    ratings.value = response;
    return response;
  } catch (error) {
    console.error("Error", error);
  }
}

const subscribedIdeas = ref([]);

const fetchSubscriptions = async () => {
  try{
      const response = await getSubscriptions(userId);
      subscribedIdeas.value = response;
  } catch (error) {
    console.error("Error getting subscriptions", error);
  }
}

const checkIfSubscribed = (ideaId) => {
  return subscribedIdeas.value.some(subscription => subscription.ideaId == ideaId);
};

const toggleSubscriptionIcon = async (ideaId, userId) => {
  try {
    if (checkIfSubscribed(ideaId)) {
      await unsubscribeUser(ideaId, userId);
    } else {
      await subscribeUser(ideaId, userId);
    }
    await fetchSubscriptions(userId); 
  } catch (error) {
    console.error("Error subscribing/unsubscribing", error);
  }
}

onMounted(() => {
  fetchRatings();
  getTotalRatings();
  fetchSubscriptions();
});
</script>

<template>
  <div class="all-ideas-view-container">
    <div class="sidebar-container">
      <CustomSidePanel
        @filter-listening="updateIdeas"
        :sort="sortOrder"
        :currentUser="getCurrentUsername()"
        :currentPage="currentPage"
        @pass-input-variables="onPassInputVariables"
        @setIdeasEmpty="setIdeasEmptyFunction()"
        :ideasPerPage="ideaPerPage"
        :hideUser="true"
      />
      />
    </div>
    <div class="main-container">
      <div
        v-if="ideas.length === 0 && !noIdeasFoundCondition"
        class="loading-placeholder"
      >
        <CustomLoader :size="100" />
      </div>
      <div
        class="middle-container"
        id="scrollable-middle"
        ref="ideasTransitionContainer"
      >
        <div
          class="sort-container"
          :style="
            ideas
              ? ideas.length === 0
                ? { visibility: 'hidden', 'text-align': 'right' }
                : { visibility: 'visible', 'text-align': 'right' }
              : { 'text-align': 'right' }
          "
        >
          <label for="sortOrder">Sort by: </label>
          <select
            id="sortOrder"
            v-model="sortOrder"
            @change="updateSortOrder"
            style="width: 3.8vw"
          >
            <option :value="0">Oldest</option>
            <option :value="1">Newest</option>
          </select>
          <div class="pageSize">
            <PageSizeSelect
              id="pageSizeSelect"
              label="Ideas:"
              @change-display="changeDisplay"
            />
          </div>
        </div>

        <div class="ideas-transition-container" ref="ideasTransitionContainer">
          <div
            v-for="idea in ideas"
            :key="idea.id"
            class="idea-transition-item reveal"
          >
            <IdeaCard
              :ideas="ideas"
              :title="idea.title"
              :text="idea.text"
              :status="idea.status"
              :username="idea.username"
              :ideaId="idea.id"
              :commentsNumber="idea.commentsNumber"
              :elapsedTime="idea.elapsedTime"
              :image="getImageUrl(idea)"
              :loggedUser="getCurrentUsername()"
              @comment-counter-add="idea.commentsNumber++"
              @comment-counter-sub="idea.commentsNumber--"
              @revealOnScroll="scrollFadeOnExpand()"
              :isSubscribed="checkIfSubscribed(idea.id)"
              @subscribeUser="toggleSubscriptionIcon"
              :ratingAvg="formatRating(idea.ratingAvg)"
              :nrOfRatings="ratings"
            />
          </div>
          <div
            v-if="ideas.length === 0 && noIdeasFoundCondition"
            class="no-ideas-message"
          >
            <img src="../assets/img/curiosity-search.svg" />
            <br />
            <span class="black-font">Your search returned no results</span>
          </div>
        </div>
      </div>

      <div v-if="ideas.length > 0" class="pagination-container">
        <div class="pagination-component">
          <Pagination
            :totalPages="totalPages"
            :currentPage="currentPage"
            @changePage="changePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reveal {
  position: relative;
  opacity: 0;
  transition: transform 0.6s ease, opacity 0.8s ease;
}

.reveal.active {
  transform: translateY(0px);
  opacity: 0;
}
.reload-button {
  background-color: #ffa941;
  border-radius: 5px;
  border: 1px solid slategray;
  font-size: larger;
  margin-bottom: 10px;
}
.reload-button:hover {
  border: 1px solid black;
}
.date-picker {
  border: 1px solid slategray;
  border-radius: 5px;
}

.center-class {
  display: flex;
  align-items: center;
  justify-content: center;
}
.no-ideas-message {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 500px;
  width: 500px;
}

.title {
  margin-bottom: 15px;
  margin-top: 15px;
  font-size: x-large;
}

.stats-header {
  top: 0;
  display: grid;
  grid-template-rows: 7vh 12vh 5vh;
  background-color: white;
}

.select-date {
  width: 15vw;
  height: 9vh;
}

.date-input {
  display: grid;
  grid-template-rows: 50% 50%;
  gap: 0.5vh;
  text-align: center;
}

.date-input > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.idea-transition-item {
  margin-bottom: 10px;
}

.custom-statistics {
  border: 1px solid slategray;
  height: 94vh;
  display: grid;
  grid-template-rows: 24vh 70vh;
}

.load-button {
  margin-top: 10px;
  border: 1px solid black;
  background-color: #ffa941;
  height: 30px;
  text-align: center;
  width: 5.5vw;
  border-radius: 3px;
  cursor: pointer;
}

.load-button:hover {
  font-weight: bold;
}

.ideas-transition-container {
  transition: opacity 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-weight: normal;
  z-index: 2;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.black-font {
  color: #000;
  font-family: "Segoe UI", "Lato", Arial, sans-serif;
  font-weight: normal;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.loading-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 94vh;
}

.material-symbols-outlined {
  transition: transform 0.1s ease;
  margin-top: 1vh;
  font-size: 40px;
}

.sort-container {
  font-weight: bold;
  position: sticky;
  top: 0;
  margin-right: 0.2vw;
  padding-top: 0.3vh;
}
.all-ideas-view-container {
  display: grid;
  grid-template-columns: 20vw 80vw;
  height: 94vh;
}

.left-container {
  background-color: #b3b3b3;
}

.right-container {
  display: grid;
  grid-template-columns: auto auto;
}

.sidebar-container {
  background-color: #b3b3b3;
}

.middle-container {
  overflow-y: auto;
  min-width: 60vw;
}

.middle-container::-webkit-scrollbar {
  display: block;
  width: 10px;
}

.middle-container:hover::-webkit-scrollbar {
  display: block;
  width: 10px;
}

.middle-container::-webkit-scrollbar-thumb {
  background-color: #ffa941;
  border-radius: 5px;
  border: 1px solid slategray;
}

.main-container {
  height: 94vh;
  display: grid;
  grid-template-rows: 90% 10%;
  /* border-top: 1px solid slategray; */
}

.idea-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(50% - 20px); /* 50% width minus margins on both sides */
  margin: 10px auto; /* Center the ideas horizontally */
  padding: 10px;
}
.big-container {
  display: flex;
  justify-content: center;
  height: 94vh;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-component {
  width: 30vw;
  margin-bottom: 5vh;
}

.page-number {
  display: inline-block;
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #000;
  border-radius: 999px;
  background-color: transparent;
  cursor: pointer;
}

.page-number.active {
  background-color: #000;
  color: #fff;
}

.arrow {
  cursor: pointer;
}

.arrow:hover {
  background-color: #000;
  color: #fff;
}

.current-page {
  background-color: #000;
  color: #fff;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 999px;
  cursor: pointer;
}

.current-page:hover {
  text-decoration: underline;
}
.pageSize {
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
}
</style>
