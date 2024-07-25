<script setup>
import { ref, computed } from "vue";
import { getLike } from "../services/comment.service";

const props=defineProps({isBlackIcon: false});
const emits = defineEmits(["addLike", "deleteLike"]);

const toggleIcon = () => {
  if (props.isBlackIcon) {
    emits("deleteLike");
  } else {
    emits("addLike");
  }
};

const iconClass = computed(() => {
  return props.isBlackIcon ? "blackIcon" : "";
});
</script>

<template>
  <button class="action-icon-button" @click="toggleIcon">
    <span class="material-symbols-outlined" :class="iconClass"> thumb_up </span>
  </button>
</template>

<style scoped>
.blackIcon {
  font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;
  color: black;
}

.action-icon-button {
  background: none;
  border: none;
  cursor: pointer;
}
</style>
