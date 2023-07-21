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

  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  gap: 1vh;
}

h1 {
  font-size: 30px;
}

#name {
  color: var(--selected-color);
}
</style>