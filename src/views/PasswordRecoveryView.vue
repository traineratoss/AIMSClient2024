<script setup>
import CompanyLogo from "../components/CompanyLogo.vue";
import CustomInput from "../components/CustomInput.vue";
import CustomButton from "../components/CustomButton.vue";
import { checkValidationeCode, sendNewPassword } from "../services/user_service.js";
import { ref } from "vue";
import router from "../router";
import InvalidInputMessage from "../components/InvalidInputMessage.vue";
import FormTitle from "../components/FormTitle.vue";
import CodeValidation from "../components/CodeValidation.vue";

const usernameOrEmailText = ref("");
const showErrorMessage = ref(false);
const errorMessage = ref("");
const showCodeValidation = ref(false);
const code = ref([]);


 function requestNewPassword() { 
  if (usernameOrEmailText.value.toLowerCase()) {
    sendNewPassword(usernameOrEmailText.value)
    showCodeValidation.value = true; 
    } else {
    showErrorMessage.value = true;
    errorMessage.value = "The field must not be empty";
  }
}
  
async function verifyOtp() {
  const otp = code.value.join(""); 
  try {
    await checkValidationeCode(otp, usernameOrEmailText.value);
    router.push('/change'); 
  } catch (error) {
    showErrorMessage.value = true;
    errorMessage.value = error.message;
  }
}

function updateOTP(otp) {
  console.log(otp);
  code.value = otp;
} 
  
</script>

<template>
  <CompanyLogo />
  <div class="container">
    <FormTitle 
      :label="'Password Recovery'"
    />
    <InvalidInputMessage
      :message="errorMessage"
      :class="{ 'error-message-visible': showErrorMessage }"
    />
    <div>
      <CustomInput
        type="text"
        id="username-email-input"
        placeholder="Username/E-mail"
        v-model:model-value="usernameOrEmailText"
        @keydown.enter="requestNewPassword"
      />
    </div>
    <div>
      <CustomButton 
        v-if="!showCodeValidation"
        id="request-password" 
        @click="requestNewPassword" 
        style="width: auto;"
      >
        Request new Password
      </CustomButton>
      <CodeValidation v-if="showCodeValidation" @otp-updated="updateOTP" />
      <CustomButton 
        v-if="showCodeValidation"
        id="validation-code" 
        @click="verifyOtp" 
        style="display: flex; justify-content: center; align-items: center; height: 30px; width: 140px; margin-top: 20px; margin-left: 100px;"
      >
        Check Validation Code
      </CustomButton>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  position: relative;
  margin-top: 10vh;
}

.error-message-visible {
  opacity: 1;
}

.material-symbols-outlined {
  font-size: 10vh;
}

h1 {
  font-size: 30px;
}

#name {
  color: var(--selected-color);
  text-align: center;
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
