<!-- 
    FlorinCP
    Shall be either deleted of modified 
    It was created in order to assure better fiting for the components development

 -->
<script setup>
import { onMounted, ref } from "vue";
import CustomInput from "../components/CustomInput.vue";
import CustomDropDown from "../components/CustomDropDown.vue";
import { getCategory, getUser } from "../services/idea.service";

const statusOptions = ["Open", "Implemented", "Draft"];
const categoryOptions = ref([]);
const userOptions = ref([]);
const inputTitle = ref("");
const inputText = ref("");
const selectedDateFrom = ref("");
const selectedDateTo = ref("");

onMounted(async () => {
  //getting all the available categories on mount
  const dataCategory = await getCategory();
  const categoryNames = dataCategory.map((category) => category.text);
  categoryOptions.value = categoryNames;

  //getting all the available users on mount
  const dataUser = await getUser(2, 0, "username");
  const usernames = dataUser.map((user) => user.username);
  userOptions.value = usernames;
  console.log(userOptions.value);
});
</script>

<template>
  <div class="side-panel-container">
    <div class="control-container">
      <span class="filter-by">Filter By:</span>
      <span class="title"> Title </span>
      <CustomInput v-model="inputTitle" class="title-input" />

      <span class="text">Text:</span>
      <CustomInput v-model="inputText" class="text-input" />

      <span class="status">Status:</span>
      <select v-model="selectedStatus" class="status-select">
        <option v-for="status in statusOptions" :key="status" :value="status">
          {{ status }}
        </option>
      </select>

      <span class="category">Category:</span>
      <CustomDropDown
        class="category-select"
        :variants="categoryOptions"
      ></CustomDropDown>

      <span class="user">User:</span>
      <select name="" id="" class="user-select">
        <option v-for="user in userOptions" :value="user">
          {{ user }}
        </option>
      </select>
      <div class="date-chooser">
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

      <button class="filter-button" @click="hh">filter</button>
    </div>
  </div>
</template>

<style scoped>
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
  grid-column: 2/3;
  grid-row: 2/3;
}
.text-input {
  grid-column: 2/3;
  grid-row: 3/4;
}
.status-select {
  grid-column: 2/3;
  grid-row: 4/5;
}
.category-select {
  grid-column: 2/3;
  grid-row: 5/6;
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
</style>
