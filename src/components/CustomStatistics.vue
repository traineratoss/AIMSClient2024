<script setup>
import { ref, onMounted } from "vue";
import { getStats } from "../services/idea.service";
const stats = ref("");

onMounted(async () => {
  stats.value = await getStats();
  console.log(stats.value);
});
</script>

<template>
  <div class="stats-wrapper">
    <div class="stats-container">
      <div class="title">
        <b>AIMS </b>Statistics
        <span class="material-symbols-outlined"> query_stats </span>
      </div>
      <div class="stat-item">
        <p class="stat-label"><b>Number of Users:</b></p>
        <b>{{ stats.nrOfUsers }}</b>
      </div>
      <div class="stat-item">
        <p class="stat-label"><b>Total Comments:</b></p>
        <b>{{ stats.totalNrOfComments }}</b>
      </div>
      <div class="stat-item">
        <p class="stat-label"><b>Total Replies:</b></p>
        <b>{{ stats.totalNrOfReplies }}</b>
      </div>
      <div class="stat-item">
        <p class="stat-label"><b>Ideas/User:</b></p>
        <b>{{ stats.ideasPerUser }}</b>
      </div>
      <div class="stat-item">
        <p class="stat-label"><b>Public Ideas</b></p>
        <b>{{ stats.nrOfIdeas }}</b>
      </div>
      <div class="stat-item">
        <p class="stat-label"><b>Implemented Ideas</b></p>
        <b>{{ stats.implementedIdeas }}</b>
      </div>
      <div class="stat-item">
        <p class="stat-label"><b>Drafted Ideas</b></p>
        <b>{{ stats.draftIdeas }}</b>
      </div>
      <div class="stat-item">
        <p class="stat-label"><b>Open Ideas</b></p>
        <b>{{ stats.openIdeas }}</b>
      </div>
      <div class="stat-item">
        <br />
        <div class="implementation-bar">
          <div
            class="fill"
            :style="{ width: implementationPercentage + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.stats-wrapper {
  background-color: rgb(255, 255, 255);
  box-sizing: content-box;
  padding-top: 10px;
  border: 1px solid slategray;
  width: 20vw;
}

.stats-container {
  text-align: center;
  height: 91vh;
  border-radius: 5px;
  overflow: auto;
}

.stats-container::-webkit-scrollbar {
  display: block;
  width: 10px;
}

.stats-container:hover::-webkit-scrollbar {
  display: block;
  width: 10px;
}

.stats-container::-webkit-scrollbar-thumb {
  background-color: #ffa941;
  border-radius: 5px;
  border: 1px solid slategray;
}

.fill {
  height: 100%;
  background-color: #ffa941;
  transition: width 0.3s ease;
}

.implementation-bar {
  width: 75%;
  height: 20px;
  background-color: #fff;
  border: 1px solid slategray;
  margin: 0 auto;
  border-radius: 7.5px;
  overflow: hidden;
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
}
</style>
