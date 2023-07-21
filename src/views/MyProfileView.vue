<script setup>
import CustomButtonGray from "../components/CustomButtonGray.vue";
import CustomButton from "../components/CustomButton.vue";
</script>

<template>
  <div class="my-profile">
    <h1>My profile</h1>
    <form action="">
      <div class="form-input">
        <label for="username"> Username </label>
        <input type="text" />
      </div>

      <div class="form-input">
        <label for="full-name"> Full name </label>
        <input type="text" />
      </div>

      <div class="form-input">
        <label for="email"> E-mail </label>
        <input type="email" />
      </div>
    </form>
    <img src="../assets/img/avatars/avatar1.svg" />
    <CustomButtonGray
      id="avatar-button"
      label="Select avatar"
      class="avatar-button"
    />
    <CustomButton id="save-changes" class="save-changes-button"
      >Save changes
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