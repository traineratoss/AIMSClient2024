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
  //we need a prop to update from outside the selected objects
  selectedObjects: {
    type: String,
    default: null,
  },
  inputPlaceholder: {
    type: String,
    default: null,
  },
  clearAll: {
    type: Boolean,
    default: false
  }
});

const shouldClearAll = ref(false);

const comboInput = ref(null);
const dropdown = ref(null);
const isDropdownVisible = ref(false);
// loading is used for checking when the props are updated and fully loaded, since i cant use it in the onMount (async function)
const loading = ref(true);
// this is the reactive value with the initial value of the objects selected
const selectedObjectsReactive = ref(props.selectedObjects); 
// the ref is stringified so i parse it to receive the full array
const parsedSelectedCategories = ref(JSON.parse(selectedObjectsReactive.value));

const initialSelectedObjects = ref(null);

onMounted(async () => {
  comboInput.value.addEventListener("click", showDropdown);
  // i set the input to be equal to the initially selected values (from the props)
  //comboInput.value.value = initialSelectedObjects.value;
});

watchEffect(() => {
  //while its still loading, i check if the initialselectedcategories received the prop corectly from the parent
  // and only then i set it
  if (props.selectedObjects && props.selectedObjects.length > 0 && loading.value) {
    initialSelectedObjects.value = parsedSelectedCategories.value.join(", ");
    loading.value = false; 
  }
});

watch(
  () => props.variants,
  (newVariants) => {
    //when the variants are updated, im updating the selected ones
    selectedObjectsReactive.value = newVariants;
  },
  { immediate: true }
);

// this watcher is for checking if the clear all button from the side panel is pressed
watch(
  () => props.clearAll,
  (newValue) => {
    if (newValue === true) {
      shouldClearAll.value = true;
      setTimeout(() => {
        shouldClearAll.value = false;
      }, 10);
    }
  }
);

// if the clear is true, we set every checkbox to unchecked
const isVariantSelected = (variant) => {
  if (!loading.value && !shouldClearAll.value) {
    return parsedSelectedCategories.value.includes(variant);
  }
  if (shouldClearAll.value) {
    return false;
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

  //comboInput.value.value = selectedVariants.join(", ");
  emit("update:selectedCategories", selectedVariants);
};

const handleInputKeyPress = (event) => {
  if (props.canAddInDropdown) { // this is used for checking if the variants can pe modified by pressing Enter or not
    let checkDuplicate = false; // this var is used for preventing creation of an existant category
    props.variants.forEach(variant => {
      if(variant == event.target.value) {
        checkDuplicate = true;
      }
    });
    if (event.key === "Enter" && event.target.value !== "" && !checkDuplicate) {
      const newCategory = event.target.value.trim();
      props.variants.push(event.target.value);
      selectedObjectsReactive.value = props.variants
      comboInput.value.value = "";
      isDropdownVisible.value = true;
      setTimeout(() => { // we set a small timeout because
        const checkboxes = dropdown.value.querySelectorAll('input[type="checkbox"]');
        console.log(checkboxes)
        const checkbox = dropdown.value.querySelector(`input[value="${newCategory}"]`);
        if(checkbox) {
          checkbox.checked = true;
        }
        const updatedSelectedVariants = Array.from(checkboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);
        setTimeout(() => {
          emit("update:selectedCategories", updatedSelectedVariants)
        }, 10); // we use a small timeout since the reactive vars arent updating instanlty so we have to check the variant after we create it
      
      }, 0)
      
      
      
    }
  }
};

// filtering the search for the custom drop down for easier searches
const handleInputBoxChange = () => {
  const inputText = comboInput.value.value.toLowerCase(); // converting to lowercase so the search won't be case sensitive
  selectedObjectsReactive.value = props.variants.filter((variant) => {
    return variant.toLowerCase().startsWith(inputText);
  });
};

function onMouseEnter() {
  isDropdownVisible.value = true;
}

function onMouseLeave() {
  isDropdownVisible.value = false;
}

function getInputPlaceholder() {
  return props.inputPlaceholder;
}


</script>

<template>
  <div class="combo-box">
    <input
      type="text"
      ref="comboInput"
      class="input-dropdown"
      :placeholder="getInputPlaceholder()"
      :disabled="props.disabled"
      @keydown.enter="handleInputKeyPress"
      @input="handleInputBoxChange"
      @mouseleave="onMouseLeave"
    />
    <div
      v-show="isDropdownVisible && !props.disabled"
      class="dropdown"
      ref="dropdown"
      id="dropdown"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <label v-for="variant in selectedObjectsReactive" :key="variant">
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
