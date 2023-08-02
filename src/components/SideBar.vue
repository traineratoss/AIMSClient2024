<script setup>
import CustomButton from "../components/CustomButton.vue";
import CustomButtonGray from "../components/CustomButtonGray.vue";
import CustomInput from "./CustomInput.vue";
import { ref } from "vue";
import { getAllUserByUsername } from "../services/user_service";

const username = ref("");

const emit = defineEmits(["filter-users"]);

function filterUsers() {
  emit("filter-users", username.value);
}
</script>


<template>
  <div class="side-panel">
    <div class="options">
      <CustomButton class="btn">All users</CustomButton>
      <CustomButtonGray class="btn" label="Statistics" />
    </div>
    <div class="filters">
      <h1>Filter by:</h1>
      <div class="input-filter">
        <label for="name">Name: </label>
        <CustomInput
          type="text"
          id="username"
          v-model:model-value="username"
          @keydown.enter="filterUsers"
        />
      </div>
      <CustomButton class="btn" id="filter-btn" @click="filterUsers"
        >Filter</CustomButton
      >
    </div>
  </div>
</template>

<style scoped>
.side-panel {
  height: 100%;
  width: 20vw;

  background-color: var(--sidebar-color);
  border: 1px solid black;
}

.btn {
  width: 5vw;
  height: 2vh;

  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.5px solid black;
}

.options {
  margin-top: 10px;

  display: flex;
  gap: 2vw;
  justify-content: center;
}

.filters {
  margin: 5vh 0 0 1vw;

  display: flex;
  flex-direction: column;
  gap: 2vh;
}

#filter-btn {
  margin-left: 5.19vw;
  margin-top: 5vh;
}

.input-filter {
  display: flex;
  align-items: center;
  gap: 5vw;
}

input {
  width: 10vw;
  border: 0.5 solid black;
}

label {
  font-weight: bold;
}
</style>