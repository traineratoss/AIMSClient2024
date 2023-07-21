<script setup>
import CustomInput from "../components/CustomInput.vue";
import { ref } from "vue";
const categoryName = ref();
</script>

<template>
        <!-- <label for="status-idea" class="label">Status:</label>
            <select name="status-idea" id="status-idea" class="label">
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="in-discusion">In Discusion</option>
            </select> -->
            <CustomInput v-model="categoryName"/>
            <div class="category-container">
                <div>

                </div>

            </div>

</template>

<style scoped>

</style>