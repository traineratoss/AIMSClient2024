<script setup>
import FormTitle from "../components/FormTitle.vue";
import CompanyLogo from "../components/CompanyLogo.vue";
import router from "../router";
import { ref } from 'vue';
import { loginUser, setCurrentUser } from "../services/user_service.js";
import CustomInput from "../components/CustomInput.vue";
import InvalidInputMessage from '../components/InvalidInputMessage.vue';
import bcrypt from "bcryptjs";

const usernameOrEmailText = ref('');
const passwordText = ref('');
const showErrorMessage = ref(false);

const user = {
  username: String,
  role: String
}

function redirectToRegister() {
  router.push("/register/false");
}

async function login() {
  const hashPassword = await bcrypt.hash(passwordText.value, "$2a$10$QkRidA35ea0Fzm/ObrOEgO");
  if(usernameOrEmailText.value && passwordText.value) {
    loginUser(usernameOrEmailText.value, hashPassword)
      .then(res => {
        router.push('/my');
        if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
        }
        setCurrentUser(usernameOrEmailText.value);
        return user;
      })
      .catch(error => {
          usernameOrEmailText.value = '';
          passwordText.value = '';
          showErrorMessage.value = true;
      });
  } else {
    showErrorMessage.value = true;
  }
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}
</script>

<template>
  <CompanyLogo />
  <div class="container">
    <FormTitle label="Log In" />
    <div id="profile-img">
      <span class="material-symbols-outlined">
        account_circle
      </span>
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

.material-symbols-outlined {
  font-size: 10vh;
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
