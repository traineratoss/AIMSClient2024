<script setup>
import { ref } from 'vue';
import Item from '../components/Item.vue';

const message = ref("This is the Home page")
</script>

<template>
  <div class="home">
    <Item :text = 'message'/>
  </div>
</template>

<style scoped>

@media (min-width: 1024px) {
  .home {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
