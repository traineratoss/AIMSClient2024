<script setup>
import FormTitle from "../components/FormTitle.vue";
import CompanyLogo from "../components/CompanyLogo.vue";
import CustomButton from "../components/CustomButton.vue";
import UserIcon from "../components/UserIcon.vue";
</script>

<template>
  <CompanyLogo />
  <div class="container">
    <FormTitle label="Password Recovery" />
    <div id="profile-img">
      <UserIcon />
    </div>
    <div>
      <input
        type="text"
        id="username-email-input"
        placeholder="Username/E-mail"
      />
    </div>
    <div>
      <CustomButton id="request-password"> Request new Password </CustomButton>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  position: relative;
  top: 80px;
}

img {
  padding: 10px;
  width: 150px;
}

input {
  padding: 5px;
  border: none;
}

#request-password {
  width: auto;
  height: auto;
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
</style>
