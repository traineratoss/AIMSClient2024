<script setup>
const props = defineProps({
    text: ""
})


</script>

<template>
    <div class="item">{{ props.text }}</div>
</template>

<style scoped>
    .item {
        background-color: lightskyblue;
        color: black;
    }
</style>