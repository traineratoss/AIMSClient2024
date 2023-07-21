<script setup>
const props = defineProps({
    label: String,
})
</script>

<template>
    <div class="control-group-container">
         <span> {{ label }}</span>
         <slot></slot>
    </div>
</template>