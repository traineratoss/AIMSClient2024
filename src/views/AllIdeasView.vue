<script setup>
import { ref, computed } from "vue";
import SidePanel from "../components/SidePanel.vue";
import IdeaCard from "../components/IdeaCard.vue";


const ideas = ref([
  { text: "Ideea 1", userId: 1 },
  { text: "Ideea 2", userId: 2 },
  { text: "Ideea 3", userId: 1 },
  { text: "Ideea 4", userId: 3 },
]);

const totalComments = ref(10); 
const totalReplies = ref(5); 
const publicIdeasCount = ref(8);
const implementedIdeasCount = ref(3); 
const ideasPerUser = ref(2);

/* These are just some random examples */

/* const totalIdeas = computed(() => ideas.value.length);  total number of ideas 

const totalUsers = computed(() => users.value.length); total number of users 

const ideasPerUser = computed(() => totalIdeas.value / totalUsers.value); - to calculate the number of ideas/user */

</script>

<template>
  <div class="all-ideas-view-container">
    <div class="sidebar-container">
      <SidePanel />
    </div>
    <div class="main-container">
      <div class="left-space">
       <!-- <h1>This div will be used to display all users and statistics</h1> -->
        <div class="stats-container">
          <div class="stat-item">
            <p class="stat-label"><b>Total Comments:</b></p>
            <p class="centered-number">{{ totalComments }}</p>
          </div>
          <div class="stat-item">
            <p class="stat-label"><b>Total Replies:</b></p>
            <p class="centered-number">{{ totalReplies }}</p>
          </div>
          <div class="spacer"></div>
          <div class="stat-item">
            <p class="stat-label"><b>Ideas/User:</b></p>
            <p class="centered-number">{{ ideasPerUser }}</p>
          </div>
          <div class="spacer"></div>
          <div class="stat-item">
            <p class="centered-number">{{ publicIdeasCount }}</p>
            <p class="stat-label"><b>Public Ideas</b></p>
          </div>
          <div class="stat-item">
            <p class="centered-number">{{ implementedIdeasCount }}</p>
            <p class="stat-label"><b>Implemented Ideas</b></p>
          </div>
        </div>
      </div>
      <div class="idea-container" v-for="idea in ideas" :key="idea.text">
        <IdeaCard :title="idea.text" />
      </div>
      <!-- <div class="right-space">
        <h1>This div will be used to display something</h1>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.all-ideas-view-container{
  width: 100%;
  display: flex;
  height: 100%;
  align-items: stretch;
  justify-content: stretch;
}

.left-space {
  width: 20vw;
  float: left;
  background-color: #c8c8ca;
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
  width: 30%;
  background-color: #b3b3b3;
  border: 1px solid black;
}

.main-container {
  width: 70%;
  height: auto;
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
.stats-container {
  margin-top: 20px; /* Space between numbers */
  text-align: center; 
}
.centered-number {
  margin: 10px 0; /* Space between numbers */
}

.spacer {
  height: 20rem; 
}
</style>
