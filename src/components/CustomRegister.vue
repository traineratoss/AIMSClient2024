<script setup>
import CompanyLogo from "./CompanyLogo.vue";
import CustomButton from "./CustomButton.vue";
import FormTitle from "./FormTitle.vue";
import CustomInput from '../components/CustomInput.vue';
import { ref } from 'vue';

const acceptedTermsAndConditions = ref(false);
const usernameText = ref('');
const passwordText = ref('');

function signUp() {
  console.log('username', usernameText.value);
  console.log('password', passwordText.value);
  console.log('checked', acceptedTermsAndConditions.value);
}
</script>

<template>
  <div class="custom-register">
    <CompanyLogo />
    <div class="register">
      <FormTitle label="Register" />
      <i class="fa-regular fa-circle-user"></i>
      <form action="" id="form">
        <label for="username">
          <CustomInput 
            type="text" 
            id="username" 
            placeholder="Username" 
            v-model:model-value="usernameText"
          />
        </label>
        <label for="email">
          <CustomInput 
            type="email" 
            id="email" 
            placeholder="E-mail" 
            v-model:model-value="passwordText"
          />
        </label>
      </form>
      <label for="check">
        <input 
          type="checkbox" 
          v-model="acceptedTermsAndConditions"
        />
        <router-link to="/terms"> Agree Terms & Conditions </router-link>
      </label>
      <CustomButton 
        id="sign-up" 
        class="sign-up-button"
        @click="signUp"
      >
        Sign up 
      </CustomButton>
    </div>
  </div>
</template>

<style scoped>
.custom-register {
  height: 100vh;
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