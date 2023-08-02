<script setup>
import { ref, onMounted, defineProps, watch, watchEffect } from "vue";

const emit = defineEmits(["update:selectedCategories"]);

const props = defineProps({
  variants: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  canAddInDropdown: {
    type: Boolean,
    default: false,
  },
  selectedCategories: {
    type: Object,
    default: null,
  }
});
const comboInput = ref(null);
const dropdown = ref(null);
const isDropdownVisible = ref(false);
const filteredIdeas = ref([]);
const loading = ref(true);

const parsedSelectedCategories = ref(JSON.parse(props.selectedCategories));

const initialSelectedCategories = ref(null);

onMounted(async () => {
  comboInput.value.addEventListener("click", showDropdown);
  comboInput.value.value = initialSelectedCategories.value;
});

watchEffect(() => {
  if (props.selectedCategories && props.selectedCategories.length > 0 && loading.value) {
    initialSelectedCategories.value = parsedSelectedCategories.value.join(", ");
    loading.value = false; 
  }
});

watch(
  () => props.variants,
  (newVariants) => {
    filteredIdeas.value = newVariants;
  },
  { immediate: true }
);

const isVariantSelected = (variant) => {
  if (!loading.value) {
    return parsedSelectedCategories.value.includes(variant);
  }
};

const showDropdown = () => {
  isDropdownVisible.value = true;
};

const handleCheckboxChange = () => {
  const checkboxes = dropdown.value.querySelectorAll('input[type="checkbox"]');
  const selectedVariants = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  comboInput.value.value = selectedVariants.join(", ");
  emit("update:selectedCategories", selectedVariants);
  console.log(selectedVariants)
};

const handleInputKeyPress = (event) => {
  if (props.canAddInDropdown) { // this is used for checking if the variants can pe modified by pressing Enter or not
    if (event.key === "Enter" && event.target.value !== "") {
      props.variants.push(event.target.value);
      filteredIdeas.value = props.variants
      comboInput.value.value = "";
    }
    const checkboxes = dropdown.value.querySelectorAll('input[type="checkbox"]');
    const selectedVariants = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    emit("update:selectedCategories", selectedVariants);
  }
};

// filtering the search for the custom drop down for easier searches
const handleInputBoxChange = () => {
  const inputText = comboInput.value.value.toLowerCase(); // converting to lowercase so the search won't be case sensitive
  filteredIdeas.value = props.variants.filter((variant) => {
    return variant.toLowerCase().startsWith(inputText);
  });
};

function onMouseEnter() {
  isDropdownVisible.value = true;
}

function onMouseLeave() {
  isDropdownVisible.value = false;
}


</script>

<template>
  <div class="combo-box">
    <input
      type="text"
      ref="comboInput"
      class="input-dropdown"
      :placeholder="error ? 'Select a category' : ''"
      :disabled="props.disabled"
      @keydown.enter="handleInputKeyPress"
      @input="handleInputBoxChange"
      :class="{ error: props.error }"
      @mouseleave="onMouseLeave"
    />
    <div
      v-show="isDropdownVisible && !props.disabled"
      class="dropdown"
      ref="dropdown"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <label v-for="variant in filteredIdeas" :key="variant">
        <input 
        type="checkbox" 
        :value="variant" 
        :checked="isVariantSelected(variant)"
         @change="handleCheckboxChange" />
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

.error {
  border-color: red;
  border-width: 1.4px;
  border-radius: 1px;
}

.error::placeholder {
  color: red;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  max-height: 8vh;
  /* max-height: 250px; */
  overflow-y: auto;
}

.dropdown.visible {
  display: none;
}

.dropdown label {
  cursor: pointer;
  display: flex;

  align-items: center;
  width: 185px;
}

.dropdown label:hover {
  background-color: #f0f0f0;
}

.input-dropdown {
  width: 10vw;
}
</style>
