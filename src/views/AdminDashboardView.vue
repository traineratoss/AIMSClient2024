<script setup>
import SideBar from "../components/SideBar.vue";
import UserDisplay from "../components/UserDisplay.vue";
import Pagination from "../components/Pagination.vue";
import FormTitle from "../components/FormTitle.vue";
import {
  getAllUserByUsername,
  getCurrentUsername,
} from "../services/user_service.js";
import { ref, onMounted } from "vue";

const pageSize = 10;
const currentPage = ref(1);
const totalPages = ref(0);
const users = ref([]);
const showImage = ref(false);
const showPagination = ref(true);
const usernameSearch = ref("");
const sortCategory = ref("hasPassword");
const currentUsername = getCurrentUsername();

onMounted(() => {
  updateUsersList();
});

function removeUser(user) {
  const index = users.value.indexOf(user);
  if (index !== -1) {
    users.value.splice(index, 1);
  }
  updateUsersList();
}

async function search(username) {
  usernameSearch.value = username;
  usernameSearch.value = usernameSearch.value.toLowerCase();
  await getAllUserByUsername(
    pageSize,
    currentPage.value - 1,
    sortCategory.value,
    usernameSearch.value,
    currentUsername
  )
    .then((res) => {
      if (res.total) {
        showImage.value = false;
        users.value = res.pagedUsers.content;
        totalPages.value = Math.ceil(res.total / pageSize);
        if (totalPages.value != 0) {
          currentPage.value = 1;
        }
      } else {
        showImage.value = true;
        totalPages.value = 1;
      }
    })
    .catch((error) => {
      console.log(error);
      showImage.value = true;
    });
}

async function changePage(pageNumber) {
  currentPage.value = pageNumber;
  await getAllUserByUsername(
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

function updateUsersList() {
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
}
</script>

<template>
  <div class="container">
   
    <SideBar @filter-users="search" />
    <div class="right-container">
      <FormTitle
        label="All users"
        id="title"
      />
      <div class="main-container">
        <div class="user-container">
          <img src="src/assets/img/curiosity-search.svg" v-if="showImage" />
          <UserDisplay class="users"
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
                updateUsersList();
              }
            "
            @decline-user="removeUser(user)"
            @update-role="
              user.role === 'ADMIN'
                ? (user.role = 'STANDARD')
                : (user.role = 'ADMIN')
            "
            @multiple-admin-action="updateUsersList"
          />
        </div>
        <Pagination
          :totalPages="totalPages"
          :currentPage="currentPage"
          @changePage="changePage"
          v-if="!showImage"
          class="pagination-container"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: calc(94vh - 2px);
  width: 100vw;

  display: flex;
}

.user-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 2vh;
}

.main-container {
  display: flex;
  justify-content: center;
  height: 32.5vh;
  width: 63vw;
  overflow: auto;
  align-items: flex-start;
}

.main-container::-webkit-scrollbar {
  display: block;
  width: 10px;
}

.main-container::-webkit-scrollbar-thumb {
  background-color: var(--selected-color);
  border-radius: 5px;
  border: 1px solid slategray;
}

.right-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 80vw;
}

.pagination-container {
  position: absolute;
  bottom: 1vh;
  right: 3vh;
}

img {
  height: 60vh;
}

#title {
  margin: 10vh 0;
}
</style>