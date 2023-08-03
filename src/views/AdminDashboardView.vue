<script setup>
import SideBar from "../components/SideBar.vue";
import UserDisplay from "../components/UserDisplay.vue";
import Pagination from "../components/Pagination.vue";
import {
  getAllUsersForAdmin,
  getAllUserByUsername,
  getCurrentUsername,
} from "../services/user_service.js";
import { ref, onMounted } from "vue";

const pageSize = 5;
const currentPage = ref(1);
const totalPages = ref(0);
const users = ref([]);
const showImage = ref(false);
const usernameSearch = ref("");
const sortCategory = ref("hasPassword");
const currentUsername = getCurrentUsername();

onMounted(() => {
  const username = usernameSearch.value;
  getAllUserByUsername(
    pageSize,
    currentPage.value - 1,
    sortCategory.value,
    username,
    currentUsername
  )
    .then((res) => {
      users.value = res.pagedUsers.content;
      totalPages.value = Math.ceil(res.total / pageSize);
    })
    .catch((error) => {
      console.log("Error");
    });
});

function removeUser(user) {
  const index = users.value.indexOf(user);
  if (index !== -1) {
    users.value.splice(index, 1);
  }
}

function search(username) {
  usernameSearch.value = username;
  getAllUserByUsername(
    pageSize,
    currentPage.value - 1,
    sortCategory.value,
    username,
    currentUsername
  )
    .then((res) => {
      users.value = res.pagedUsers.content;
      totalPages.value = Math.ceil(res.total / pageSize);
      if (totalPages.value != 0) {
        currentPage.value = 1;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function changePage(pageNumber) {
  currentPage.value = pageNumber;
  console.log(pageNumber);
  getAllUserByUsername(
    pageSize,
    currentPage.value - 1,
    sortCategory.value,
    usernameSearch.value,
    currentUsername
  )
    .then((res) => {
      users.value = res.pagedUsers.content;
      totalPages.value = Math.ceil(res.total / pageSize);
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>

<template>
  <div class="container">
    <SideBar @filter-users="search" />
    <div class="right-container">
      <div class="main-container">
        <div class="user-container">
          <img src="src/assets/img/curiosity-search.svg" v-if="showImage" />
          <UserDisplay
            v-for="user in users"
            v-if="!showImage"
            :key="user.username"
            :name="user.username"
            :hasPassword="user.hasPassword"
            :isActive="user.isActive"
            :userRole="user.role"
            @change-status-successful="user.isActive = !user.isActive"
            @approve-user="
              () => {
                user.isActive = true;
                user.hasPassword = true;
              }
            "
            @decline-user="removeUser(user)"
            @update-role="
              user.role === 'ADMIN'
                ? (user.role = 'STANDARD')
                : (user.role = 'ADMIN')
            "
          />
        </div>
        <Pagination
          :totalPages="totalPages"
          :currentPage="currentPage"
          @changePage="changePage"
          class="pagination-container"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: calc(91vh - 4px);
  width: 100vw;

  display: flex;
}

.user-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2vh;
  width: 80vw;
}

.right-container {
  display: flex;
  align-items: center;
}

.pagination-container {
  position: absolute;
  bottom: 1vh;
  right: 3vh;
}

img {
  height: 60vh;
}
</style>