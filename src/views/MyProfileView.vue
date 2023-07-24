<script setup>
import CustomButtonGray from "../components/CustomButtonGray.vue";
import CustomButton from "../components/CustomButton.vue";
import CustomInput from '../components/CustomInput.vue';
import { ref } from 'vue';

const usernameText = ref('');
const fullNameText = ref('');
const emailText = ref('');

function saveChanges() {
  console.log('username', usernameText.value);
  console.log('full name', fullNameText.value);
  console.log('email', emailText.value);
}
</script>

<template>
  <div class="my-profile">
    <h1>My profile</h1>
    <form action="">
      <div class="form-input">
        <label for="username"> Username </label>
        <CustomInput 
          type="text" 
          v-model:model-value="usernameText"
        />
      </div>

      <div class="form-input">
        <label for="full-name"> Full name </label>
        <CustomInput 
          type="text" 
          v-model:model-value="fullNameText"
        />
      </div>

      <div class="form-input">
        <label for="email"> E-mail </label>
        <CustomInput 
          type="email" 
          v-model:model-value="emailText"
        />
      </div>
    </form>
    <img src="../assets/img/avatars/avatar1.svg" />
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

  margin-top: 20vh;
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
  width: 15vw;

  display: flex;
  justify-content: space-between;
}

.password {
  display: flex;
  gap: 10px;
}

img {
  height: 100px;
}

a {
  color: black;
}
</style>