<script setup>
import { onMounted, ref, watch } from "vue";
import CustomDropDown from "../components/CustomDropDown.vue";
import CustomInput from "./CustomInput.vue";
import { getCategory, getUser } from "../services/idea.service";
import { filterIdeas } from "../services/idea.service";
import { defineEmits } from "vue";
import generatedStatisticsToBeSend from "../utils/stats-transition-container";
import searchValue from "../utils/search-title";
import { onBeforeUnmount } from "vue";

window.addEventListener("keydown", handleGlobalKeyDown);

const props = defineProps({
  sort: Number,
  currentPage: Number,
  ideasPerPage: Number,
  currentUser: String,
  hideUser: Boolean,
});

const categoryOptions = ref([]);
const categoriesSelected = ref([]);
const userOptions = ref([]);
const userSelected = ref([]);
const statusSelected = ref([]);
const inputTitle = ref("");
const inputText = ref("");
const selectedDateFrom = ref("");
const selectedDateTo = ref("");
const sortOrder = ref("ASC");
const filteredIdeasEmit = ref({});

const clearAllDropdownValues = ref(false);

const statusOptions =
  props.currentUser === null
    ? ["OPEN", "IMPLEMENTED"]
    : ["OPEN", "DRAFT", "IMPLEMENTED"];

const emits = defineEmits([
  "filter-listening",
  "pass-input-variables",
  "generatedStatistics",
  "reloadData",
]);

watch(
  [
    inputTitle,
    inputText,
    statusSelected,
    categoriesSelected,
    userSelected,
    selectedDateFrom,
    selectedDateTo,
  ],
  ([
    newInputTitle,
    newInputText,
    newStatusSelected,
    newCategoriesSelected,
    newUserSelected,
    newSelectedDateFrom,
    newSelectedDateTo,
  ]) => {
    emits(
      "pass-input-variables",
      newInputTitle,
      newInputText,
      newStatusSelected,
      newCategoriesSelected,
      newUserSelected,
      newSelectedDateFrom,
      newSelectedDateTo
    );
  }
);

watch(searchValue, (newValue) => {
  if (newValue && newValue.text !== undefined) {
    inputTitle.value = newValue.text;
  }
});

//when pressing anywhere on the page the Enter key, we will filter
function handleGlobalKeyDown(event) {
  if (event.key === "Enter") {
    filterData();
  }
}

function loadData() {
  emits("reloadData");
}

const filterData = async () => {
  await filter();
  emits("filter-listening", filteredIdeasEmit.value);
};

async function handleSelectedCategories(selectedCategories) {
  categoriesSelected.value = selectedCategories;
}

async function handleSelectedUsers(selectedUsers) {
  userSelected.value = selectedUsers;
}
async function handleSelectedStatus(selectedStatus) {
  statusSelected.value = selectedStatus;
}

onMounted(async () => {
  if (searchValue && searchValue.value && searchValue.value.text) {
    inputTitle.value = searchValue.value.text; // each time we mount a view, we set the title to be the one from the search bar
    // so they wont be different
  } else {
    inputTitle.value = "";
  }
  const dataCategory = await getCategory();
  const categoryNames = dataCategory.map((category) => category.text);
  categoryOptions.value = categoryNames;

  const dataUser = await getUser(10, 0, "username");
  const usernames = dataUser.map((user) => user.username);
  userOptions.value = usernames;
  sortOrder.value = "ASC";
  console.log(userOptions);
});

const filter = async () => {
  const title = inputTitle.value;
  const text = inputText.value;
  const category = categoriesSelected.value;
  const dateFrom = selectedDateFrom.value;
  const dateTo = selectedDateTo.value;
  const user = userSelected.value;
  const status = statusSelected.value;

  const filteredIdeas = await filterIdeas(
    title,
    text,
    status,
    category,
    user,
    dateFrom,
    dateTo,
    props.currentPage - 1,
    props.ideasPerPage,
    props.currentUser,
    props.sort
  );

  filteredIdeasEmit.value = filteredIdeas;
  searchValue.value = title;
};

// clearing all when pressing the clear button
function clearSelection() {
  searchValue.value = {
    text: "",
    key: "",
  };
  inputTitle.value = "";
  inputText.value = "";
  selectedDateFrom.value = "";
  selectedDateTo.value = "";
  categoriesSelected.value = [];
  userSelected.value = [];
  statusSelected.value = [];
  clearAllDropdownValues.value = true;
  setTimeout(() => {
    clearAllDropdownValues.value = false;
  }, 10);
}

function displaySelection(categoriesList) {
  let finalList = "";

  if (categoriesList.length === 1) {
    finalList += categoriesList;

    return finalList;
  }

  for (let category of categoriesList) {
    if (categoriesList.indexOf(category) === categoriesList.length - 1)
      finalList += category;
    else finalList += category + ", ";
  }

  return finalList;
}

