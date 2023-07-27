<script setup>
import CompanyLogo from "../components/CompanyLogo.vue";
import CustomInput from '../components/CustomInput.vue';
import { ref } from 'vue';

const oldPasswordText = ref('');
const newPasswordText = ref('');
const confirmNewPassword = ref('');

function submit() {
  console.log('old password', oldPasswordText.value);
  console.log('new password', newPasswordText.value);
  console.log('confirm new password', confirmNewPassword.value);
}
</script>

<template>
  <CompanyLogo />
  <div class="container">
    <h1 id="title">
      <div class="big-text" id="name">AIMS</div>
      <div class="big-text">Change Password</div>
    </h1>
    <div id="profile-img">
      <span class="material-symbols-outlined">
        account_circle
      </span>
    </div>
    <div>
      <CustomInput
        type="password"
        id="current-password-input"
        placeholder="Current password"
        v-model:model-value="oldPasswordText"
      />
    </div>
    <div>
      <CustomInput
        type="password"
        id="current-password-input"
        placeholder="New password"
        v-model:model-value="newPasswordText"
      />
    </div>
    <div>
      <CustomInput
        type="password"
        id="current-password-input"
        placeholder="Confirm new password"
        v-model:model-value="confirmNewPassword"
      />
    </div>
    <div id="controls-container">
      <router-link to="/my-profile" id="cancel"> Cancel </router-link>
      <button 
        id="submit"
        @click="submit"
      >
        Submit
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

.material-symbols-outlined {
  font-size: 10vh;
}

#cancel {
  display: flex;
  align-items: center;
}

input {
  padding: 5px;
  border: none;
}

#controls-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

button {
  padding: 5px;
  padding-right: 30px;
  padding-left: 30px;
  cursor: pointer;
}

#submit {
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

#company-logo {
  position: relative;
  top: 20px;
  left: 5vw;
}

#user-icon {
  font-size: 70px;
}
</style>
