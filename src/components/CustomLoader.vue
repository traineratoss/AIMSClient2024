<!-- 
    The container in which this component should be placed
    should be the hight of the entire avb. screen 
    and flex display with everything centerd.
 -->

<script setup>
const props = defineProps({
  size: "",
});
</script>

<template>
  <div
    class="loader"
    :style="{ height: props.size + 'px', width: props.size + 'px' }"
  ></div>
</template>

<style scoped>
.loader {
  margin: auto;
  border: 10px solid #dedede;
  border-radius: 50%;
  animation: spinner 1s linear infinite;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
    border-top: 10px solid #ffa941;
  }
  50% {
    border-top: 10px solid #dedede;
  }
  100% {
    transform: rotate(360deg);
    border-top: 10px solid #ffa941;
  }
}
</style>
