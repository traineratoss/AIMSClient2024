<script setup>
import SideBar from "../components/SideBar.vue";
import UserDisplay from "../components/UserDisplay.vue";
import { getAllUsers, getAllUserByUsername } from "../services/user_service.js";
import { ref, computed, onMounted } from "vue";

const pageSize = 5;
const pageNumber = ref(0);

const users = ref([]);
// const users = ref([
//   { username: "test", userId: 1 },
//   { username: "test2", userId: 2 },
//   { username: "test3", userId: 3 },
// ])

onMounted(() => {
  getAllUsers(pageSize, pageNumber.value, "username")
    .then((res) => {
      users.value = res.content;
      console.log(users.value);
    })
    .catch((error) => {
      console.log("Error");
    });
});

// const paginatedUsers = computed(() => {
//   const startIndex = (pageNumber.value - 1) * pageSize;
//   return users.value.slice(startIndex, startIndex + pageSize);
// });

// const totalPages = computed(() => Math.ceil(users.value.length / pageSize));
</script>


<template>
  <div class="container">
    <SideBar />
    <div class="user-container">
      <UserDisplay
        v-for="user in users"
        :key="user.username"
        :name="user.username"
        :isActive="Deactivate"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  height: calc(93vh - 4px);
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
</style>