<template>
  <div class="all-ideas-view-container">
    <div class="sidebar-container">
      <SidePanel />
    </div>
    <div class="main-container">
      <div class="idea-container" v-for="idea in paginatedIdeas" :key="idea.text">
        <IdeaCard :title="idea.text" />
      </div>
      <div class="pagination-container">
        <span
          v-if="currentPage !== 1 && totalPages > 1"
          class="page-number arrow"
          @click="goToPage(1)"
        >
        <span class="material-symbols-outlined">
          keyboard_double_arrow_left
        </span>
        </span>
        <span
          v-if="currentPage > 2"
          class="page-number arrow"
          @click="goToPage(currentPage - 1)"
        >
        <span class="material-symbols-outlined">
          navigate_before
        </span>
        </span>
        <span class="page-number current-page">
          {{ currentPage }}
        </span>
        <span
          v-if="currentPage < totalPages - 1"
          class="page-number arrow"
          @click="goToPage(currentPage + 1)"
        >
        <span class="material-symbols-outlined">
          navigate_next
        </span>
        </span>
        <span
          v-if="currentPage !== totalPages && totalPages > 1"
          class="page-number arrow"
          @click="goToPage(totalPages)"
        >
        <span class="material-symbols-outlined">
          keyboard_double_arrow_right
        </span>
        </span>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed } from "vue";
import SidePanel from "../components/SidePanel.vue";
import IdeaCard from "../components/IdeaCard.vue";

const ideasPerPage = 2;
const currentPage = ref(1);

const ideas = ref([
  { text: "Idea 1", userId: 1, isPublic: true, isImplemented: true, comments: 2, replies: 3 },
  { text: "Idea 2", userId: 3, isPublic: true, isImplemented: false, comments: 1, replies: 1 },
  { text: "Idea 3", userId: 1, isPublic: true, isImplemented: false, comments: 3, replies: 2 },
  { text: "Idea 4", userId: 2, isPublic: true, isImplemented: false, comments: 5, replies: 0 },
  { text: "Idea 5", userId: 2, isPublic: true, isImplemented: false, comments: 4, replies: 8 },
  { text: "Idea 6", userId: 3, isPublic: true, isImplemented: false, comments: 2, replies: 2 },
  { text: "Idea 7", userId: 3, isPublic: true, isImplemented: true, comments: 5, replies: 0 },
  { text: "Idea 8", userId: 4, isPublic: true, isImplemented: false, comments: 5, replies: 0 },
]);

const paginatedIdeas = computed(() => {
  const startIndex = (currentPage.value - 1) * ideasPerPage;
  return ideas.value.slice(startIndex, startIndex + ideasPerPage);
});

const totalPages = computed(() => Math.ceil(ideas.value.length / ideasPerPage));

function goToPage(pageNumber) {
  currentPage.value = pageNumber;
}

</script>
  
  <style scoped>
.all-ideas-view-container {
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
  width: calc(50% - 20px); 
  margin: 10px auto; 
  padding: 10px;
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
  cursor: pointer;
}
.page-number.active {
  background-color: #000;
  color: #fff;
  font-weight: bold;
}
.arrow {
  cursor: pointer;
}

.arrow:hover {
  background-color: #000;
  color: #fff;
}

.current-page {
  background-color: #000;
  color: #fff;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 999px;
  cursor: pointer;
}

.current-page:hover {
  text-decoration: underline;
}
  </style>
  