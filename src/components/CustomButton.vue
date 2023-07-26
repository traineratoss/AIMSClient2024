<script setup>
const props = defineProps({
  id: String,
  label: String,
  isActive: Boolean
});
</script>

<template>
  <button 
    class="customButton" 
    :id="id"
    :style="{ backgroundColor: isActive ? 'var(--selected-color)' : '' }"
    >
    <slot></slot>
  </button>
</template>

<style scoped>
.customButton {
  width: 7vw;
  height: 30px;
  padding: 3px;

  cursor: pointer;

  background-color: transparent;
  border: 2px solid transparent;
}

.customButton:hover {
  border: 2px solid black;
}
</style>