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
import PageSizeSelect from "../components/PageSizeSelect.vue";

const pageSize = ref(5);
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
    pageSize.value,
    currentPage.value - 1,
    sortCategory.value,
    usernameSearch.value,
    currentUsername
  )
    .then((res) => {
      if (res.total) {
        showImage.value = false;
        users.value = res.pagedUsers.content;
        totalPages.value = Math.ceil(res.total / pageSize.value);
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
    pageSize.value,
    currentPage.value - 1,
    sortCategory.value,
    usernameSearch.value,
    currentUsername
  )
    .then((res) => {
      users.value = res.pagedUsers.content;
      totalPages.value = Math.ceil(res.total / pageSize.value);
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateUsersList() {
  const username = usernameSearch.value;
  getAllUserByUsername(
    pageSize.value,
    currentPage.value - 1,
    sortCategory.value,
    username,
    currentUsername
  )
    .then((res) => {
      users.value = res.pagedUsers.content;
      totalPages.value = Math.ceil(res.total / pageSize.value);
    })
    .catch((error) => {
      console.log("Error");
    });
}

async function changeDisplay(pageSize1) {
  pageSize.value = pageSize1;
  currentPage.value = 1;
  await getAllUserByUsername(
    pageSize.value,
    currentPage.value - 1,
    sortCategory.value,
    usernameSearch.value,
    currentUsername
  )
    .then((res) => {
      users.value = res.pagedUsers.content;
      totalPages.value = Math.ceil(res.total / pageSize.value);
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
      <FormTitle label="All users" id="title" v-if="!showImage" />
      <img src="src/assets/img/curiosity-search.svg" v-if="showImage" />
      <div class="pageSize">
        <PageSizeSelect
          id="pageSizeSelect"
          label="Users:"
          @change-display="changeDisplay"
        />
      </div>
      <div class="main-container">
        <div class="user-container">
          <UserDisplay
            class="users"
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
  bottom: 0.5vh;

  display: flex;
  justify-content: center;
}

img {
  height: 60vh;
  margin-top: 17vh;
}

#title {
  margin: 10vh 0;
}

.pageSize {
  width: 60.8vw;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2vh;
}
</style>