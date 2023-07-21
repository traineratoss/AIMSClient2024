<script setup>
import CustomInput from "../components/CustomInput.vue";
import { ref } from 'vue';
const categoryName = ref();

const variants = ['Fun', 'Food', 'Books']; // Add more variants here as needed
const comboInput = ref(null);
const dropdown = ref(null);
const isDropdownVisible = ref(false);

// const toggleDropdown = () => {
//   isDropdownVisible.value = !isDropdownVisible.value;
// };  
const showDropdown = () => {
    isDropdownVisible.value = true;
};
const hideDropdown = () => {
    isDropdownVisible.value = false;
};

const handleCheckboxChange = () => {
  const checkboxes = dropdown.value.querySelectorAll('input[type="checkbox"]');
  const selectedVariants = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  comboInput.value.value = selectedVariants.join(', ');
};
</script>

<template>
            <!-- <CustomInput v-model="categoryName"/>  -->
            <!-- @blur="hideDropdown" -->
            <div class="combo-box" @focusout="hideDropdown">
                    <input type="text" ref="comboInput" @focus="showDropdown"  tabindex="0" placeholder="Select variants">
                    <div v-show="isDropdownVisible" 
                         class="dropdown" 
                         ref="dropdown" 
                         
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
  display: block;
  padding: 5px;
  cursor: pointer;
}

.dropdown label:hover {
  background-color: #f0f0f0;
}
</style>