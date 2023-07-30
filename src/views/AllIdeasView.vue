<script setup>
import SidePanel from "../components/SidePanel.vue";
import { ref, onMounted, computed, watch, toRaw } from "vue";
import IdeaCard from "../components/IdeaCard.vue";
import { filterIdeas, loadPagedIdeas } from "../services/idea.service";
import { getCurrentUser } from "../services/user_service";
import Pagination from "../components/Pagination.vue";

const ideasPerPage = 15;
const currentPage = ref(1);
const ideas = ref([]);
const loggedUser = ref("");
const pageNumber = ref(1);
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

onMounted(async () => {
  const data = await loadPagedIdeas(
    ideasPerPage,
    pageNumber.value-1,
    "date",
    "ASC"
  );
  loggedUser.value = getCurrentUser();
  sortOrder.value = 0;
  totalPages.value = Math.ceil(data.total / ideasPerPage);
  ideas.value = data.pagedIdeas.content;
  const totalNumberOfIdeas = data.total;

  //STILL WORKING, ENED TO RETREIVE ALL THE IDEAS UNPAGED FROM THE SV
  //now, checking the nr of implemented ideas
  // ideas.value.forEach(idea => {
  //   if (idea.status === "IMPLEMENTED") {
  //     implementedIdeasCount.value++;
  //   }
  // });

  // implementationPercentage.value = 100 * (implementedIdeasCount.value / 15);
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
    pageNumber-1,
    ideasPerPage,
    sortOrder.value === 0 ? "ASC" : "DESC"
  );
  loggedUser.value = getCurrentUser();
  ideas.value = data.pagedIdeas.content;
  currentPage.value = pageNumber;
}

const totalComments = computed(() => {
  let total = 0;
  for (const idea of ideas.value) {
    total += idea.comments || 0;
  }
  return total;
});

const totalReplies = computed(() => {
  let total = 0;
  for (const idea in ideas.value) {
    total += idea.replies || 0;
  }
  return total;
});

const publicIdeasCount = computed(() => {
  let count = 0;
  for (const idea of ideas.value) {
    if (idea.isPublic) {
      count++;
    }
  }
  return count;
});

const ideasPerUser = computed(() => {
  const users = new Set(ideas.value.map((idea) => idea.userId));
  if (users.size != 0) {
    return (totalPages.value * ideasPerPage) / users.size;
  } else {
   
    return 0;
  }
});

// const implementationPercentage = computed(() => {
//   if (publicIdeasCount.value === 0) {
//     return 0;
//   }
//   return (implementedIdeasCount.value / publicIdeasCount.value) * 100;
// });

const roundedNumber = (number) => {
  return Math.round(number * 100) / 100;
};

function goToPage(pageNumber) {
  currentPage.value = pageNumber;
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
      currentPage.value-1,
      ideasPerPage,
      "ASC" 
    );
    loggedUser.value = getCurrentUser();
    ideas.value = data.pagedIdeas.content;

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
        currentPage.value-1,
        ideasPerPage,
        "DESC" 
      );
      loggedUser.value = getCurrentUser();
      ideas.value = data.pagedIdeas.content;
  }
}

// here, the filtering happens
async function updateIdeas(filteredIdeas) {
  totalPages.value = Math.ceil(filteredIdeas.total / ideasPerPage); // the total nr of pages after filtering needs to be updated

  if (currentPage.value > totalPages.value){ // here, the use-case: if im on page 2 and after filtering, there is only one page left, it goes behind, etc
    // here, we go behind with one page each time so wwe know when we got to our good pageNumber
    // we have to filter each time with each page to get our good ideas

    while(currentPage.value>totalPages.value && totalPages.value != 0) {
      currentPage.value = currentPage.value - 1;
      const data = await filterIdeas(
        inputTitle.value,
        inputText.value,
        inputStatus.value,
        inputCategory.value,
        inputUser.value,
        inputSelectedDateFrom.value,
        inputSelectedDateTo.value,
        currentPage.value-1,
        ideasPerPage,
        sortOrder.value,
      );
      setCurrentVariables();
      loggedUser.value = getCurrentUser();
      ideas.value = data.pagedIdeas != null ? data.pagedIdeas.content : [];
    }

    // if there are no ideas
    if(totalPages.value === 0) {
      setCurrentVariables();
      loggedUser.value = getCurrentUser();
      currentPage.value = 0;
      ideas.value = [];
    }

  } else {

    // being sure the current page doesnt go below 0
    if(currentPage.value <= 0) {
      currentPage.value = 1;
    }

    setCurrentVariables();
    loggedUser.value = getCurrentUser();
    ideas.value = filteredIdeas.pagedIdeas.content;
  }
}


