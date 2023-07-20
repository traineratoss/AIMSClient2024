<script setup>
import CustomButton from "../components/CustomButton.vue";
</script>

<template>
  <div class="registration">
    <h1>REGISTRATION COMPLETE</h1>
    <i class="fa-solid fa-square-check"></i>
    <h3>Thank you for registering on AIMS. You are almost done.</h3>
    <h4>
      Please note that an administrator will also need to approve your
      registration for you to use all available functionalities in AIMS.
    </h4>
    <CustomButton
      :id="back - to - login"
      label="Return to login page"
      class="return-button"
      @click="$router.push({ path: '/register' })"
    />
  </div>
</template>

<style scoped>
.registration {
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  gap: 5vh;

  background-color: white;
}

.registration h1 {
  margin-top: 20vh;

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
  width: 8vw;
  height: 35px;

  font-weight: 500;

  border: none;
}
</style>