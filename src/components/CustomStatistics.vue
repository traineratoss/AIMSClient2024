<script setup>
import { ref, onMounted, watch,computed } from "vue";
import { getStats } from "../services/idea.service";
import generatedStatisticsToBeSend from "../utils/stats-transition-container";
import PieChart from "./PieChart.vue";


const stats = ref(null);
const implementationPercentage = ref(0);
const recievedStats = ref('')

const isLoading = ref(true);

onMounted(async () => {
  stats.value = await getStats();
  console.log("statisticile sunt ", stats.value)
  // console.log('shared obj ',generatedStatisticsToBeSend.value);
  // console.log('recieved stats ',recievedStats.value);
  calculateImplementationPercentage();
  isLoading.value = false;
});

watch(generatedStatisticsToBeSend, (newX) => {
  console.log('the new recievedStats are ',newX)
  recievedStats.value = generatedStatisticsToBeSend.value
})


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
  <transition name="skeleton-fade">
    <div v-if="isLoading" class="skeleton-loader">
      <div class="loader"></div>
    </div>
  </transition>

  <transition name="stats-fade">
    <div class="stats-wrapper" v-if="!isLoading">

      <div class="general-statistics" v-if="!recievedStats">
        <div class="stats-container">
          <div class="title">
            <b>AIMS </b>Statistics
            <span class="material-symbols-outlined"> query_stats </span>
          </div>
          <div class="stat-item">
            <p class="stat-label"><b>Total Ideas:</b></p>
            <b>{{ stats.nrOfIdeas }}</b>
          </div>
          <div class="stat-item">
            <p class="stat-label"><b>Public Ideas:</b></p>
            <b>{{ stats.openIdeas + stats.implementedIdeas}}</b>
          </div>
          <div class="stat-item">
            <p class="stat-label"><b>Number of Users:</b></p>
            <b>{{ stats.nrOfUsers }}</b>
          </div>
          <div class="stat-item">
            <p class="stat-label"><b>Ideas/User:</b></p>
            <b>{{ stats.ideasPerUser }}</b>
          </div>
          <!-- <div class="stat-item">
            <p class="stat-label"><b>Implemented Ideas:</b></p>
            <b>{{ stats.implementedIdeas }}</b>
            <b>{{ stats.implP }}%</b>
          </div>
          <div class="stat-item">
            <p class="stat-label"><b>Open Ideas:</b></p>
            <b>{{ stats.openIdeas }}</b>
            <b>{{ stats.openP }}%</b>
          </div>
          <div class="stat-item">
            <p class="stat-label"><b>Drafted Ideas:</b></p>
            <b>{{ stats.draftIdeas }}</b>
            <b>{{ stats.draftP }}%</b> 
          </div>-->
          <div class="piechart">
            <pie-chart
            :sizeInVW="10"
            :speedInMS="25"
            :firstValue="stats.implP"
            :secondValue="stats.draftP"
            :thirdValue="stats.openP"
            :color1="'#b3b3b3'"
            :color2="'#ffa941'"
            :color3="'#fadebc'"
            :backgroundColor="'white'"
            :firstNumber="stats.implementedIdeas"
            :secondNumber="stats.openIdeas"
            :thirdNumber="stats.draftIdeas"
            :test="red"
            />
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

      <div class="generated-statistics" v-else>
        <div class="stats-container">
          <div class="title">
            <b>AIMS </b>Statistics
            <span class="material-symbols-outlined"> query_stats </span>
          </div>
          <div class="stat-item">
            <p class="stat-label"><b>Number of Users:</b></p>
            <b>{{ stats.nrOfUsers }}</b>
          </div>
          <div class="piechart">
            <pie-chart/>
          </div>
          <div class="stat-item">
            <p class="stat-label"><b>Total Comments:</b></p>
            <b>{{ stats.totalNrOfComments }}</b>
          </div>
          <div class="stat-item">
            <p class="stat-label"><b>Total Comments in provided selection:</b></p>
            <!-- <b>{{ props.generatedStatistics.totalNrOfComments }}</b> -->
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
          <button @click="console.log(props.generatedStatistics)">
            apasa ma puternic
          </button>
        </div>
      </div>

    </div>
  </transition>
</template>

<style>
.stats-fade-enter-active {
  opacity: 0.3;
  transition: opacity 0.7s;
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
  background-color: #f2f2f2;
  background-image: linear-gradient(
    90deg,
    #f2f2f2 25%,
    #e6e6e6 37%,
    #f2f2f2 63%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s infinite linear;
}

@keyframes skeleton-pulse {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
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

.stat-item{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 10px;
}
</style>