// Here I pass the vars from the side panel
const onPassInputVariables = (inputTitleParam, inputTextParam, inputStatusParam, inputCategoryParam, inputUserParam, inputSelectedDateFromParam, inputSelectedDateToParam) => {
  
inputTitle.value = inputTitleParam;
  inputText.value = inputTextParam;
  inputStatus.value = inputStatusParam;
  inputCategory.value = inputCategoryParam;
  inputUser.value = inputUserParam;
  inputSelectedDateFrom.value = inputSelectedDateFromParam;
  inputSelectedDateTo.value = inputSelectedDateToParam;
};

// watch(ideas, () => {
//   calculateStatistics();
// });

// function calculateStatistics() {
//   totalComments.value = calculateTotalComments();
//   totalReplies.value = calculateTotalReplies();
//   publicIdeasCount.value = calculatePublicIdeasCount();
//   implementedIdeasCount.value = calculateImplementedIdeasCount();
// }
</script>

<template>
  <div class="all-ideas-view-container">
    <div class="sidebar-container">
      <SidePanel @filter-listening="updateIdeas" :sort="sortOrder" :currentPage="currentPage" @pass-input-variables="onPassInputVariables" :ideasPerPage="ideasPerPage" />
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
        <div class="stats-container">
          <div class="stat-item">
            <p class="stat-label"><b>Total Comments:</b></p>
            <!-- <p class="centered-number"><b>{{ totalComments }}</b></p> -->
          </div>
          <div class="stat-item">
            <p class="stat-label"><b>Total Replies:</b></p>
            <p class="centered-number">
              <b>{{ totalReplies }}</b>
            </p>
          </div>
          <div class="spacer"></div>
          <div class="stat-item">
            <p class="stat-label"><b>Ideas/User:</b></p>
            <p class="centered-number">
              <b>{{ roundedNumber(ideasPerUser) }}</b>
            </p>
          </div>
          <div class="spacer" style="height: 50px;"></div>
          <div class="stat-item">
            <p class="stat-label"><b>Public Ideas</b></p>
            <p class="centered-number">
              <b>{{ publicIdeasCount }}</b>
            </p>
          </div>
          <div class="stat-item">
            <p class="stat-label"><b>Implemented Ideas</b></p>
            <p class="centered-number">
              <b>{{ implementedIdeasCount }}</b>
            </p>
            <br />
            <div class="implementation-bar">
              <div
                class="fill"
                :style="{ width: implementationPercentage + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <div class="ideas-transition-container">
        <div v-for="idea in ideas" :key="idea.id" class="idea-transition-item">
          <IdeaCard
            :title="idea.title"
            :text="idea.text"
            :status="idea.status"
            :user="idea.username"
            :ideaId="idea.id"
          />
        </div>
        <div v-if="ideas.length === 0" class="no-ideas-message">
          No ideas found
          <br />
          <span class="material-symbols-outlined">search_off</span>
        </div>

      </div>
      </div>

      <div v-if="ideas.length > 0" class="pagination-container">
          <Pagination :totalPages="totalPages" :currentPage="currentPage" @changePage="changePage" />
        </div>
  
    </div>
  </div>
</template>

<style scoped>

.idea-transition-item{
  margin-bottom: 10px;
}

.ideas-transition-container {
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

.fade-enter, .fade-leave-to {
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
  border: 1px solid black;
  background-color: #b3b3b3;
  height: 91vh;
}
.middle-container{
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
  justify-content: flex-end;
  align-items: center;
  width: 80vw;
  position: fixed;
  bottom: 5vh;
  right: 1vw; 
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