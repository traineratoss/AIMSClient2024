<script setup>
import { ref, watch, toRef } from "vue";

const props = defineProps({
  initialRating: {
    type: Number,
    required: true,
    default: 0
  }
});

const currentRating = ref(props.initialRating);
const hoverRating = ref(0);
const isHovered = ref(false);

function setRating(rating) {
  currentRating.value = rating;
  isHovered.value = false; 
}

function setHoverRating(rating) {
  hoverRating.value = rating;
  isHovered.value = true;
}

function resetHover() {
  hoverRating.value = 0;
  isHovered.value = false;
}

watch(toRef(props, 'initialRating'), (newVal) => {
  currentRating.value = newVal;
});
</script>

<template>
  <div class="starsRating">
    <span
      v-for="index in 5"
      :key="index"
      class="material-symbols-outlined star"
      :class="{
        filled: index < (isHovered ? hoverRating : currentRating),
        hover: isHovered && index < hoverRating
      }"
      @click="setRating(index + 1)"
      @mouseover="setHoverRating(index + 1)"
      @mouseleave="resetHover"
    >
      star
    </span>
  </div>
</template>


<style scoped>
.starsRating {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 1rem;
}

.star {
  cursor: pointer;
}

.star.filled {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  color: black;
}

.star.hover{
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  color: #ffa941;
}
</style>

