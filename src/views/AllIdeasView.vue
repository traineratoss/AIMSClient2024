<template>
  <div class="all-ideas-view-container">
    <div class="sidebar-container">
      <SidePanel />
    </div>
    <div class="main-container">
      <div class="left-space">
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
            <p class="centered-number">{{ roundedNumber(ideasPerUser) }}</p>
          </div>
          <div class="spacer"></div>
          <div class="stat-item">
            <p class="centered-number">{{ publicIdeasCount }}</p>
            <p class="stat-label"><b>Public Ideas</b></p>
          </div>
          <div class="stat-item">
            <p class="centered-number">{{ implementedIdeasCount }}</p>
            <p class="stat-label"><b>Implemented Ideas</b></p>
            <br>
          <div class="implementation-bar">
            <div class="fill" :style="{ width: implementationPercentage + '%' }"></div>
          </div>
          </div>
        </div>
      </div>
      <div class="idea-container" v-for="idea in paginatedIdeas" :key="idea.text">
          <IdeaCard :title="idea.text" />
        </div>
        <div class="pagination-container">
          <span
            class="page-number"
            v-for="pageNumber in totalPages"
            :key="pageNumber"
            :class="{ active: currentPage === pageNumber }"
            @click="changePage(pageNumber)"
          >
            {{ pageNumber }}
          </span>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import SidePanel from "../components/SidePanel.vue";
import IdeaCard from "../components/IdeaCard.vue";

const ideasPerPage = 2;
const currentPage = ref(1);

const ideas = ref([
  { text: "Idea 1", userId: 1, isPublic: true, isImplemented: true, comments: 2, replies: 3 },
  { text: "Idea 2", userId: 3, isPublic: true, isImplemented: false, comments: 1, replies: 1 },
  { text: "Idea 3", userId: 1, isPublic: true, isImplemented: false, comments: 3, replies: 2 },
  { text: "Idea 4", userId: 2, isPublic: true, isImplemented: false, comments: 5, replies: 0 },
]);

const totalIdeas = computed(() => ideas.value.length);

const totalComments = computed(() => {
  let total = 0;
  for (const idea of ideas.value) {
    total += idea.comments || 0;
  }
  return total;
});

const totalReplies = computed(() => {
  let total = 0;
  for (const idea of ideas.value) {
    total += idea.replies || 0;
  }
  return total;
});

const publicIdeasCount = computed(() => {
  let count = 0;
  for (const idea of ideas.value) {
    if (idea.isPublic) {
      count++;
    }
  }
  return count;
});

const implementedIdeasCount = computed(() => {
  let count = 0;
  for (const idea of ideas.value) {
    if (idea.isImplemented) {
      count++;
    }
  }
  return count;
});

const ideasPerUser = computed(() => {
  const users = new Set(ideas.value.map((idea) => idea.userId));
  return totalIdeas.value / users.size;
});

const implementationPercentage = computed(() => {
  if (publicIdeasCount.value === 0) {
    return 0;
  }
  return (implementedIdeasCount.value / publicIdeasCount.value) * 100;
});

const roundedNumber = (number) => {
  return Math.round(number * 100) / 100;
};

const paginatedIdeas = computed(() => {
  const startIndex = (currentPage.value - 1) * ideasPerPage;
  return ideas.value.slice(startIndex, startIndex + ideasPerPage);
});

const totalPages = computed(() => Math.ceil(ideas.value.length / ideasPerPage));

function changePage(pageNumber) {
  currentPage.value = pageNumber;
}

watch(ideas, () => {
  calculateStatistics();
});

function calculateStatistics() {
  totalComments.value = calculateTotalComments();
  totalReplies.value = calculateTotalReplies();
  publicIdeasCount.value = calculatePublicIdeasCount();
  implementedIdeasCount.value = calculateImplementedIdeasCount();
}
</script>


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
  width: 20%;
  background-color: #b3b3b3;
  border: 1px solid black;
}

.main-container {
  width: 70%;
  height: auto;
}

.idea-container {
  display: flex;
  justify-content: center; 
  align-items: center; 
  width: calc(50% - 20px); /* 50% width minus margins on both sides */
  margin: 10px auto; /* Center the ideas horizontally */
  border: 1px solid black;
  padding: 10px;
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

.implementation-bar {
  width: 80%;
  height: 15px;
  background-color: #fff;
  margin: 0 auto; 
  border-radius: 7.5px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background-color: #ffa941;
  transition: width 0.3s ease;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.page-number {
  display: inline-block;
  margin: 0 5px;
  padding: 5px 10px; 
  border: 1px solid #000;
  border-radius: 999px; 
  background-color: transparent; 
  cursor: pointer;
}

.page-number.active {
  background-color: #000;
  color: #fff;
}
</style>
