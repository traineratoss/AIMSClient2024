<script setup>
import { ref } from 'vue';
import CustomComment from '../components/CustomComment.vue';
</script>

<template>
  <div class="comment-container">
    <CustomComment 
    :props.text="something"/>
    <h1>Test</h1>
  </div>
</template>

<style scoped>


</style>
