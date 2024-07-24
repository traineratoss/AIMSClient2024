<script setup>
import { ref, computed, defineProps } from "vue";

  const emits = defineEmits(['deleteLike']);
  
  const isBlackIcon = ref(false);
  
  const toggleIcon = () => {
  if (isBlackIcon.value) {
    emits("deleteLike");
  } 
  isBlackIcon.value = !isBlackIcon.value;
};
  
  const iconClass = computed(() => {
    return isBlackIcon.value ? 'blackIcon' : '';
  });
  </script>
  

<template>
  <span :class="['material-symbols-outlined', iconClass]" @click="toggleIcon">
    thumb_up
  </span>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;
  cursor: pointer;
}

.unfilledIcon {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}

.filledIcon {
  color: black; /* Color for the filled state */
}
</style>
