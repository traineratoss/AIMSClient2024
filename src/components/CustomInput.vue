<script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const { modelValue, placeholder, error, type, inputRef } = defineProps([
    'modelValue',
    'placeholder',
    'error',
    'type',
    'inputRef'
  ]);
  
  const emit = defineEmits(['update:modelValue']);
  
  const inputChange = (event) => {
    emit('update:modelValue', event.target.value);
  };
  
  const handleSelected = () => {
    console.log('Dd');
  };
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
      @selected="handleSelected"
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