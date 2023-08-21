<script setup>
import CustomButtonGray from "../components/CustomButtonGray.vue";
import CustomButton from "../components/CustomButton.vue";
import CustomInput from "../components/CustomInput.vue";
import CarouselImage from "../components/CarouselImage.vue";
import { ref, onMounted } from "vue";
import InvalidInputMessage from "../components/InvalidInputMessage.vue";
import {
  getCurrentUsername,
  updateUser,
  getCurrentEmail,
  getCurrentFullName,
  getCurrentAvatarId,
  validateUsername,
} from "../services/user_service";
import router from "../router";

const usernameText = ref("");
const fullNameText = ref("");
const emailText = ref("");
const avatarIdText = ref("");
const showErrorMessage = ref(false);
const errorMessage = ref("");
const index = parseInt(localStorage.getItem("avatarId"));
const carouselImageIndex = ref(index);

const slideImages = [
  "src/assets/img/avatars/avatar1.svg",
  "src/assets/img/avatars/avatar2.svg",
  "src/assets/img/avatars/avatar3.svg",
  "src/assets/img/avatars/avatar4.svg",
  "src/assets/img/avatars/avatar5.svg",
  "src/assets/img/avatars/avatar6.svg",
  "src/assets/img/avatars/avatar7.svg",
];

function onImageChange(index) {
  carouselImageIndex.value = index;
}

onMounted(() => {
  usernameText.value = getCurrentUsername();
  fullNameText.value = getCurrentFullName();
  emailText.value = getCurrentEmail();
  avatarIdText.value = getCurrentAvatarId();
});

// function validateUsername(username) {
//   /*
//     Usernames can only have:
//     - Lowercase Letters (a-z)
//     - Numbers (0-9)
//     - Dots (.)
//     - Underscores (_)
//   */
//   const res = /^[a-z0-9_\.]+$/.exec(username);
//   const valid = !!res;
//   if( valid) {
//     return true;
//   }
//   message.value = "Invalid username";
//   showErrorMessage.value = true;
//   return false;
// }

function saveChanges() {
  let changesOK = true;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  let oldUsername = getCurrentUsername(); //this needs to be loaded from cookies
  let oldEmail = getCurrentEmail(); //this needs to be loaded from cookies
  let oldAvatarId = getCurrentAvatarId(); //this needs to be loaded from cookies
  let oldFullname = getCurrentFullName(); //this needs to be loaded from cookies

  if (!emailRegex.test(emailText.value)) {
    errorMessage.value = "Invalid email format";
    showErrorMessage.value = true;
    changesOK = false;
  }

  if (changesOK) {
    let userUpdateDTO = {};

    userUpdateDTO.avatarId = carouselImageIndex.value;
    localStorage.setItem("avatarId", userUpdateDTO.avatarId);

    if (usernameText.value !== oldUsername && usernameText.value !== "") {
      if (validateUsername(usernameText.value)) {
        userUpdateDTO.username = usernameText.value;
        localStorage.setItem("username", userUpdateDTO.username);
      } else {
        errorMessage.value = "Invalid username format!";
        showErrorMessage.value = true;
        changesOK = false;
      }
    }
    if (emailText.value !== oldEmail && emailText.value !== "") {
      userUpdateDTO.email = emailText.value;
      localStorage.setItem("email", userUpdateDTO.email);
    }
    if (oldFullname === "") {
      userUpdateDTO.fullName = fullNameText.value;
      localStorage.setItem("fullName", userUpdateDTO.fullName);
    } else if (
      fullNameText.value !== oldFullname &&
      fullNameText.value !== ""
    ) {
      userUpdateDTO.fullName = fullNameText.value;
      localStorage.setItem("fullName", userUpdateDTO.fullName);
    } else if (fullNameText.value === "") {
      changesOK = false;
      errorMessage.value = "Fullname must not be empty";
      showErrorMessage.value = true;
    }

    if (changesOK) {
      updateUser(oldUsername, userUpdateDTO)
        .then((res) => {
          router.push("/my");
        })
        .catch((error) => {
          errorMessage.value = error.message;
          if (error.message == "Username already exists!") {
            localStorage.setItem("username", oldUsername);
          }
          if (error.message == "Email already exists!") {
            localStorage.setItem("email", oldEmail);
          }
          showErrorMessage.value = true;
        });
    }
  }
}
</script>

<template>
  <div class="wrapper">
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
      <CarouselImage
        :images="slideImages"
        class="avatar-carousel"
        @current-index="onImageChange"
        :imageHeightPercentage="80"
      />
      <div class="button-container">
        <button @click="router.push('/my')" class="cancel-button">
          Cancel
        </button>
        <CustomButton
          id="save-changes"
          class="save-changes-button"
          @click="saveChanges"
        >
          Save changes
        </CustomButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;
  background-color: #e9e9e9;
  padding: 20px;
  border-radius: 10px;
}

.cancel-button {
  background-color: transparent;
  border: none;
  text-decoration: underline;
}

.cancel-button:hover {
  cursor: pointer;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(94vh - 1px);
}

.button-container {
  display: flex;
  gap: 1vh;
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
.avatar-carousel {
  height: 15vw;
  max-width: 23vw;
  object-fit: scale-down;
  margin-top: 50px;
}
</style>