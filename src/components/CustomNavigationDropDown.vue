<script setup>
import { useRouter } from "vue-router";
import { defineProps } from "vue";

const props = defineProps({
    element: {
        type: Object,
        required: true,
    }
});

function onClickHandler() {
    const router = useRouter();
    router.push(props.element.route)
}

</script>



<template>
    <div class="main-container" v-for="element in props.elements" :key="element">
        <button
            @click="onClickHandler"
        > 
            {{ element.name }}
        </button>
    </div>
</template>



<style scoped>

</style>