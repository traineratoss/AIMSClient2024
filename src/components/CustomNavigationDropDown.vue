<script setup>
import { useRouter } from "vue-router";
import { defineProps } from "vue";
import router from "../router";

const props = defineProps({
  element: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.hasOwnProperty("name") && value.hasOwnProperty("route");
    },
  },
});

function onClickHandler() {
    console.log(props.element.route);
    // router.push('/app')
}

</script>



<template>
    <div class="main-container" v-for="element in element" :key="element">
        <button
            @click="onClickHandler"
        > 
            {{ element.name }}
        </button>
    </div>
</template>



<style scoped>

</style>