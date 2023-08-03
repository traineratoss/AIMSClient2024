<script setup>
  import { defineProps, defineEmits, ref } from 'vue';
  
  const { modelValue, placeholder, error, type, inputRef } = defineProps([
    'modelValue',
    'placeholder',
    'error',
    'type',
    'inputRef'
  ]);

  const focused = ref(false);
  
  const emit = defineEmits(['update:modelValue']);
  
  const inputChange = (event) => {
    emit('update:modelValue', event.target.value);
  };

  const handleFocus = () => {
    focused.value = true;
  }

  const handleBlur = () => {
    focused.value = false;
  }

</script>

<template>
    <input
      :type="type"
      ref="inputRef"
      :placeholder="placeholder"
      :class="{ input: error }"
      required
      :value="modelValue"
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