<script setup>
import { ref } from "vue";
import SidePanel from "../components/SidePanel.vue";
import IdeaCard from "../components/IdeaCard.vue";

const ideas = ref([{}, {}, {}]);
</script>

<template>
  <div class="main-container">
    <div class="idea-container" v-for="idea in ideas" :key="idea.text">
      <IdeaCard :title="idea.text" />
    </div>
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
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
}

.idea-container {
  width: auto;
  float: left;
  border: 1px solid black;
  margin: 4.5vw;
}
</style>
