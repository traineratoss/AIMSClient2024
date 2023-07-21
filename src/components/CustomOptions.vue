<script setup>
import CustomButton from "../components/CustomButton.vue";
</script>

<template>
  <div class="options-container">
    <CustomButton id="my-profile" label="My profile" class="options">
      <i class="fa-solid fa-user"></i> My profile
    </CustomButton>

    <CustomButton
      id="change-password"
      label="Change password"
      class="options"
      selected="false"
      @click="$router.push({ path: '/change' })"
      ><i class="fa-solid fa-gear"></i> Change password
    </CustomButton>

    <CustomButton
      id="log-out"
      label="Log out"
      class="options"
      selected="false"
      @click="$router.push({ path: '/login' })"
    >
      <i class="fa-solid fa-right-from-bracket"></i> Log out
    </CustomButton>
  </div>
</template>

<style scoped>
.options-container {
  margin-top: 2vh;

  width: 98vw;

  display: flex;
  gap: 5px;
  align-items: flex-end;
  flex-direction: column;
}

.options {
  width: 9vw;

  display: flex;
  justify-content: space-between;
}

#change-password,
#log-out {
  background-color: white;
}
</style>