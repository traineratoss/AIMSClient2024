<script setup>
import { ref, onMounted } from "vue";
import { getStats } from "../services/idea.service";
import { getCurrentRole } from "../services/user_service";

const stats = ref(null);
const implementationPercentage = ref(0);
const isAdmin = ref(false);

const isLoading = ref(true);

onMounted(async () => {
  isAdmin.value = getCurrentRole() === "ADMIN";
  if (isAdmin.value) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    stats.value = await getStats();
    console.log(stats.value);
    calculateImplementationPercentage();
    isLoading.value = false;
  }
});

const calculateImplementationPercentage = () => {
  if (stats.value && stats.value.nrOfIdeas > 0) {
    implementationPercentage.value =
      (stats.value.implementedIdeas / stats.value.nrOfIdeas) * 100;
  } else {
    implementationPercentage.value = 0;
  }
};
</script>

<template>
  <div>
    <transition name="skeleton-fade">
      <div v-if="isLoading && isAdmin" class="skeleton-loader">
        <div class="loader"></div>
      </div>
    </transition>

    <transition name="stats-fade">
      <div class="stats-wrapper" v-if="!isLoading && isAdmin">
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
            <p class="stat-label"><b>Public Ideas:</b></p>
            <b>{{ stats.nrOfIdeas }}</b>
          </div>
          <div class="stat-item">
            <p class="stat-label"><b>Implemented Ideas:</b></p>
            <b>{{ stats.implementedIdeas }}</b>
          </div>
          <div class="stat-item">
            <p class="stat-label"><b>Drafted Ideas:</b></p>
            <b>{{ stats.draftIdeas }}</b>
          </div>
          <div class="stat-item">
            <p class="stat-label"><b>Open Ideas:</b></p>
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
    </transition>
  </div>
</template>

<style scoped>
.stats-fade-enter-active {
  opacity: 0;
  transition: opacity 1s;
}
.stats-fade-enter-to {
  opacity: 1;
}
.skeleton-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 91vh;
  background-color: #b3b3b3;
  box-sizing: content-box;
  padding-top: 10px;
  border: 1px solid slategray;
  width: 20vw;
}

.skeleton-loader .loader {
  width: 100%;
  height: 93vh;
  background-color: white;
  animation: skeleton-pulse 0.7s infinite alternate;
}

@keyframes skeleton-pulse {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
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
