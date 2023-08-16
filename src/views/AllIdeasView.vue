<script setup>
import SidePanel from "../components/SidePanel.vue";
import { ref, onMounted, watch, computed } from "vue";
import IdeaCard from "../components/IdeaCard.vue";
import { filterIdeas, loadPagedIdeas } from "../services/idea.service";
import {
  getStats,
  sendDataForCustomStats,
} from "../services/statistics.service";
import { getCurrentUsername, getCurrentRole } from "../services/user_service";
import Pagination from "../components/Pagination.vue";
import CustomStatistics from "../components/CustomStatistics.vue";
import CustomLoader from "../components/CustomLoader.vue";
import searchValue from "../utils/search-title";
import CustomInput from "../components/CustomInput.vue";
import PageSizeSelect from "../components/PageSizeSelect.vue";
const selectedDateFrom = ref();
const selectedDateTo = ref();
const filteredStatistics = ref([]);
const showGenerated = ref(true);
const ideaPerPage = ref(5);
const currentPage = ref(1);
const ideas = ref([]);
const loggedUser = ref("");
const sortOrder = ref(0);
const totalPages = ref(0);
const stats = ref({});

// updated by ref inputs
const inputTitle = ref("");
const inputText = ref("");
const inputStatus = ref([]);
const inputCategory = ref([]);
const inputUser = ref([]);
const inputSelectedDateFrom = ref("");
const inputSelectedDateTo = ref("");
const isAdmin = ref("");

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
let currentUserRole = "";

const loadingPage = ref(true);

const noIdeasFoundCondition = ref(false);

const sleepNow = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));

onMounted(async () => {
  // const data2 = await loadPagedIdeas(
  //   ideasPerPage,
  //   currentPage.value - 1,
  //   "creationDate",
  //   "ASC"
  // );
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
    null,
    "ASC"
  );

  loadingPage.value = true;
  loggedUser.value = getCurrentUsername();
  currentUserRole = getCurrentRole();
  checkAdmin();
  console.log(currentUserRole);

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
  }

  stats.value = await getStats();
  setTimeout(() => {
    loadingPage.value = false;
  }, 500);
});
stats.value = await getStats();

watch(searchValue, async (newValue) => {
  if (newValue && newValue.key === "Enter" && newValue.text !== undefined) {
    inputTitle.value = searchValue.value.text;
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
      null,
      sortOrder.value
    );
    if (data === "No ideas found.") {
      noIdeasFoundCondition.value = true;
      totalPages.value = 0;
      ideas.value = [];
    } else {
      noIdeasFoundCondition.value = false;
      updateIdeas(data); // we need to update the for multiple use cases
    }
  }
});

async function changePage(pageNumber) {
  // every time i change the page, i should filter the pages to check from the server every page, same aplies for every method which implies changing the ideas.value
  // the ideas.value represents the ideas shown on the page, not all the images
  // this is because, from the servers, i get a list of pageSize ideas (2, 3, ...), not the whole nr of ideas
  // i emited all the filtering options for us to know which inputs are completed
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
    null,
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
  }
}

// check if user is admin
function checkAdmin() {
  if (currentUserRole === "ADMIN") {
    isAdmin.value = true;
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
}

// here, the page asc or desc is happening
async function updateSortOrder() {
  if (sortOrder.value == 0) {
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
      null,
      "ASC"
    );

    if (data === "No ideas found.") {
      noIdeasFoundCondition.value = true;
      totalPages.value = 0;
      ideas.value = [];
    } else {
      noIdeasFoundCondition.value = false;
      ideas.value = data.content;
      setCurrentVariables();
    }
  } else if (sortOrder.value == 1) {
    sortOrder.value = 1;
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
      null,
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
    }
  }
}

function loadRecievedIdeas(value) {
  ideas.value = value;
}

async function loadData() {
  loadingPage.value = true;

  ideas.value = [];

  const data = await loadPagedIdeas(
    ideaPerPage.value,
    currentPage.value - 1,
    "creationDate",
    "ASC"
  );
  ideas.value = data.content;

  loadingPage.value = false;
}

