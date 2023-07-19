<script setup>
import { ref } from 'vue';
import CustomComment from '../components/CustomComment.vue';
import SidePanel from '../components/SidePanel.vue';
</script>

<template>
    <div class="sidebar-container">
        <SidePanel/>
        <h1>SidePanel</h1>
    </div>
    <div class="idea-container">
        <CustomComment  />
        <h1>Test</h1>
    </div>
</template>

<style scoped></style>
