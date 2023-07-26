<script setup>
import FormTitle from "../components/FormTitle.vue";
import CompanyLogo from "../components/CompanyLogo.vue";
import router from "../router";
import { ref } from 'vue';
import { loginUser } from "../services/user_service.js";
import CustomInput from "../components/CustomInput.vue";
import InvalidInputMessage from '../components/InvalidInputMessage.vue';

const usernameOrEmailText = ref('');
const passwordText = ref('');
const showErrorMessage = ref(false);

function redirectToRegister() {
  router.push("/register");
}

function login() {
  loginUser(usernameOrEmailText.value, passwordText.value)
      .then(res => {
        router.push('/my');
      })
      .catch(error => {
          usernameOrEmailText.value = '';
          passwordText.value = '';
          showErrorMessage.value = true;
      });
}

</script>

<template>
  <CompanyLogo />
  <div class="container">
    <FormTitle label="Log in" />
    <div id="profile-img">
      <i class="fa-regular fa-circle-user" id="user-icon"> </i>
    </div>
    <InvalidInputMessage 
      message="Incorrect username or password"
      :class="{ 'error-message-visible': showErrorMessage }"
    />
    <div>
      <CustomInput
        type="text"
        id="username-email-input"
        placeholder="Username/E-mail"
        v-model:model-value="usernameOrEmailText"
      />
    </div>
    <div>
      <CustomInput 
        type="password" 
        id="password-input" 
        placeholder="Password"
        v-model:model-value="passwordText"
      />
    </div>
    <div>
      <button 
        id="sign-in"
        @click="login"
      >
        Sign in
      </button>
    </div>
    <div id="forgot-password">
      <router-link to="/recovery"> Forgot password? </router-link>
    </div>
    <button id="register" @click="redirectToRegister">Register</button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  position: relative;
  top: 80px;
}

.error-message-visible {
  opacity: 1;
}

input {
  padding: 5px;
  border: none;
}

button {
  padding: 5px;
  padding-right: 30px;
  padding-left: 30px;
  cursor: pointer;
}

#sign-in {
  border-width: 3px;
}

#register {
  border: none;
  position: relative;
  bottom: -10vh;
}

#sign-in {
  background-color: var(--selected-color);
}

#forgot-password {
  text-decoration: underline;
}

#forgot-password:hover {
  cursor: pointer;
}

h1,
h1 span {
  font-size: 30px;
}

#company-logo {
  position: relative;
  top: 20px;
  left: 5vw;
}

#user-icon {
  font-size: 70px;
}
</style>
