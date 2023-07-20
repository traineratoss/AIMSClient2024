<script setup>
const props = defineProps({
  id: String,
  label: String,
});
</script>

<template>
  <button :id="id">
    {{ label }}
  </button>
</template>

<style scoped>
button {
  width: 7vw;
}
</style>