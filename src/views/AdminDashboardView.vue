<script setup>
import SideBar from "../components/SideBar.vue";
import UserDisplay from "../components/UserDisplay.vue";
import Pagination from "../components/Pagination.vue";
import { getAllUsersForAdmin } from "../services/user_service.js";
import { ref, onMounted } from "vue";

const pageSize = 5;
const currentPage = ref(1);
const users = ref([]);

onMounted(() => {
  getAllUsersForAdmin(pageSize, currentPage.value - 1, "hasPassword")
    .then((res) => {
      users.value = res.pagedUsers.content;
    })
    .catch((error) => {
      console.log("Error");
    });
});

function changePage() {
  currentPage.value++;
  getAllUsersForAdmin(pageSize, currentPage.value - 1, "hasPassword")
    .then((res) => {
      users.value = res.content;
    })
    .catch((error) => {
      console.log("Error");
    });
}

function removeUser(user) {
  const index = users.value.indexOf(user);
  if (index !== -1) {
    users.value.splice(index, 1);
  }
}
</script>

<template>
  <div class="container">
    <SideBar />
    <div class="right-container">
      <div class="main-container">
        <div class="user-container">
          <UserDisplay
            v-for="user in users"
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
</style>