<script setup>
import { defineProps, ref, computed, defineEmits } from "vue";
import CustomButton from "../components/CustomButton.vue"
import router from "../router";
import { logout } from "../services/user_service";

const dashboardIsHovered = ref(false);

const emits = defineEmits(['clickedDropDown']);

const props = defineProps({
  element: {
    type: Object,
    required: true
  },
  disabled : {
    type: Boolean,
    required: true
  },
  image: String
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
  if(element.id === 'logout') {
    logout();
  }
  emits('clickedDropDown', element.id);
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
      :id="element.id"
      :style="{
        display: 'flex',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: '1px',
        whiteSpace: 'nowrap',
        width: '100%',
        textAlign: 'right',
      }"
      @mouseenter="onMouseEnter(element)"
      @mouseleave="onMouseLeave(element)"
      @click="onClickHandler(element)"
    >
      <span class="material-symbols-outlined">
        {{ element.icon }}
      </span>
      <span style="flex: 1;">{{ element.name }}</span>
    </CustomButton>
  </div>
</template>

<style>

#all-users, #stats, #profile, #change-password, #dashboard, #logout, #my-ideas {
  background-color: white;
}

#all-users:hover, #stats:hover, #profile:hover, #change-password:hover, #dashboard:hover, #logout:hover, #my-ideas:hover {
  background-color: var(--selected-color);
}
</style>