<script setup>
import { ref,onMounted } from 'vue';

const emit = defineEmits(['update:selectedCategories']);

const variants = ['Fun', 'Food', 'Books', 'IT'];
const comboInput = ref(null);
const dropdown = ref(null);
const isDropdownVisible = ref(false);
  
const showDropdown = () => {
    isDropdownVisible.value = true;
};

const handleCheckboxChange = () => {
  const checkboxes = dropdown.value.querySelectorAll('input[type="checkbox"]');
  const selectedVariants = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  comboInput.value.value = selectedVariants.join(', ');
  emit('update:selectedCategories', selectedVariants);
};

const onMouseEnter = () => {
  isDropdownVisible.value = true;
};

const onMouseLeave = () => {
  isDropdownVisible.value = false;
};

onMounted(() => {
  comboInput.value.addEventListener('click', showDropdown);
});
</script>

<template>
  <div class="combo-box" >
          <input type="text" ref="comboInput"  class="input-dropdown" placeholder="Select category">
          <div v-show="isDropdownVisible" 
                class="dropdown" 
                ref="dropdown" 
                @mouseenter="onMouseEnter"
                @mouseleave="onMouseLeave"
                
          >
              <label v-for="variant in variants" :key="variant">
                  <input type="checkbox" :value="variant" @change="handleCheckboxChange">
                  {{ variant }}
              </label>
          </div>
  </div>

</template>

<style scoped>
.combo-box {
  position: relative;
  display: inline-block;
  
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  max-height: 200px;
  overflow-y: auto;
}

.dropdown.visible {
  display: none;
}

.dropdown label {

  cursor: pointer; 
  display: flex;
  justify-content: flex-start;
  width: 185px;
}

.dropdown label:hover {
  background-color: #f0f0f0;
}

.input-dropdown{
  width: 185px;
}
</style>