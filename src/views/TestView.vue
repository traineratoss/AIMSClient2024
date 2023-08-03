<script setup></script>

<template>
  <div class="container">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 91vh;
}

.loader {
  margin: auto;
  border: 20px solid #dedede;
  border-radius: 50%;
  
  width: 150px;
  height: 150px;
  animation: spinner 1s linear infinite;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
    border-top: 20px solid #ffa941;
  }
  50% {
    border-top: 20px solid #dedede;
  }
  100% {
    transform: rotate(360deg);
    border-top: 20px solid #ffa941;
  }
}
</style>
