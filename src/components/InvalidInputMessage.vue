<script setup>
const props = defineProps({
    message: String
});
</script>

<template>
    <div class="error">
        {{ message }}
    </div>
</template>

<style scoped>
    .error {
        color: red;
        background-color: rgba(255, 0, 0, 0.1);
        padding: 10px;
        border-radius: 8px;
        opacity: 0;
    }
</style>