async function updateIdeas(filteredIdeas) {
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

    while (currentPage.value > totalPages.value && totalPages.value != 0) {
      currentPage.value = currentPage.value - 1;
      //OPTIMIZED A BIT SO IT WILL FILTER ONLY WHEN IT GETS TO THE RIGHT PAGE NUMBER
      if (currentPage.value == totalPages.value) {
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
          null,
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
        }
      }
    }

    // if there are no ideas
    if (totalPages.value === 0) {
      setCurrentVariables();
      currentPage.value = 0;
      ideas.value = [];
    }
  } else {
    if (filteredIdeas === "No ideas found.") {
      noIdeasFoundCondition.value = true;
      totalPages.value = 0;
      ideas.value = [];
    } else {
      noIdeasFoundCondition.value = false;
      // being sure the current page doesnt go below 0
      if (currentPage.value <= 0) {
        currentPage.value = 1;
      }
      setCurrentVariables();
      ideas.value = filteredIdeas.content;
    }
  }
}
async function changeDisplay(pageSize1) {
  ideaPerPage.value = pageSize1;
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
    null,
    "ASC"
  );

  ideas.value = data.content;
  totalPages.value = Math.ceil(data.totalElements / ideaPerPage.value);
}

// Here I pass the vars from the side panel
const onPassInputVariables = (
  inputTitleParam,
  inputTextParam,
  inputStatusParam,
  inputCategoryParam,
  inputUserParam,
  inputSelectedDateFromParam,
  inputSelectedDateToParam
) => {
  inputTitle.value = inputTitleParam;
  inputText.value = inputTextParam;
  inputStatus.value = inputStatusParam;
  inputCategory.value = inputCategoryParam;
  inputUser.value = inputUserParam;
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

const showSkeleton = ref(true);

async function changeShowGeneral() {
  showSkeleton.value = !showSkeleton.value;
  stats.value = await sendDataForCustomStats(
    selectedDateFrom.value,
    selectedDateTo.value
  );
  console.log("filtered ideas ", stats.value);
  showGenerated.value = !showGenerated.value;
  showSkeleton.value = !showSkeleton.value;
}
</script>

<template>
  <div class="all-ideas-view-container" @keyup.enter="updatePageByClick">
    <div class="left-container">
      <SidePanel
        @filter-listening="updateIdeas"
        :sort="sortOrder"
        :currentUser="null"
        :currentPage="currentPage"
        @pass-input-variables="onPassInputVariables"
        :ideasPerPage="ideaPerPage"
        @reload-data="loadData"
        :hideUser="false"
      />
    </div>
    <div
      class="right-container"
      :style="
        isAdmin
          ? { ' grid-template-columns': 'auto auto' }
          : { 'grid-template-columns': '80vw' }
      "
    >
      <div class="main-container">
        <div class="middle-container">
          <div class="sort-container" style="text-align: right">
            <label for="sortOrder">Sort by: </label>
            <select
              id="sortOrder"
              v-model="sortOrder"
              @change="updateSortOrder"
            >
              <option :value="0">Date ascending</option>
              <option :value="1">Date descending</option>
            </select>
            <div class="pageSize">
              <PageSizeSelect
                id="pageSizeSelect"
                label="Ideas:"
                @change-display="changeDisplay"
              />
            </div>
          </div>

          <div class="ideas-transition-container">
            <div
              v-for="idea in ideas"
              :key="idea.id"
              class="idea-transition-item"
            >
              <IdeaCard
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
            <div
              v-if="ideas.length === 0 && !noIdeasFoundCondition"
              class="loading-placeholder"
            >
              <CustomLoader :size="100" />
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
      <div v-if="isAdmin" class="custom-statistics">
        <div class="stats-header">
          <div class="center-class">
            <div class="title">
              <b>AIMS </b>Statistics
              <span class="material-symbols-outlined"> query_stats </span>
            </div>
          </div>

          <div class="center-class">
            <fieldset class="select-date" style="border: 1px solid slategray">
              <legend style="margin-left: 1em; padding: 0.2em 3em">
                Select Creation Date Interval
              </legend>
              <div class="date-input">
                <div>
                  <span class="from-date"> From: </span>
                  <CustomInput
                    v-model="selectedDateFrom"
                    type="date"
                    class="date-picker"
                  />
                </div>
                <div>
                  <span class="to-date"> To: </span>
                  <CustomInput
                    v-model="selectedDateTo"
                    type="date"
                    class="date-picker"
                  />
                </div>
              </div>
            </fieldset>
          </div>

          <div class="center-class">
            <button class="load-button" @click="changeShowGeneral()">
              Filter
            </button>
          </div>
        </div>
        <Suspense>
          <CustomStatistics
            :recievedFilteredStats="stats"
            :showGenerated="showGenerated"
            :showSkeleton="showSkeleton"
            @load-top5-ideas="loadRecievedIdeas"
            @load-data="loadData"
          />
        </Suspense>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  background-color: rgb(255, 255, 255);
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
  margin-top: 20px;
  transition: opacity 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-weight: normal;
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
  margin: 10px;
  font-weight: bold;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
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
  border: 1px solid black;
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
  grid-template-rows: 95% 5%;
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
  margin-bottom: 15px;
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
  margin-bottom: 2vh;
  margin-top: 5px;
}
</style>
