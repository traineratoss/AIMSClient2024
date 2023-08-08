<script setup>
import CompanyLogo from "../components/CompanyLogo.vue";
import CustomButton from "../components/CustomButton.vue";
import FormTitle from "../components/FormTitle.vue";
import CustomInput from "../components/CustomInput.vue";
import { onMounted, ref } from "vue";
import { postUser } from "../services/user_service.js";
import router from "../router";
import InvalidInputMessage from "../components/InvalidInputMessage.vue";
import TermsAndConditionsModal from "../components/TermsAndConditionsModal.vue";

const acceptedTermsAndConditions = ref(false);
const usernameText = ref("");
const emailText = ref("");
const showErrorMessage = ref(false);
const message = ref("");
const buttonDisabled = ref(false);
const showTermsAndConditionsModal = ref(false);

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
        buttonDisabled.value = true;
        //router.push("/registration-complete");
        postUser(usernameText.value, emailText.value)
          .then((res) => {
            router.push("/registration-complete");
            showErrorMessage.value = false;
          })
          .catch((error) => {
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

function showTermsAndConditionsPopup() {
  showTermsAndConditionsModal.value = true;
}
</script>


<template>
  <div class="custom-register">
    <CompanyLogo />
    <div class="register">
      <FormTitle label="Register" />
      <span class="material-symbols-outlined"> account_circle </span>
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
          />
        </label>
        <label for="email">
          <CustomInput
            type="email"
            id="email"
            placeholder="E-mail"
            @keydown.enter="signUp"
            v-model:model-value="emailText"
          />
        </label>
      </form>
      <label for="check" class="agree-terms">
        <input
          type="checkbox"
          v-model="acceptedTermsAndConditions"
          name="acceptedTermsAndConditions"
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
    </div>
    <Teleport to="body">
      <TermsAndConditionsModal
        :show="showTermsAndConditionsModal"
        @accepted-terms-and-conditions="acceptTermsAndConditions"
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

.material-symbols-outlined {
  font-size: 10vh;
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
</style>