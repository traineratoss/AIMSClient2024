<script setup>
import CompleteMessage from "../components/CompleteMessage.vue";
</script>

<template>
  <CompleteMessage
    @keydown.enter="$router.push({ path: '/login' })"
    tabindex="0"
    title="REGISTRATION COMPLETE"
    subtitle="Thank you for registering on AIMS. You are almost done."
    message="Please note that an administrator will also need to approve your registration for you to use all available functionalities in AIMS"
  />
</template>

<style scoped>
</style>