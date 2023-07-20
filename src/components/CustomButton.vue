<script setup>
const props = defineProps({
  id: String,
  label: String,
});
</script>

<template>
  <button class="customButton" :id="id" @click="handleClick">
    {{ label }}
  </button>
</template>

<style scoped>
.customButton {
  width: 7vw;
  height: 30px;
  padding: 3px;

  cursor: pointer;

  background-color: var(--selected-color);
  border: 2px solid black;
}
</style>