<template>
  <div class="all-ideas-view-container">
    <div class="sidebar-container">
      <SidePanel />
    </div>
    <div class="main-container">
      <div class="idea-container" v-for="idea in paginatedIdeas" :key="idea.title">
        <IdeaCard :title="idea.title" :text="idea.text" />
      </div>
      <Pagination :totalPages="totalPages" :currentPage="currentPage" @changePage="changePage" />
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed, watch } from "vue";
import SidePanel from "../components/SidePanel.vue";
import IdeaCard from "../components/IdeaCard.vue";
import Pagination from "../components/Pagination.vue";


const ideas = ref([
  { title: "Idea 1", text: "Idea 1", userId: 1, isPublic: true, isImplemented: true, comments: 2, replies: 3 },
  { title: "Idea 2", text: "Idea 1", userId: 3, isPublic: true, isImplemented: false, comments: 1, replies: 1 },
  { title: "Idea 3", text: "Idea 1", userId: 1, isPublic: true, isImplemented: false, comments: 3, replies: 2 },
  { title: "Idea 4", text: "Idea 1", userId: 2, isPublic: true, isImplemented: false, comments: 5, replies: 0 },
  { title: "Idea 5", text: "Idea 1", userId: 2, isPublic: true, isImplemented: false, comments: 4, replies: 8 },
]);

const ideasPerPage = 2;
const currentPage = ref(1);

const paginatedIdeas = computed(() => {
  const startIndex = (currentPage.value - 1) * ideasPerPage;
  return ideas.value.slice(startIndex, startIndex + ideasPerPage);
});

const totalPages = computed(() => Math.ceil(ideas.value.length / ideasPerPage));

function changePage(pageNumber) {
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
  background-color: transparent; 
  cursor: pointer;
}

.page-number.active {
  background-color: #000;
  color: #fff;
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
  