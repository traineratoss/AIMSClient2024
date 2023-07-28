<script setup>
import CustomButtonGray from "../components/CustomButtonGray.vue";
import CustomButton from "../components/CustomButton.vue";
import CustomInput from "../components/CustomInput.vue";
import CarouselImage from "../components/CarouselImage.vue";
import { ref } from "vue";
import InvalidInputMessage from "../components/InvalidInputMessage.vue";
import { getCurrentUser, updateUser } from "../services/user_service";

const usernameText = ref("");
const fullNameText = ref("");
const emailText = ref("");
const showErrorMessage = ref(false);
const errorMessage = ref("");

const slideImages = [
  "src/assets/img/avatars/avatar1.svg",
  "src/assets/img/avatars/avatar2.svg",
  "src/assets/img/avatars/avatar3.svg",
  "src/assets/img/avatars/avatar4.svg",
  "src/assets/img/avatars/avatar5.svg",
  "src/assets/img/avatars/avatar6.svg",
  "src/assets/img/avatars/avatar7.svg",
];

function saveChanges() {
  if (usernameText.value && fullNameText.value && emailText.value) {
    const changesOK = true;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailRegex.test(emailText.value)) {
      errorMessage.value = "Invalid email format";
      showErrorMessage.value = true;
      changesOK = false;
    }

    if (changesOK) {
      updateUser(getCurrentUser().username, {
        username: usernameText.value,
        fullname: fullNameText.value,
        email: emailText.value,
      }).catch((error) => {
        errorMessage.value = "Username already exists";
        showErrorMessage.value = true;
        changesOK = false;
      });
    }
  } else {
    errorMessage.value = "All fields must be completed";
    showErrorMessage.value = true;
  }
}
</script>

<template>
  <div class="my-profile">
    <h1>My profile</h1>
    <InvalidInputMessage
      :message="errorMessage"
      :class="{ 'error-message-visible': showErrorMessage }"
    />
    <form action="">
      <div class="form-input">
        <label for="username"> Username </label>
        <CustomInput type="text" v-model:model-value="usernameText" />
      </div>

      <div class="form-input">
        <label for="full-name"> Full name </label>
        <CustomInput type="text" v-model:model-value="fullNameText" />
      </div>

      <div class="form-input">
        <label for="email"> E-mail </label>
        <CustomInput type="email" v-model:model-value="emailText" />
      </div>
    </form>
    <CarouselImage :images="slideImages" class="avatar-carousel" />
    <CustomButtonGray
      id="avatar-button"
      label="Select avatar"
      class="avatar-button"
    />
    <CustomButton
      id="save-changes"
      class="save-changes-button"
      @click="saveChanges"
    >
      Save changes
    </CustomButton>
  </div>
</template>

<style scoped>
.my-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5vh;

  margin-top: 15vh;
  width: 100vw;
}

.error-message-visible {
  opacity: 1;
}

h1 {
  font-size: 30px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1vh;
}

.form-input {
  width: 20vw;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.password {
  display: flex;
  gap: 10px;
}

a {
  color: black;
}

img {
  height: 10px;
}

.avatar-button,
.save-changes-button {
  width: auto;
}
</style>