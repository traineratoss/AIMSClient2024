<script setup>
import { ref, computed } from "vue";
import SidePanel from "../components/SidePanel.vue";
import IdeaCard from "../components/IdeaCard.vue";
import AllIdeasList from "../components/AllIdeasList.vue"

const ideas = ref([
  { text: "Idea 1" },
  { text: "Idea 2" },
  { text: "Idea 3" },
  { text: "Idea 4" },
  { text: "Idea 5" },
  { text: "Idea 4" },
  { text: "Idea 5" },
  { text: "Idea 4" },
  { text: "Idea 5" },
  { text: "Idea 4" },
  { text: "Idea 5" }
]);

</script>

<template>
  <div class="big-container">
  <div class="sidebar-container">
    <!-- SidePanel component here -->
  </div>
  <div class="left-space">
    <h1>This div will be used to display all users and statistics</h1>
  </div>
  <div class="main-container">
    <AllIdeasList :ideas="ideas" />
  </div>
  <!-- <div class="right-space">
      <h1>This div will be used to display something</h1>
  </div> -->
  </div>
</template>

<style scoped>
.left-space {
  width: 20vw;
  float: left;
  background-color: rgb(247, 161, 161);
  height: 92vh;
  border: 1px solid black;
}
.right-space {
  width: 20vw;
  float: right;
  background-color: rgb(247, 161, 161);
  height: 92vh;
  border: 1px solid black;
}
.sidebar-container {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  left: 0;
  width: 18vw;
  float: left;
  height: 92vh;
  background-color: var(--sidebar-color);
  border: 1px solid black;
}

.main-container {
  width: 82vh;
  height: 100%
}

.idea-container {
  width: calc(33.33% - 9vw); /* 33.33% width minus margins on both sides */
  float: left;
  border: 1px solid black;
  margin: 2.5vw; /* Adjust the margin as needed */
  
}
.big-container{
  display: flex;
  justify-content: center;
  height: 92vh;
}
</style>
