<script setup>
import CompanyLogo from "../components/CompanyLogo.vue";
import CustomButton from "../components/CustomButton.vue";
import FormTitle from "../components/FormTitle.vue";
import CustomInput from "../components/CustomInput.vue";
import { ref } from "vue";
import { postUser, validateUsername, sendEmailToAllAdmins } from "../services/user_service.js";
import router from "../router";
import InvalidInputMessage from "../components/InvalidInputMessage.vue";
import TermsAndConditionsModal from "../components/TermsAndConditionsModal.vue";
import CustomLoader from "../components/CustomLoader.vue";

const acceptedTermsAndConditions = ref(false);
const usernameText = ref("");
const emailText = ref("");
const showErrorMessage = ref(false);
const message = ref("");
const buttonDisabled = ref(false);
const showTermsAndConditionsModal = ref(false);
const showUsernameDetails = ref(false);
const showLoadingCircle = ref(false);

function signUp() {
  if (acceptedTermsAndConditions.value === true) {
    if (
      emailText.value === "" ||
      emailText.value === null ||
      usernameText.value === "" ||
      usernameText.value === null
    ) {
      message.value = "All the fields should be completed!";
      showErrorMessage.value = true;
    } else {
      if (validateEmail(emailText.value) === true) {
        if (validateUsername(usernameText.value) === true) {
          buttonDisabled.value = true;
          setTimeout(() => {
            if (!showErrorMessage.value) {
              showLoadingCircle.value = true;
            }
          }, 250);
          showErrorMessage.value = false;
          postUser(usernameText.value, emailText.value)
            .then((res) => {
              sendEmailToAllAdmins(usernameText.value);
              router.push("/registration-complete");
            })
            .catch((error) => {
              showLoadingCircle.value = false;
              if (error.message === "Server connection error") {
                message.value = error.message;
              } else {
                message.value = "Username or email already exists";
              }
              buttonDisabled.value = false;
              usernameText.value = "";
              emailText.value = "";
              showErrorMessage.value = true;
            });
        } else {
          message.value = "Username format invalid";
          showErrorMessage.value = true;
        }
      }
    }
  } else {
    message.value = "You need to agree with our Terms and Conditions";
    showErrorMessage.value = true;
  }
}

function validateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  message.value = "Invalid email address";
  showErrorMessage.value = true;
  return false;
}

function acceptTermsAndConditions() {
  acceptedTermsAndConditions.value = true;
  showTermsAndConditionsModal.value = false;
}

function declineTermsAndConditions() {
  showTermsAndConditionsModal.value = false;
}

function showTermsAndConditionsPopup() {
  showTermsAndConditionsModal.value = true;
}
</script>


<template>
  <div
    class="custom-register"
    tabindex="-1"
    @focus="showUsernameDetails = false"
  >
    <CompanyLogo />
    <div class="register">
      <FormTitle label="Register" />
      <InvalidInputMessage
        :message="message"
        :class="{ 'error-message-visible': showErrorMessage }"
      />
      <form action="" id="form">
        <label for="username">
          <CustomInput
            type="text"
            id="username"
            placeholder="Username"
            v-model:model-value="usernameText"
            @focus="showUsernameDetails = true"
          />
        </label>
        <span 
          v-show="showUsernameDetails" 
          id="usernameConstraints"
        >
          *Username may contain letters, numbers
          (0-9), dots (.) or underscores (_)
        </span>
        <label for="email">
          <CustomInput
            type="email"
            id="email"
            placeholder="E-mail"
            @keydown.enter="signUp"
            v-model:model-value="emailText"
            @focus="showUsernameDetails = false"
          />
        </label>
      </form>
      <label for="check" class="agree-terms">
        <input
          type="checkbox"
          v-model="acceptedTermsAndConditions"
          name="acceptedTermsAndConditions"
          @keydown.enter="acceptedTermsAndConditions = !acceptedTermsAndConditions"
          :disabled="!acceptedTermsAndConditions"
        />
        <button
          class="terms-and-conditions-button"
          @click="showTermsAndConditionsPopup"
        >
          Agree Terms & Conditions
        </button>
      </label>
      <CustomButton
        id="sign-up"
        class="sign-up-button"
        @click="signUp"
        :disabled="buttonDisabled"
      >
        Sign up
      </CustomButton>
      <div
        v-if="showLoadingCircle"
        class="loading-circle"
      >
        <CustomLoader :size="'50'" />
      </div>
    </div>
    <Teleport to="body">
      <TermsAndConditionsModal
        :show="showTermsAndConditionsModal"
        @accepted-terms-and-conditions="acceptTermsAndConditions"
        @declined-terms-and-conditions="declineTermsAndConditions"
      />
    </Teleport>
  </div>
</template>

<style scoped>
.custom-register {
  height: 100vh;
}
.register {
  display: flex;
  flex-direction: column;
  margin-top: 10vh;
  align-items: center;
  gap: 20px;
}

.loading-circle {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
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
  padding: 5px;
}

a {
  color: black;
}

input[type="checkbox"] {
  accent-color: var(--selected-color);
}

.error-message-visible {
  opacity: 1;
}

.agree-terms {
  margin: 4vh;
}

.terms-and-conditions-button {
  border: none;
  background-color: transparent;
  text-decoration: underline;
}

.terms-and-conditions-button:hover {
  cursor: pointer;
}

#usernameConstraints {
  width: 8.5vw;
  font-size: 12px;
  color: var(--color);
}
</style>