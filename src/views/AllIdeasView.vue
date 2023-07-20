<script setup>
import { ref } from "vue";
import SidePanel from "../components/SidePanel.vue";
import IdeaCard from "../components/IdeaCard.vue";

const ideas = ref([{ text: "Ideea 1" }, { text: "Ideea 2" }, { text: "Ideea 3" }]);
</script>

<template>
  <div class="sidebar-container">
    <SidePanel />
  </div>
  <div class="main-container">
    <div class="left-space">
      <h1>This div will be used to display all users and statistics</h1>
    </div>
    <div class="idea-container" v-for="idea in ideas" :key="idea.text">
      <IdeaCard :title="idea.text"/>
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
  width: 80vw;
  float: right;
  height: auto;
}

.idea-container {
  width: auto;
  float: left;
  border: 1px solid black;
  margin: 4.5vw;
}
</style>
