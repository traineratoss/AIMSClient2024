<script setup>
import CommentDisplay from "../components/CommentDisplay.vue";
import Pagination from "../components/Pagination.vue";
import FormTitle from "../components/FormTitle.vue";
import {getAllCommentsByReportsNr } from "../services/comment.service.js";
import { ref, onMounted } from "vue";
import PageSizeSelect from "../components/PageSizeSelect.vue";

const pageSize = ref(5);
const currentPage = ref(1);
const totalPages = ref(0);
const showImage = ref(false);


const comments = ref([]);


onMounted(() => {
    updateCommentsList();
});

function removeComment(comment) {
  const index = comments.value.indexOf(comment);
  if (index !== -1) {
    comments.value.splice(index, 1);
  }
  updateCommentsList();

}

async function changePage(pageNumber) {
  currentPage.value = pageNumber;
  await getAllCommentsByReportsNr(
    pageSize.value,
    currentPage.value - 1,

  )
    .then((res) => {
        comments.value = res.pagedComments.content;
      totalPages.value = Math.ceil(res.total / pageSize.value);
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateCommentsList() {
    console.log(comments);
    getAllCommentsByReportsNr(
    pageSize.value,
    currentPage.value - 1,
  )
    .then((res) => {
        comments.value = res.pagedComments.content;
      totalPages.value = Math.ceil(res.total / pageSize.value);
    })
    .catch((error) => {
      console.log("Error");
    });
}


async function changeDisplay(pageSize1) {
  pageSize.value = pageSize1;
  currentPage.value = 1;
  await getAllCommentsByReportsNr(
    pageSize.value,
    currentPage.value - 1,
  )
    .then((res) => {
        comments.value = res.pagedComments.content;
      totalPages.value = Math.ceil(res.total / pageSize.value);
    })
    .catch((error) => {
      console.log("Error");
    });
}
</script>

<template>
  <div class="container">
      <FormTitle label="Reported Comments" id="title" v-if="!showImage" />
      <img src="src/assets/img/curiosity-search.svg" v-if="showImage" />
      <div class="pageSize">
        <PageSizeSelect
          v-if="!showImage"
          id="pageSizeSelect"
          label="Comments:"
          @change-display="changeDisplay"
        />
      </div>
      <div class="main-container">
        <div class="comments-container">
          <CommentDisplay
            v-for="comment in comments"
            v-if="!showImage"
            :key="comment.id"
            :content="comment.content"
            :nrReports="comment.nrReports"
            :commentId="comment.id"
            @multiple-admin-action="updateCommentsList"
          />
        </div>
        <Pagination          
          :totalPages="totalPages"
          :currentPage="currentPage"
          @changePage="changePage"
          v-if="!showImage"
          class="pagination-container"
        />
      </div>
    </div>
</template>

<style scoped>
.container {
  height: calc(94vh - 2px);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
}

.comments-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 2vh;
}

.main-container {
  display: flex;
  justify-content: center;
  height: 32.5vh;
  width: 63vw;
  overflow: auto;
  align-items: flex-start;
}

.main-container::-webkit-scrollbar {
  display: block;
  width: 10px;
}

.main-container::-webkit-scrollbar-thumb {
  background-color: var(--selected-color);
  border-radius: 5px;
  border: 1px solid slategray;
}
.pagination-container {
  position: absolute;
  bottom: 0.5vh;

  display: flex;
  justify-content: center;
}

img {
  height: 60vh;
  margin-top: 17vh;
}

#title {
  margin: 10vh 0;
}

.pageSize {
  width: 60.8vw;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2vh;
}
</style>