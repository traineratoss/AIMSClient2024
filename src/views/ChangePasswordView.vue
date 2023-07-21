<script setup>
import CompanyLogo from "../components/CompanyLogo.vue";
</script>

<template>
  <CompanyLogo />
  <div class="container">
    <h1 id="title">
      <div class="big-text" id="name">AIMS</div>
      <div class="big-text">Change Password</div>
    </h1>
    <div id="profile-img">
      <i class="fa-regular fa-circle-user" id="user-icon"> </i>
    </div>
    <div>
      <input
        type="password"
        id="current-password-input"
        placeholder="Current password"
      />
    </div>
    <div>
      <input
        type="password"
        id="current-password-input"
        placeholder="New password"
      />
    </div>
    <div>
      <input
        type="password"
        id="current-password-input"
        placeholder="Confirm new password"
      />
    </div>
    <div id="controls-container">
      <router-link to="/recovery" id="cancel"> Cancel </router-link>
      <button id="submit">Submit</button>
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

#cancel {
  display: flex;
  align-items: center;
}

input {
  padding: 5px;
  border: none;
}

#controls-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

button {
  padding: 5px;
  padding-right: 30px;
  padding-left: 30px;
  cursor: pointer;
}

#submit {
  border-width: 3px;
  background-color: var(--selected-color);
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

#company-logo {
  position: relative;
  top: 20px;
  left: 5vw;
}

#user-icon {
  font-size: 70px;
}
</style>