function setPosition(componentId, overlayId) {
  const component = document.getElementById(componentId);
  const overlay = document.getElementById(overlayId);

  if (component && overlay) {
    const componentCoords = component.getBoundingClientRect();
    const x = componentCoords.left;
    const y = componentCoords.top;

    overlay.style.marginTop = y + 25 + "px";
    overlay.style.marginLeft = x + "px";
  }
}

watch(categoriesSelected, () => {
  if (categoriesSelected.value.length === 1 && userSelected.value.length === 0)
    setPosition("categorySelect", "displayCategories");
  else if (
    categoriesSelected.value.length === 1 &&
    userSelected.value.length > 0
  ) {
    setPosition("categorySelect", "displayCategories");
    setTimeout(() => {
      setPosition("userSelect", "displayUsers");
    }, "10");
  } else if (
    categoriesSelected.value.length === 0 &&
    userSelected.value.length > 0
  ) {
    setTimeout(() => {
      setPosition("userSelect", "displayUsers");
    }, "10");
  }
});

watch(statusSelected, () => {
  if (
    statusSelected.value.length === 1 &&
    categoriesSelected.value.length === 0
  )
    setPosition("statusSelect", "displayStatuses");
  else if (
    statusSelected.value.length === 1 &&
    categoriesSelected.value.length > 0
  ) {
    setPosition("statusSelect", "displayStatuses");
    setTimeout(() => {
      setPosition("categorySelect", "displayCategories");
    }, "10");
  } else if (
    statusSelected.value.length === 0 &&
    categoriesSelected.value.length > 0
  ) {
    setTimeout(() => {
      setPosition("categorySelect", "displayCategories");
    }, "10");
  }

  if (statusSelected.value.length === 1 && userSelected.value.length > 0) {
    setPosition("statusSelect", "displayStatuses");
    setTimeout(() => {
      setPosition("userSelect", "displayUsers");
    }, "10");
  } else if (
    statusSelected.value.length === 0 &&
    userSelected.value.length > 0
  ) {
    setTimeout(() => {
      setPosition("userSelect", "displayUsers");
    }, "10");
  }
});

watch(userSelected, () => {
  if (userSelected.value.length === 1) {
    setPosition("userSelect", "displayUsers");
  }
});
</script>

<template>
  <div class="side-panel-container">
    <div class="control-container">
      <span class="filter-by">Filter By:</span>

      <button class="buttons-container" @click="clearSelection()">
        Clear all
      </button>

      <span class="title"> Title: </span>
      <CustomInput
        v-model="inputTitle"
        class="title-input"
        :placeholder="`Write a title...`"
        :can-modify-search-value="true"
      />

      <span class="text">Text:</span>
      <CustomInput
        v-model="inputText"
        class="text-input"
        :placeholder="`Write a text...`"
        :can-modify-search-value="false"
      />

      <span :class="statusSelected.length > 0 ? 'status2' : 'status'"
        >Status:</span
      >
      <CustomDropDown
        class="status-select"
        id="statusSelect"
        :variants="statusOptions"
        @update:selectedOptions="handleSelectedStatus"
        :canAddInDropdown="false"
        :input-placeholder="`Select your statuses...`"
        :clear-all="clearAllDropdownValues"
      ></CustomDropDown>

      <div class="display-statuses-container" id="displayStatuses">
        <div class="display-statuses">
          {{ displaySelection(statusSelected) }}
        </div>
      </div>

      <span :class="categoriesSelected.length > 0 ? 'category2' : 'category'"
        >Category:</span
      >
      <CustomDropDown
        class="category-select"
        id="categorySelect"
        :variants="categoryOptions"
        @update:selectedOptions="handleSelectedCategories"
        :canAddInDropdown="false"
        :input-placeholder="`Select your categories...`"
        :clear-all="clearAllDropdownValues"
      ></CustomDropDown>

      <div class="display-categories-container" id="displayCategories">
        <div class="display-categories">
          {{ displaySelection(categoriesSelected) }}
        </div>
      </div>
      <!--Empty comment-->
      <span
        :style="{ visibility: hideUser ? 'hidden' : 'visible' }"
        :class="userSelected.length > 0 ? 'user2' : 'user'"
        >User:</span
      >

      <CustomDropDown
        :style="{ visibility: hideUser ? 'hidden' : 'visible' }"
        class="user-select"
        id="userSelect"
        :variants="userOptions"
        @update:selectedOptions="handleSelectedUsers"
        :canAddInDropdown="false"
        :input-placeholder="`Select your users...`"
        :clear-all="clearAllDropdownValues"
      ></CustomDropDown>

      <div class="display-users-container" id="displayUsers">
        <div class="display-users">
          {{ displaySelection(userSelected) }}
        </div>
      </div>

      <div class="date-chooser">
        <fieldset style="border: 1px solid slategray">
          <legend style="margin-left: 1em; padding: 0.2em 0.8em">
            Creation Date
          </legend>
          <div class="date-input">
            <span class="from-date"> From: </span>
            <CustomInput
              v-model="selectedDateFrom"
              type="date"
              class="from-input"
            />
            <span class="to-date"> To: </span>
            <CustomInput
              v-model="selectedDateTo"
              type="date"
              class="to-input"
            />
          </div>
        </fieldset>
      </div>

      <button class="filter-button" @click="filterData">Filter</button>
      <button class="load-button" @click="loadData()">Reload Ideas</button>
    </div>
  </div>
