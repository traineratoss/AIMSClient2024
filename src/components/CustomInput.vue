<script setup>
import { ref } from 'vue';

const {modelValue, placeholder, error} = defineProps(['modelValue', 'placeholder', 'error', 'type']);
const emit = defineEmits(['update:modelValue'])

const inputValue = ref(modelValue);

function inputChange() {
    emit('update:modelValue', inputValue.value);
}

</script>

<template>

    <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :class="{input:error}"
        required="true"
        v-model="inputValue"
        @keyup="inputChange"
    />
</template>

<style scoped>
.input{
    border-color: red;
    border-width: 1.4px; 
    border-radius: 1px;
}

.input::placeholder {
    color: red;
}
</style>