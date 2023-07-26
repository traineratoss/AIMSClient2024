<script setup>
import CustomButton from "../components/CustomButton.vue";
const props = defineProps({
  title: String,
  subtitle: String,
  message: String,
});
</script>


<template>
  <div class="registration">
    <h1>{{ title }}</h1>
    <i class="fa-solid fa-square-check"></i>
    <h3>{{ subtitle }}</h3>
    <h4>
      {{ message }}
    </h4>
    <CustomButton
      :id="back - to - login"
      class="return-button"
      @click="$router.push({ path: '/login' })"
      >Return to login page</CustomButton
    >
  </div>
</template>

<style scoped>
.registration {
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5vh;

  background-color: white;
}

.registration h1 {
  margin-top: 25vh;

  font-size: 50px;
  font-weight: 400;
}

.registration i {
  font-size: 50px;
  color: var(--selected-color);
}

h3 {
  font-size: 15px;
  font-weight: 500;
}

h4 {
  font-size: 13px;
  font-weight: 400;
}
.return-button {
  width: auto;
  height: 35px;

  font-weight: 500;

  border: none;
}
</style>