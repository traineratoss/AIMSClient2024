<script setup>
const props = defineProps({
    text: "",
    creationDate: "",
    parentId:"",
    userId:"",
    ideaId:""
})


</script>

<template>
    <h1>Comment</h1>
    <div class="item">{{ props.text }}</div>
</template>

<style scoped>
    .item {
        background-color: rgb(255, 255, 255);
        color: black;
    }
</style>