</template>

<style scoped>
.load-button {
  grid-column: 1/3;
  grid-row: 9/9;
  align-self: stretch;
  background-color: rgba(255, 255, 255, 0.801);
  font-weight: bold;
  border: 1px solid slategray;
  cursor: pointer;
  border-radius: 3px;
}

.load-button:hover {
  background-color: rgb(198, 198, 198);
}
.side-panel-container {
  width: 20vw;
  padding-top: 2vw;
  border: 1px solid slategray;
  height: 91vh;
}
.date-input {
  display: grid;
  grid-template-rows: repeat(3, auto);
  grid-gap: 20px;
  font-size: 20;
  font-weight: bold;
  border-radius: 3px;
}
.to-input {
  grid-column: 2/3;
  grid-row: 2/3;
  border-radius: 3px;
}

.from-input {
  grid-column: 2/3;
  grid-row: 1/2;
  border-radius: 3px;
}
.to-date {
  grid-column: 1/2;
  grid-row: 2/3;
}
.from-date {
  grid-column: 1/2;
  grid-row: 1/2;
}

.control-container {
  display: grid;
  grid-template-columns: max-content max-content;
  grid-template-rows: repeat(9, auto);
  justify-content: space-around;
  grid-gap: 20px;
  font-size: 20;
  font-weight: bold;
  margin-left: 1vw;
  margin-right: 1vw;
  width: 20vw;
  min-width: 0;
}
.filterby {
  grid-column: 1/2;
  grid-row: 1/2;
}
.title {
  grid-column: 1/2;
  grid-row: 2/3;
}
.text {
  grid-column: 1/2;
  grid-row: 3/4;
}

.status {
  grid-column: 1/2;
  grid-row: 4/5;
}

.status2 {
  grid-column: 1/2;
  grid-row: 4/5;
  margin-bottom: 25px;
}

.display-statuses-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 25px;
  z-index: 1;
}

.display-statuses {
  white-space: nowrap;
  max-width: 200px;
  font-weight: 500;
  overflow-x: auto;
}
.category {
  grid-column: 1/2;
  grid-row: 5/6;
}

.category2 {
  grid-column: 1/2;
  grid-row: 5/6;
  margin-bottom: 30px;
}

.display-categories-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 25px;
  z-index: 1;
}

.display-categories {
  white-space: nowrap;
  max-width: 200px;
  font-weight: 500;
  overflow-x: auto;
}

/* .display-categories::-webkit-scrollbar {
  display: block;
  width: 5px;
}

.display-categories::-webkit-scrollbar-thumb {
  background-color: #eb9224;
  border-radius: 5px;
  border: 1px solid slategray; 
}*/

.user {
  grid-column: 1/2;
  grid-row: 6/7;
}

.user2 {
  grid-column: 1/2;
  grid-row: 6/7;
  /* margin-bottom: 25px; */
}

.display-users-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 25px;
  z-index: 1;
}

.display-users {
  white-space: nowrap;
  max-width: 200px;
  font-weight: 500;
  overflow-x: auto;
}
.title-input {
  grid-column: 2/4;
  grid-row: 2/3;
  width: 10vw;
  border-radius: 3px;
}
.text-input {
  grid-column: 2/4;
  grid-row: 3/4;
  z-index: 5;
  width: 10vw;
  border-radius: 3px;
}
.status-select {
  grid-column: 2/4;
  grid-row: 4/5;
  z-index: 6;
  width: 10vw;
}
.category-select {
  grid-column: 2/4;
  grid-row: 5/6;
  z-index: 5;
}
.user-select {
  grid-column: 2/3;
  grid-row: 6/7;
}
.date-chooser {
  grid-column: 1/3;
  grid-row: 7/8;
  margin-top: 70px;
}
.filter-button {
  grid-column: 1/3;
  grid-row: 8/9;
  align-self: stretch;
  background-color: #ffa941;
  font-weight: bold;
  border: 1px solid slategray;
  cursor: pointer;
  border-radius: 3px;
}

.filter-button:hover {
  background-color: #ff8f00;
}

.buttons-container {
  grid-column: 2/3;
  grid-row: 1/2;
  justify-self: end;
  width: 100px;
  background-color: rgba(255, 255, 255, 0.801);
  font-weight: 600;
  border: 1px solid slategray;
  cursor: pointer;
  border-radius: 3px;
}

.buttons-container:hover {
  background-color: rgb(198, 198, 198);
}
</style>
