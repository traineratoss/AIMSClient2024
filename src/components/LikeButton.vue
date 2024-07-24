
  <script setup>
  import { ref, computed } from 'vue';

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
    <button class="action-icon-button" @click="toggleIcon">
      <span class="material-symbols-outlined" :class="iconClass"> thumb_up </span>
    </button>
  </template>



  <style scoped>
  .blackIcon {
    font-variation-settings: 
    'FILL' 1, 
    'wght' 400, 
    'GRAD' 0, 
    'opsz' 24;
    color: black;
  }
  
  .action-icon-button {
    background: none;
    border: none;
    cursor: pointer;
  }
  </style>
  