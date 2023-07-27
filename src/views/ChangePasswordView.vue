<script setup>
import CompanyLogo from "../components/CompanyLogo.vue";
import CustomInput from '../components/CustomInput.vue';
import { ref } from 'vue';
import { changePassword, getCurrentUser, logout } from "../services/user_service";
import router from "../router";
import InvalidInputMessage from '../components/InvalidInputMessage.vue';

const oldPasswordText = ref('');
const newPasswordText = ref('');
const confirmNewPassword = ref('');
const showErrorMessage = ref(false);
const errorMessage = ref('');

function submit() {
  if(oldPasswordText.value && newPasswordText.value && confirmNewPassword.value) {
    if(newPasswordText.value === confirmNewPassword.value) {
      let passwordFormatOK = true;
      const upperCaseRegex = /[A-Z]/;
      const specialCharacterRegex = /[#$^&*_@]/;

      if(newPasswordText.value.length < 8) {
        errorMessage.value = 'The new password must contain at least 8 characters';
        showErrorMessage.value = true;
        passwordFormatOK = false;
      }

      if(!upperCaseRegex.test(newPasswordText.value) && passwordFormatOK) {
        errorMessage.value = 'The new password must contain at least one uppercase character';
        showErrorMessage.value = true;
        passwordFormatOK = false;
      }

      if(!specialCharacterRegex.test(newPasswordText.value) && passwordFormatOK) {
        errorMessage.value = 'The new password must contain at least one special character(#$^&*_@)';
        showErrorMessage.value = true;
        passwordFormatOK = false;
      }

      if(passwordFormatOK) {
        changePassword({
          username: getCurrentUser(),
          oldPassword: oldPasswordText.value,
          newPassword: newPasswordText.value
        })
          .then(res => {
            logout();
            router.push('/login');
          })
          .catch(error => {
            errorMessage.value = 'Old password is incorrect';
            showErrorMessage.value = true;
          });
      }
    } else {
      errorMessage.value = 'Passwords are not equal';
      showErrorMessage.value = true;
    }
  } else {
    errorMessage.value = 'All fields must be completed';
    showErrorMessage.value = true;
  }
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
      <!-- TODO: Show current logged user avatar here -->
      <span class="material-symbols-outlined">
        account_circle
      </span>
    </div>
    <InvalidInputMessage 
      :message="errorMessage"
      :class="{ 'error-message-visible': showErrorMessage }"
    />
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

.error-message-visible {
  opacity: 1;
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
