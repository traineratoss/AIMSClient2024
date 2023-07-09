<script setup>
import Item from '../components/Item.vue';

</script>

<template>
  <div class="about">
    <Item :text="'This is the About page'"/>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
