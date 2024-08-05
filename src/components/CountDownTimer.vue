<script setup>
import {ref, onMounted, onBeforeUnmount, computed} from 'vue';

const initialTime = 30;
const timeLeft = ref(initialTime);
const timer = ref(null);

function pad(number) {
  return number < 10 ? '0' + number : number;
}

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
});

function startTime()  {
    timer.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer.value);
    }
  }, 1000);
}

function resetTimer() {
  timeLeft.value = initialTime;
  startTime();
}

onMounted(() => {
  startTime();
});

onBeforeUnmount(() => {
  clearInterval(timer.value);
});
</script>
       
<template>  
    <div class ="countdown-timer">
         <p> {{ formattedTime }} </p>
         <p v-if="timeLeft === 0"> 
          <span>Didn't receive the email? </span>
          <a href="#" @click="resetTimer">Click to resend</a>
         </p>
    </div> 
</template>


<style scoped>
.countdown-timer {
  font-size: 2em;
  text-align: center;
  margin-top: 10px;
}
button {
  margin-top: 10px;
  padding: 5px 20px;
  border: 1px solid black;
  background-color: rgba(255, 169, 65, 0.8);
  cursor: pointer;
}
a {
    font-size: 15px;
    color: blue ;
    font-weight: bold;
    cursor: pointer;
    text-decoration: underline;
}

span {
  font-size: 15px;
}
</style>
