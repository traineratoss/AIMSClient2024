<script setup>
import SideBar from "../components/SideBar.vue";
import UserDisplay from "../components/UserDisplay.vue";
</script>


<template>
  <div class="container">
    <SideBar />
    <div class="user-container">
      <UserDisplay 
        name="Andrei"
        :user-role="0"
        :is-active="true"
      />
      <UserDisplay 
        name="Mihai"
        :user-role="1"
        :is-active="false"
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