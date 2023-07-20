<script setup>
const props = defineProps({
  id: String,
  label: String,
});
</script>

<template>
  <button class="customButton" :id="id">{{ label }}</button>
</template>

<style scoped>
.customButton {
  background-color: var(--selected-color);
  border: 2px solid black;
  width: 6vw;
  height: 30px;
  cursor: pointer;
}
</style>