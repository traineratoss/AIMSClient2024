<script setup>
import CustomButtonGray from "../components/CustomButtonGray.vue";
import CustomButton from "../components/CustomButton.vue";
import CustomInput from "../components/CustomInput.vue";
import CarouselImage from "../components/CarouselImage.vue";
import { ref, onMounted, computed } from "vue";
import InvalidInputMessage from "../components/InvalidInputMessage.vue";
import CustomLoader from "../components/CustomLoader.vue";

import {
  getCurrentUsername,
  updateUser,
  getCurrentEmail,
  getCurrentFullName,
  getCurrentAvatarId,
  getCustomAvatar,
  validateUsername,
} from "../services/user_service";
import router from "../router";

const usernameText = ref("");
const fullNameText = ref("");
const emailText = ref("");
const avatarIdText = ref("");
const showErrorMessage = ref(false);
const errorMessage = ref("");
const index = parseInt(sessionStorage.getItem("avatarId"));
const carouselImageIndex = ref(parseInt(sessionStorage.getItem("avatarId")));
const uploadedImage = ref();
const avatarsLoaded = ref(false)
const customAvatar = ref({});
const originalCustomAvatar = ref({});

const slideImages = ref([
  "src/assets/img/avatars/avatar1.svg",
  "src/assets/img/avatars/avatar2.svg",
  "src/assets/img/avatars/avatar3.svg",
  "src/assets/img/avatars/avatar4.svg",
  "src/assets/img/avatars/avatar5.svg",
  "src/assets/img/avatars/avatar6.svg",
  "src/assets/img/avatars/avatar7.svg",
]);

function onImageChange(index) {
  carouselImageIndex.value = index;
}

onMounted(async () => {
  usernameText.value = getCurrentUsername();
  fullNameText.value = getCurrentFullName();
  emailText.value = getCurrentEmail();
  avatarIdText.value = getCurrentAvatarId();

  customAvatar.value = await getCustomAvatar(getCurrentUsername());
  originalCustomAvatar.value = customAvatar.value;

  avatarsLoaded.value = true
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
    sessionStorage.setItem("avatarId", userUpdateDTO.avatarId);

    if (usernameText.value !== oldUsername && usernameText.value !== "") {
      if (validateUsername(usernameText.value)) {
        userUpdateDTO.username = usernameText.value;
        sessionStorage.setItem("username", userUpdateDTO.username);
      } else {
        errorMessage.value = "Invalid username format!";
        showErrorMessage.value = true;
        changesOK = false;
      }
    }
    if (emailText.value !== oldEmail && emailText.value !== "") {
      userUpdateDTO.email = emailText.value;
      sessionStorage.setItem("email", userUpdateDTO.email);
    }
    if (oldFullname === "") {
      userUpdateDTO.fullName = fullNameText.value;
      sessionStorage.setItem("fullName", userUpdateDTO.fullName);
    } else if (
      fullNameText.value !== oldFullname &&
      fullNameText.value !== ""
    ) {
      userUpdateDTO.fullName = fullNameText.value;
      sessionStorage.setItem("fullName", userUpdateDTO.fullName);
    } else if (fullNameText.value === "") {
      changesOK = false;
      errorMessage.value = "Fullname must not be empty";
      showErrorMessage.value = true;
    }

    userUpdateDTO.imageDTO = customAvatar.value;

    userUpdateDTO.updatedImage = JSON.stringify(originalCustomAvatar.value) !== JSON.stringify(customAvatar.value);

    if (changesOK) {
      updateUser(oldUsername, userUpdateDTO)
        .then((res) => {
          router.go("/my");
        })
        .catch((error) => {
          errorMessage.value = error.message;
          if (error.message == "Username already exists!") {
            sessionStorage.setItem("username", oldUsername);
          }
          if (error.message == "Email already exists!") {
            sessionStorage.setItem("email", oldEmail);
          }
          showErrorMessage.value = true;
        });
    }
  }
}

console.log(index)

const getImageSource = computed(() => customAvatar.value ? `data:image/${customAvatar.value.fileType};name=${customAvatar.value.fileName};base64,${customAvatar.value.image}` : undefined)


async function processImage(event) {

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  const file = event.target.files[0];
  if (!file) return;

  const fileName = file.name;
  const fileType = file.type;

  const arrayBuffer = await file.arrayBuffer();
  const byteArray = new Uint8Array(arrayBuffer);

  const base64String = arrayBufferToBase64(byteArray);

  const dto = {
    image: base64String,
    fileName: fileName,
    fileType: fileType
  };

  customAvatar.value = dto;
}

function removeCustomAvatar() {
  customAvatar.value = null;
  uploadedImage.value.value = null;
}

async function getInitialIndex() {
  return index;
}

</script>

<template>
  <div class="wrapper" v-if="avatarsLoaded">
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
      <div class="container">
        <div>
          <label
          for="upload"
          class="add-image-button"
          style="display: flex; align-items: center"
          >
          <input
          type="file"
          id="upload"
          hidden
          accept=".jpg, .jpeg, .png"
          ref="uploadedImage"
          @change="processImage($event)"

          />
            Upload Image
            <span class="material-symbols-outlined" style="margin-left: 5px">
              attach_file
            </span>
          </label>
        </div>
        <CustomButton
          class="remove-image-button"
          @click="removeCustomAvatar">
          Remove avatar
        </CustomButton>
      </div>
      <img  v-if="customAvatar" class="custom-avatar"  :src="getImageSource">
      <CarouselImage
        v-else
        :images="slideImages"
        class="avatar-carousel"
        @current-index="onImageChange"
        :imageHeightPercentage="80"
        :initialCurrentIndexNumber="index"
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
  <div
    v-else
    class="loading-placeholder"
  >
    <CustomLoader :size="100" />
  </div>
</template>

<style scoped>
.custom-avatar {
  width: 350px;
  height: 350px;
  border-radius: 50%;
}

.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  gap: 40px;
  margin-top: 30px;
}

.my-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;
  background-color: #e9e9e9;
  padding: 20px;
  border-radius: 10px;
}

.add-image-button {
  background-color: gray;
  color: white;
  padding: 0.5rem;
  font-family: sans-serif;
  cursor: pointer;
  margin-top: 5px;
  border-radius: 6px;
  padding: 7px;
}
.add-image-button:hover {
  background-color: rgba(128, 128, 128, 0.753);
}

.remove-image-button {
  background-color: gray;
  color: white;
  padding: 0.5rem;
  font-family: sans-serif;
  cursor: pointer;
  margin-top: 5px;
  border-radius: 6px;
  font-size: 14px;
  padding: 18px;
}
.remove-image-button:hover {
  background-color: rgba(128, 128, 128, 0.753);
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
}

.loading-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 94vh;
}
</style>