<script setup>
import FormTitle from "../components/FormTitle.vue";
import CompanyLogo from "../components/CompanyLogo.vue";
import CustomInput from '../components/CustomInput.vue';
import { ref } from 'vue';

const usernameText = ref('');

function requestNewPassword() {
  console.log('username/email', usernameText.value);
}
</script>

<template>
  <CompanyLogo />
  <div class="container">
    <FormTitle label="Password Recovery" />
    <div id="profile-img">
      <i class="fa-regular fa-circle-user" id="user-icon"> </i>
    </div>
    <div>
      <CustomInput
        type="text"
        id="username-email-input"
        placeholder="Username/E-mail"
        v-model:model-value="usernameText"
        @keydown.enter="requestNewPassword"
      />
    </div>
    <div>
      <button 
        id="request-password"
        @click="requestNewPassword"
      >
        Request new Password
      </button>
    </div>
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

img {
  padding: 10px;
  width: 150px;
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

#request-password {
  border-width: 3px;
  background-color: var(--selected-color);
}

#title {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#name {
  color: var(--selected-color);
}

.big-text {
  font-size: 30px;
}

#user-icon {
  font-size: 70px;
}
</style>
