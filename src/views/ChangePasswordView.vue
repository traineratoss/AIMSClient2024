<script setup>
import CompanyLogo from "../components/CompanyLogo.vue";
import CustomInput from "../components/CustomInput.vue";
import { ref } from "vue";
import {
  changePassword,
  getCurrentAvatarId,
  getCurrentUsername,
  logout,
} from "../services/user_service";
import router from "../router";
import InvalidInputMessage from "../components/InvalidInputMessage.vue";
import PasswordInput from "../components/PasswordInput.vue";

const oldPasswordText = ref("");
const newPasswordText = ref("");
const confirmNewPassword = ref("");
const showErrorMessage = ref(false);
const errorMessage = ref("");
const currentAvatarId = ref(-1);

currentAvatarId.value = getCurrentAvatarId();

const slideImages = [
  "src/assets/img/avatars/avatar1.svg",
  "src/assets/img/avatars/avatar2.svg",
  "src/assets/img/avatars/avatar3.svg",
  "src/assets/img/avatars/avatar4.svg",
  "src/assets/img/avatars/avatar5.svg",
  "src/assets/img/avatars/avatar6.svg",
  "src/assets/img/avatars/avatar7.svg",
];

function submit() {
  if (
    oldPasswordText.value &&
    newPasswordText.value &&
    confirmNewPassword.value
  ) {
    if (newPasswordText.value === confirmNewPassword.value) {
      let passwordFormatOK = true;
      const upperCaseRegex = /[A-Z]/;
      const specialCharacterRegex = /[#$^&*_@]/;

      if (newPasswordText.value.length < 8) {
        errorMessage.value =
          "The new password must contain at least 8 characters";
        showErrorMessage.value = true;
        passwordFormatOK = false;
      }

      if (!upperCaseRegex.test(newPasswordText.value) && passwordFormatOK) {
        errorMessage.value =
          "The new password must contain at least one uppercase character";
        showErrorMessage.value = true;
        passwordFormatOK = false;
      }

      if (
        !specialCharacterRegex.test(newPasswordText.value) &&
        passwordFormatOK
      ) {
        errorMessage.value =
          "The new password must contain at least one special character(#$^&*_@)";
        showErrorMessage.value = true;
        passwordFormatOK = false;
      }

      if (passwordFormatOK) {
        changePassword({
          username: getCurrentUsername(),
          oldPassword: oldPasswordText.value,
          newPassword: newPasswordText.value,
        })
          .then((res) => {
            logout();
            router.push("/login");
          })
          .catch((error) => {
            errorMessage.value = "Old password is incorrect";
            showErrorMessage.value = true;
          });
      }
    } else {
      errorMessage.value = "Passwords are not equal";
      showErrorMessage.value = true;
    }
  } else {
    errorMessage.value = "All fields must be completed";
    showErrorMessage.value = true;
  }
}

function handleOldPasswordTextChanged(password) {
  oldPasswordText.value = password;
}

function handleNewPasswordTextChanged(password) {
  newPasswordText.value = password;
}

function handleConfirmPasswordTextChanged(password) {
  confirmNewPassword.value = password;
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
      <img
        :src="slideImages[currentAvatarId]"
        alt="avatar not found"
        style="height: auto; width: 10vw"
      />
    </div>
    <InvalidInputMessage
      :message="errorMessage"
      :class="{ 'error-message-visible': showErrorMessage }"
    />
    <div>
      <PasswordInput
        :label="'Current password'"
        :value="oldPasswordText"
        @password-changed="handleOldPasswordTextChanged"
      />
    </div>
    <div>
      <PasswordInput
        :label="'New password'"
        :value="newPasswordText"
        @password-changed="handleNewPasswordTextChanged"
      />
    </div>
    <div>
      <PasswordInput
        :label="'Confirm password'"
        :value="confirmNewPassword"
        @password-changed="handleConfirmPasswordTextChanged"
        @enter-password="submit"
      />
    </div>
    <div id="controls-container">
      <router-link to="/my-profile" id="cancel"> Cancel </router-link>
      <button id="submit" @click="submit">Submit</button>
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
  margin-top: 10vh;
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

a {
  color: black;
}
</style>
