<script setup>
import { defineProps, ref, computed, onMounted } from "vue";
import CustomButton from "../components/CustomButton.vue"
import router from "../router";

const dashboardIsHovered = ref(false);

const props = defineProps({
  element: {
    type: Object,
    required: true
  },
  disabled : {
    type: Boolean,
    required: true
  }
});

props.element.forEach((element) => {
element.isHovered = ref(false);
});

function onMouseEnter(element) {
  element.isHovered.value = true;
  dashboardIsHovered.value = true;
}

function onMouseLeave(element) {
  element.isHovered.value = false;
  dashboardIsHovered.value = false;
}

const onClickHandler = (element) => {
  router.push(element.route);
};

const shouldDisableDiv = computed(() => {
  return props.disabled && !dashboardIsHovered.value;
});

</script>

<template>
  <div
    class="main-container"
    v-for="element in element"
    :key="element"
    :style="`display: ${shouldDisableDiv ? 'none' : 'block'};`"
  >
  <CustomButton
      :style="{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: '1px',
        whiteSpace: 'nowrap',
        width: '100%',
        textAlign: 'right',
      }"
      :class="{ hovered: element.isHovered }"
      @mouseenter="onMouseEnter(element)"
      @mouseleave="onMouseLeave(element)"
      @click="onClickHandler(element)"
    >
    <img :src="element.icon" :style="{ width: element.width, height: element.height, marginRight: '10px' }" />
      <span style="flex: 1;">{{ element.name }}</span>
    </CustomButton>
  </div>
</template>

<style>

.hovered{
  background-color: orange;
}

</style>