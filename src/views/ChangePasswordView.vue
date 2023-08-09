<script setup>
import CompanyLogo from "../components/CompanyLogo.vue";
import { ref, onMounted } from "vue";
import {
  changePassword,
  getCurrentAvatarId,
  getCurrentUsername,
  logout,
  isFirstLogin
} from "../services/user_service";
import router from "../router";
import InvalidInputMessage from "../components/InvalidInputMessage.vue";
import PasswordInput from "../components/PasswordInput.vue";
import CustomButton from "../components/CustomButton.vue";

const oldPasswordText = ref("");
const newPasswordText = ref("");
const confirmNewPassword = ref("");
const showErrorMessage = ref(false);
const errorMessage = ref("");
const currentAvatarId = ref(-1);

const passwordLength = ref(0);
const containsEightCharacters = ref(false);
const containsNumber = ref(false);
const containsUppercase = ref(false);
const containsSpecialCharacter = ref(false);
const firstLogin = ref(false);

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

onMounted(() => {
  isFirstLogin(getCurrentUsername()).then(res => {
    firstLogin.value = res;
  });
})

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

function checkPassword() {
  passwordLength.value = newPasswordText.value.length;
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\,.<>\/?]/;

  containsEightCharacters.value = passwordLength.value > 7 ? true : false;
  containsNumber.value = /\d/.test(newPasswordText.value);
  containsUppercase.value = /[A-Z]/.test(newPasswordText.value);
  containsSpecialCharacter.value = format.test(newPasswordText.value);
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
        style="height: auto; width: 8vw"
      />
    </div>
    <InvalidInputMessage
      :message="errorMessage"
      :class="{ 'error-message-visible': showErrorMessage }"
    />
    <div class="verification-container">
      <ul>
        <li :class="{ is_valid: containsEightCharacters }">8 Characters</li>
        <li :class="{ is_valid: containsNumber }">Contains numbers</li>
        <li :class="{ is_valid: containsUppercase }">Contains Uppercase</li>
        <li :class="{ is_valid: containsSpecialCharacter }">
          Contains Special Character
        </li>
      </ul>
    </div>
    <div>
      <PasswordInput
        :label="'Current password'"
        :value="oldPasswordText"
        @password-changed="handleOldPasswordTextChanged"
        @keyup="checkPassword"
      />
    </div>
    <div>
      <PasswordInput
        :label="'New password'"
        :value="newPasswordText"
        @password-changed="handleNewPasswordTextChanged"
        @input="checkPassword"
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
      <button
        id="cancel" 
        :disabled="firstLogin" 
        @click="router.push('my-profile')"
      > Cancel </button>
      <CustomButton id="submit" @click="submit">Submit</CustomButton>
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
  text-decoration: underline;
  background-color: transparent;
  border: none;
}

#cancel:hover {
  cursor: pointer;
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

#title {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#name {
  color: var(--selected-color);
}

#submit {
  font-size: 15px;
  font-weight: 500;
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

.verification-container {
  height: 7vh;
  width: 10vw;
  margin-bottom: 10px;
  background-color: var(--background-color);
  border-radius: 15px;
  padding: 10px;
  box-shadow: 2px 2px 5px 5px var(--sidebar-color);
}

ul {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;

  margin: 0;
  padding: 0;
  list-style: none;
  color: red;
}

li:before {
  content: "X";
  padding-right: 10px;
}

.is_valid {
  color: green;
  list-style: none;
}

ul .is_valid:before {
  content: "✓";
  padding-right: 10px;
}
</style>
