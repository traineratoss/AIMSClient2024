<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import searchValue from "../utils/search-title";

const { canModifySearchValue, modelValue, placeholder, error, type, inputRef } =
  defineProps([
    "canModifySearchValue",
    "modelValue",
    "placeholder",
    "error",
    "type",
  ]);

const emit = defineEmits(["update:modelValue"]);

const inputChange = (event) => {
  emit("update:modelValue", event.target.value);
};

const focused = ref(false);
const inputValue = ref("");

const handleFocus = () => {
  focused.value = true;
};

const handleBlur = () => {
  focused.value = false;
};

const handleInputKeyPress = (event) => {
  if (event.key === "Enter" && focused.value && canModifySearchValue) {
    searchValue.value = {
      text: event.target.value,
      key: "Enter",
    };
    setTimeout(() => {
      console.log(searchValue.value);
    }, 1000);
  }
  return false;
};

const handleInputKeyChange = (event) => {
  if (focused.value == true && canModifySearchValue) {
    searchValue.value = {
      text: event.target.value,
      key: null,
    };
  }
};
</script>

<template>
  <input
    :type="type"
    ref="inputValue"
    :placeholder="placeholder"
    :class="{ input: error }"
    required
    :value="modelValue"
    @keydown.enter="handleInputKeyPress"
    @input="inputChange"
    @focus="handleFocus"
    @blur="handleBlur"
    @keyup="handleInputKeyChange"
  />
</template>

<style scoped>
.input {
  border-color: red;
  border-width: 1.4px;
  border-radius: 1px;
}
input {
  width: 8vw;
  padding: 5px;
  border: none;
}

.input::placeholder {
  color: red;
}
</style>
