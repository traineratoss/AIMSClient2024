<script setup>
import { onMounted, ref, watch } from "vue";
import CustomInput from "../components/CustomInput.vue";
import CustomDropDown from "../components/CustomDropDown.vue";
import { getCategory, getUser } from "../services/idea.service";
import { filterIdeas } from "../services/idea.service";
import { defineEmits } from "vue";

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
const props = defineProps({
  sort: Number,
  currentPage: Number,
  ideasPerPage: Number,
  currentUser: String,
  hideUser: Boolean,
});

const statusOptions =
  props.currentUser === null
    ? ["OPEN", "IMPLEMENTED"]
    : ["OPEN", "DRAFT", "IMPLEMENTED"];

const emit = defineEmits(["filter-listening", "pass-input-variables"]);

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
    emit(
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

const filterData = async () => {
  await filter();
  emit("filter-listening", filteredIdeasEmit.value);
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
  const dataCategory = await getCategory();
  const categoryNames = dataCategory.map((category) => category.text);
  categoryOptions.value = categoryNames;

  const dataUser = await getUser(10, 0, "username");
  const usernames = dataUser.map((user) => user.username);
  userOptions.value = usernames;
  sortOrder.value = "ASC";
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
};

// not 100% working
function clearSelection() {
  inputTitle.value = "";
  inputText.value = "";
  categoriesSelected.value = "";
  selectedDateFrom.value = "";
  selectedDateTo.value = "";
  userSelected.value = "";
  statusSelected.value = "";
}
</script>

<template>
  <div class="side-panel-container">
    <div class="control-container">
      <span class="filter-by">Filter By:</span>
      <span class="title"> Title </span>
      <CustomInput v-model="inputTitle" class="title-input" :placeholder="`Write a title...`"
      @keydown.enter="filterData"/>

      <span class="text">Text:</span>
      <CustomInput v-model="inputText" class="text-input" :placeholder="`Write a text...`" 
      @keydown.enter="filterData"/>

      <span class="status">Status:</span>
      <CustomDropDown
        class="status-select"
        :variants="statusOptions"
        @update:selectedCategories="handleSelectedStatus"
        :canAddInDropdown="false"
        :input-placeholder="`Select your statuses...`"
        @keydown.enter="filterData"
      ></CustomDropDown>

      <span class="category">Category:</span>
      <CustomDropDown
        class="category-select"
        :variants="categoryOptions"
        @update:selectedCategories="handleSelectedCategories"
        :canAddInDropdown="false"
        :input-placeholder="`Select your categories...`"
        @keydown.enter="filterData"
      ></CustomDropDown>

      <span
        :style="{ visibility: hideUser ? 'hidden' : 'visible' }"
        v-if="currentUser == null"
        class="user"
        >User:</span
      >

      <CustomDropDown
        :style="{ visibility: hideUser ? 'hidden' : 'visible' }"
        v-if="currentUser == null"
        class="user-select"
        :variants="userOptions"
        @update:selectedCategories="handleSelectedUsers"
        :canAddInDropdown="false"
        :input-placeholder="`Select your users...`"
        @keydown.enter="filterData"
      ></CustomDropDown>
      <span v-else class="empty-span"></span>
      <div v-else class="empty-user"></div>

      <div class="date-chooser">
        <div><button @click="clearSelection()">Clear all</button></div>

        <fieldset style="border: 0.1px black solid">
          <legend style="margin-left: 1em; padding: 0.2em 0.8em">
            Creation Date
          </legend>
          <div class="date-input">
            <span class="from-date"> From: </span>
            <CustomInput
              v-model="selectedDateFrom"
              type="date"
              class="form-input"
              @keydown.enter="filterData"
            />
            <span class="to-date"> To: </span>
            <CustomInput
              v-model="selectedDateTo"
              type="date"
              class="to-input"
              @keydown.enter="filterData"
            />
          </div>
        </fieldset>
      </div>

      <button class="filter-button" @click="filterData">Filter</button>
    </div>
  </div>
</template>

<style scoped>
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
}
.to-input {
  grid-column: 2/3;
  grid-row: 2/3;
}

.from-input {
  grid-column: 2/3;
  grid-row: 1/2;
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
.category {
  grid-column: 1/2;
  grid-row: 5/6;
}
.user {
  grid-column: 1/2;
  grid-row: 6/7;
}
.title-input {
  grid-column: 2/4;
  grid-row: 2/3;
  width: 10vw;
}
.text-input {
  grid-column: 2/4;
  grid-row: 3/4;
  z-index: 5;
  width: 10vw;
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
  background-color: orange;
  font-weight: bold;
}
.empty-user {
  grid-column: 2/3;
  grid-row: 6/7;
  width: 10px;
}
.empty-span {
  grid-column: 1/2;
  grid-row: 6/7;
}
</style>
