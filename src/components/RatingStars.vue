<script setup>
import { ref, watch, toRef, defineProps, defineEmits } from "vue";

const props = defineProps({
  initialRating: {
    type: Number,
    required: true
  },
  disableHover: { 
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['ratingUpdated']);

const currentRating = ref(props.initialRating);
const hoverRating = ref(0);
const isHovered = ref(false);

function setHoverRating(rating) {
  if (!props.disableHover) {
    hoverRating.value = rating;
    isHovered.value = true;
  }
}

function resetHover() {
  if (!props.disableHover) {
    hoverRating.value = 0;
    isHovered.value = false;
  }
}

function setRating(rating) {
  emit('ratingUpdated', rating);
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
        filled: index <= (isHovered ? hoverRating : currentRating),
        hover: !props.disableHover && isHovered && index <= hoverRating
      }"
      @click="setRating(index)"
      @mouseover="setHoverRating(index)"
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

.star.hover {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  color: #ffa941;
}
</style>
