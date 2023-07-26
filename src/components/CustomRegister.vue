<script setup>
import CompanyLogo from "./CompanyLogo.vue";
import CustomButton from "./CustomButton.vue";
import FormTitle from "./FormTitle.vue";
import CustomInput from "../components/CustomInput.vue";
import { ref } from "vue";
import { postUser } from "../services/user_service.js";
import router from "../router";
import InvalidInputMessage from "../components/InvalidInputMessage.vue";

const acceptedTermsAndConditions = ref(false);
const usernameText = ref("");
const emailText = ref("");
const showErrorMessage = ref(false);
const message = ref("");

function signUp() {
  if (acceptedTermsAndConditions.value === true) {
    if (validateEmail(emailText.value) === true) {
      postUser(usernameText.value, emailText.value)
        .then((res) => {
          router.push("/registration-complete");
          showErrorMessage.value = false;
        })
        .catch((error) => {
          usernameText.value = "";
          emailText.value = "";
          message.value = "Userame or email already exists";
          showErrorMessage.value = true;
        });
    }
  } else {
    message.value = "You need to agree with out Terms and Conditions";
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
</script>

<template>
  <div class="custom-register">
    <CompanyLogo />
    <div class="register">
      <FormTitle label="Register" />
      <i class="fa-regular fa-circle-user"></i>
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
            v-model:model-value="emailText"
          />
        </label>
      </form>
      <label for="check">
        <input
          type="checkbox"
          v-model="acceptedTermsAndConditions"
          name="acceptedTermsAndConditions"
        />
        <router-link to="/terms"> Agree Terms & Conditions </router-link>
      </label>
      <CustomButton id="sign-up" class="sign-up-button" @click="signUp">
        Sign up
      </CustomButton>
    </div>
  </div>
</template>

<style scoped>
.custom-register {
  height: 100vh;
}
.register {
  display: flex;
  flex-direction: column;
  margin-top: 20vh;
  align-items: center;
  gap: 50px;
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
  height: 25px;
  width: 10vw;
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

</style>