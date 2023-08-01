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
  <div class="stats-container">
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
      <p class="stat-label"><b>Implemented Ideas</b></p>
        <b>{{ stats.implementedIdeas }}</b>
      <br />
      <div class="implementation-bar">
        <div
          class="fill"
          :style="{ width: implementationPercentage + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style>
.stats-container {
  margin-bottom: 75px;
  text-align: center;
  height: 91vh;
  width: 20vw;
  border: 1px solid slategray;
  background-color: rgb(255, 255, 255);
  box-sizing: border-box;
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
</style>
