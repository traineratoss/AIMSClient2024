<script setup>
const props = defineProps({
  text: "",
  creationDate: "",
  userName: "",
  userId: "",
  ideaId: "",
  hasReplies: "",
});
</script>

<template>
  <div class="comment-container">
    <p>
      <i>{{ props.userName }}</i>
    </p>
    <div class="item">{{ props.text }}</div>
    <button class="showReplies">...</button>
  </div>
</template>

<style scoped>
.comment-container {
  background-color: rgb(255, 255, 255);
  border-radius: 2px;
  border: solid 1px black;
  margin: 5px;
  padding: 10px;
  max-width: 28vw;
}
.item {
  background-color: rgb(255, 255, 255);
  color: black;
}

.showReplies {
  position: relative;
  left:180px;
  top: 5px;
  font-size: xx-large;
  border: none;
  background-color: unset;
}
</style>
