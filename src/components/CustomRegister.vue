<script setup>
import CompanyLogo from "./CompanyLogo.vue";
import CustomButton from "./CustomButton.vue";
import FormTitle from "./FormTitle.vue";
import CustomInput from "../components/CustomInput.vue";
import { onMounted, ref } from "vue";
import { postUser } from "../services/user_service.js";
import router from "../router";
import InvalidInputMessage from "../components/InvalidInputMessage.vue";
import { useRoute } from "vue-router";

const acceptedTermsAndConditions = ref(useRoute().params.accepted == "true");
const usernameText = ref("");
const emailText = ref("");
const showErrorMessage = ref(false);
const message = ref("");
const buttonDisabled = ref(false);

router.beforeEach((to, from) => {
  if (from.name === "register" && to.name === "terms") {
    sessionStorage.setItem("username", usernameText.value);
    sessionStorage.setItem("email", emailText.value);
  }
});

onMounted(() => {
  if (sessionStorage.getItem("username") && sessionStorage.getItem("email")) {
    usernameText.value = sessionStorage.getItem("username");
    emailText.value = sessionStorage.getItem("email");

    sessionStorage.removeItem("username");
    sessionStorage.removeItem("email");
  }
});

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
        postUser(usernameText.value, emailText.value)
          .then((res) => {
            router.push("/registration-complete");
            showErrorMessage.value = false;
          })
          .catch((error) => {
            buttonDisabled.value = false;
            usernameText.value = "";
            emailText.value = "";
            message.value = "Userame or email already exists";
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
      <label for="check">
        <input
          type="checkbox"
          v-model="acceptedTermsAndConditions"
          name="acceptedTermsAndConditions"
        />
        <router-link to="/terms"> Agree Terms & Conditions </router-link>
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