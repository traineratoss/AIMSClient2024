<script setup></script>

<template>
  <div class="container">
    <div class="loader"></div>
  </div>
  <div
    class="cards"
    id="cards"
    v-if="getRepliesForComment(comment.id).length === 0"
  >
    <div class="card is-loading">
      <div class="image"></div>
    </div>
  </div>
</template>

<style scoped>
.cards {
  display: flex;
}

.card {
  /* width: 30vw;
  margin: 10px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); */

  border-radius: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 8px;
  width: 29.3vw;
  min-height: 5vh;
  max-height: 20vh;
  box-sizing: border-box;
  display: grid;
}

.card.is-loading {
  .image,
  h2,
  p {
    background: #eee;
    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
    border-radius: 5px;
    background-size: 200% 100%;
    animation: 1.5s shine linear infinite;
  }

  .image {
    height: 14vh;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}

@keyframes shine {
  to {
    background-position-x: -200%;
  }
}
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
