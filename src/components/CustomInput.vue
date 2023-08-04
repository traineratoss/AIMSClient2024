<script setup>
  import { defineProps, defineEmits, ref, watch} from 'vue';
  
  const { modelValue, placeholder, error, type, inputRef } = defineProps([
    'modelValue',
    'placeholder',
    'error',
    'type'
  ]);
  
  const emit = defineEmits(['update:modelValue']);
  
  const inputChange = (event) => {
    emit('update:modelValue', event.target.value);
  };

  const focused = ref(false);
  const inputValue = ref("");

  const handleFocus = () => {
    focused.value = true;
  }

  const handleBlur = () => {
    focused.value = false;
  }

  const handleInputKeyPress = (event) => {
    if (event.key === "Enter" && event.target.value !== "" && focused.value == true) {
        this.emitter.emit("filter-ideas-by-title", true)
    }
  }

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
    />
</template>
  
<style scoped>
  .input {
    border-color: red;
    border-width: 1.4px;
    border-radius: 1px;
  }
  
  .input::placeholder {
    color: red;
  }
</style>