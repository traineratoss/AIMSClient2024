<script setup>
const props = defineProps({
  show: Boolean,
  title: String,
  description: String,
});
</script>


<template>
  <dialog :open="show" class="overlay">
    <div class="dialog">
      <div class="dialog__content">
        <h2 class="dialog__title" v-text="title"></h2>
        <p class="dialog__description" v-text="description"></p>
      </div>

      <hr />

      <div class="dialog__footer">
        <slot></slot>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
</style>