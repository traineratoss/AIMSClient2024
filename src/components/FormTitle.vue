<script setup>
const props = defineProps({
  label: String,
});
</script>


<template>
  <span>
    <h1 id="name">AIMS</h1>
    <h1>{{ label }}</h1>
  </span>
</template>

<style scoped>
span {
  width: 15vw;
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0vh;
}

h1 {
  font-size: 30px;
  margin: 0;
}

#name {
  color: var(--selected-color);
}
</style>