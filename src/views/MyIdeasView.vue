<script setup>
import SidePanel from "../components/SidePanel.vue";

import { ref, onMounted, computed, watch, toRaw } from "vue";
import IdeaCard from "../components/IdeaCard.vue";
import { filterIdeas, getPagedIdeasFromUser } from "../services/idea.service";
import { getCurrentUsername } from "../services/user_service";
import Pagination from "../components/Pagination.vue";
import CustomLoader from "../components/CustomLoader.vue";
import searchValue from "../utils/search-title";
import { useRoute } from "vue-router";
import CuriositySearch from "../views/CuriositySearch.vue";

const currentUsername = getCurrentUsername();

const ideasPerPage = 15;
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

const implementedIdeasCount = ref(0);
const implementationPercentage = ref(0);

const route = useRoute();
const loadingPage = ref(true);

const noIdeasFoundCondition = ref(false);

onMounted(async () => {
    // const data = await getPagedIdeasFromUser(
    //   currentUsername,
    //   ideasPerPage,
    //   currentPage.value - 1,
    //   "ASC"
    // );

    if (searchValue.value.text !== undefined) {
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
        ideasPerPage,
        currentUsername,
        "ASC"
    );

    //checking if i get some errors in the backend
    if (data === 'No ideas found.') {
      noIdeasFoundCondition.value = true;
      sortOrder.value = 0;
      totalPages.value = 0;
      ideas.value = [];
    } else {
      noIdeasFoundCondition.value = false;
      sortOrder.value = 0;
      totalPages.value = Math.ceil(data.totalElements / ideasPerPage);
      ideas.value = data.content;
    }
});

watch(searchValue, async (newValue) => {
  if (newValue.key === "Enter" && newValue.text !== undefined) {
    setCurrentVariables();
    const data = await filterIdeas(
      inputTitle.value,
      currentText,
      currentStatus,
      currentCategory,
      currentUser,
      currentSelectedDateFrom,
      currentSelectedDateTo,
      currentPage.value - 1,
      ideasPerPage,
      currentUsername,
      sortOrder.value
    );

    if (data === 'No ideas found.') {
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
    ideasPerPage,
    currentUsername,
    sortOrder.value === 0 ? "ASC" : "DESC"
  );

  if (data === 'No ideas found.') {
    noIdeasFoundCondition.value = true;
    totalPages.value = 0;
    ideas.value = [];
  } else {
    ideas.value = data.content;
    noIdeasFoundCondition.value = false;
    currentPage.value = pageNumber;
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
      ideasPerPage,
      currentUsername,
      "ASC"
    );  

    if (data === 'No ideas found.') {
      noIdeasFoundCondition.value = true;
      totalPages.value = 0;
      ideas.value = [];
    } else {
      noIdeasFoundCondition.value = false;
      ideas.value = data.content;
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
      ideasPerPage,
      currentUsername,
      "DESC"
    );

    if (data === 'No ideas found.') {
      noIdeasFoundCondition.value = true;
      totalPages.value = 0;
      ideas.value = [];
    } else {
      noIdeasFoundCondition.value = false;
      ideas.value = data.content;
    }   
  }
}

// here, the filtering happens
async function updateIdeas(filteredIdeas) {
  totalPages.value = Math.ceil(filteredIdeas.totalElements / ideasPerPage); // the total nr of pages after filtering needs to be updated
  if (currentPage.value > totalPages.value) {
    // here, the use-case: if im on page 2 and after filtering, there is only one page left, it goes behind, etc
    // here, we go behind with one page each time so wwe know when we got to our good pageNumber
    // we have to filter each time with each page to get our good ideas

    while (currentPage.value > totalPages.value && totalPages.value != 0) {
      currentPage.value = currentPage.value - 1;
      if(currentPage.value == totalPages.value) {
        const data = await filterIdeas(
          inputTitle.value,
          inputText.value,
          inputStatus.value,
          inputCategory.value,
          inputUser.value,
          inputSelectedDateFrom.value,
          inputSelectedDateTo.value,
          currentPage.value - 1,
          ideasPerPage,
          currentUsername,
          sortOrder.value
        );

        if (data === 'No ideas found.') {
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
    if (filteredIdeas === 'No ideas found.') {
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
</script>

<template>
  <div class="all-ideas-view-container">
    <div class="sidebar-container">
      <SidePanel
        @filter-listening="updateIdeas"
        :sort="sortOrder"
        :currentUser="getCurrentUsername()"
        :currentPage="currentPage"
        @pass-input-variables="onPassInputVariables"
        :ideasPerPage="ideasPerPage"
        :hideUser="true"
      />
      />
    </div>
    <div class="main-container">
      <div class="sort-container" style="text-align: right">
        <label for="sortOrder">Sort by: </label>
        <select id="sortOrder" v-model="sortOrder" @change="updateSortOrder">
          <option :value="0">Date ascending</option>
          <option :value="1">Date descending</option>
        </select>
      </div>

      <div class="middle-container">
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
          <div v-if="ideas.length === 0 && noIdeasFoundCondition" class="no-ideas-message">
            <img src="../assets/img/curiosity-search.svg" />
            <!-- <CuriositySearch/> -->
            <br />
            <span class="black-font">Your search returned no results</span>
          </div>
          <div v-if="ideas.length === 0 && !noIdeasFoundCondition" class="loading-placeholder">
            <CustomLoader :size="100" />
          </div>
        </div>
      </div>

      <div v-if="ideas.length > 0" class="pagination-container">
        <Pagination
          :totalPages="totalPages"
          :currentPage="currentPage"
          @changePage="changePage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 91vh;
}

.idea-transition-item {
  margin-bottom: 10px;
}

.ideas-transition-container {
  margin-top: 2px;
  transition: opacity 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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

.no-ideas-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 500px;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: #ffa941;
  -webkit-text-stroke: 0.8px black;
}

.material-symbols-outlined {
  transition: transform 0.1s ease;
  margin-top: 1vh;
  font-size: 40px;
}

.material-symbols-outlined:hover {
  transform: scale(1.1);
  color: red;
}

.sort-container {
  margin: 10px;
  font-weight: bold;
}
.all-ideas-view-container {
  display: grid;
  grid-template-columns: 20vw 80vw;
}

.sidebar-container {
  background-color: #b3b3b3;
}
.middle-container {
  overflow-y: auto;
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
  height: 91vh;
  display: grid;
  grid-template-rows: 5% 90% 5%;
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
  height: 91vh;
}
.stats-container {
  margin-bottom: 75px;
  text-align: center;
  position: fixed;
  height: 91vh;
  width: 15vw;
}
.centered-number {
  margin: 1px 0; /* Space between numbers */
}

.spacer {
  height: 15rem;
}

.implementation-bar {
  width: 75%;
  height: 20px;
  background-color: #fff;
  margin: 0 auto;
  border-radius: 7.5px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background-color: #ffa941;
  transition: width 0.3s ease;
}
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80vw;
  position: fixed;
  bottom: 0.5vh;
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
</style>
