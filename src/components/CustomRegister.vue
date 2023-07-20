<script setup>
import CustomButton from "./CustomButton.vue";
import FormTitle from "./FormTitle.vue";
</script>

<template>
  <div class="custom-register">
    <img src="../assets/img/company.png" />
    <div class="register">
      <FormTitle />
      <i class="fa-regular fa-circle-user"></i>
      <form action="" id="form">
        <label for="username">
          <input type="text" id="username" placeholder="Username" />
        </label>
        <label for="email">
          <input type="email" id="email" placeholder="E-mail" />
        </label>
      </form>
      <label for="check">
        <input type="checkbox" />
        <router-link to="/terms"> 
          Agree Terms & Conditions
        </router-link>
      </label>
      <CustomButton id="sign-up" label="Sign Up" class="sign-up-button" />
    </div>
  </div>
</template>

<style scoped>
.custom-register {
  height: 100vh;
}

img {
  padding: 10px;
  width: 150px;
}
.register {
  display: flex;
  flex-direction: column;
  margin-top: 20vh;
  align-items: center;
  gap: 50px;
}

.register i {
  font-size: 70px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

form input {
  border: none;
  height: 25px;
  width: 10vw;
  padding: 5px;
}

a {
  color: black;
}

input[type="checkbox"] {
  accent-color: var(--selected-color);
}
</style>