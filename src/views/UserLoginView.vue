<script setup>
import FormTitle from "../components/FormTitle.vue";
import CompanyLogo from "../components/CompanyLogo.vue";
import router from "../router";
import { ref } from 'vue';
import { 
  getUser, 
  postUser, 
  updateUser, 
  getAllUsers, 
  getAllUserByUsername, 
  getAllUserByIsActive, 
  sendEmail, 
  changePassword 
} from "../services/user_service.js"
import CustomInput from "../components/CustomInput.vue";

const usernameText = ref('');
const passwordText = ref('');

function redirectToRegister() {
  router.push("/register");
}

function showUserDetails(username, email, userUpdateDTO, changePasswordDTO) {
  // console.log(getUser(username));
  // console.log(postUser(username, email));
  // console.log(updateUser(username, userUpdateDTO));
  // console.log(getAllUsers(1, 2, "username"));
  //console.log(getAllUserByUsername(false, 2, 0, "username"));
  // sendEmail("cristian");
  // console.log(getAllUserByUsername("usern"));
  // console.log(changePassword(changePasswordDTO));
}


showUserDetails("username1", 
                "email1", 
                {
                  "role": "STANDARD"
                },
                {
                  "username": "cristian",
                  "oldPassword": "cristian",
                  "newPassword": "cristian"
                });

function login() {
  console.log('username/email', usernameText.value);
  console.log('password', passwordText.value);
  usernameText.value = '';
  passwordText.value = '';
}

</script>

<template>
  <CompanyLogo />
  <div class="container">
    <FormTitle label="Log in" />
    <div id="profile-img">
      <i class="fa-regular fa-circle-user" id="user-icon"> </i>
    </div>
    <div>
      <CustomInput
        type="text"
        id="username-email-input"
        placeholder="Username/E-mail"
        v-model:model-value="usernameText"
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
