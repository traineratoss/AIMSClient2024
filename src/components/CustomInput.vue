<script setup>

const {modelValue, placeholder, error} = defineProps(['modelValue', 'placeholder', 'error']);
const emit = defineEmits(['update:modelValue'])



</script>

<template>

    <input
        :value="modelValue"
        :placeholder="placeholder"
        :class="{input:error}"
        required="true"
        @input="$emit('update:modelValue', $event.target.value)"
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