
<script setup>
import { ref, defineProps, defineEmits,onMounted } from 'vue';
import router from "../router";


const dialogRef = ref(null);
const props = defineProps({
  isOpen: Boolean,
});

</script>

<template>
  <div v-if="isOpen" class="dialog-container">
    <div class="dialog">
        <dialog  ref="dialogRef" :open="isOpen">
          <slot></slot>
      </dialog>
    </div>
  </div>

</template>
  
<style scoped>
.dialog-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; 
  background-color: rgba(0, 0, 0, 0.5); 
}

.dialog {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>

