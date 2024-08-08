

<script setup>
import CustomNavBar from "./components/CustomNavBar.vue";
import { ref, onMounted, computed } from "vue";
import { getCurrentRole, getCurrentUsername, isFirstLogin, logout } from "./services/user_service";
import { useRoute } from "vue-router";

const showNavbar = computed(() => {
  const currentRoute = useRoute();
  let value = true;
  if (
    currentRoute.name === "login" ||
    currentRoute.name === "register" ||
    currentRoute.name === "change" ||
    currentRoute.name === "recovery" ||
    currentRoute.name === "registration-complete" ||
    currentRoute.name === "page-not-found" ||
    currentRoute.name === 'password-changed' ||
    currentRoute.name === 'default' ||
    (!(getCurrentRole() && getCurrentUsername()))
  ) {
    value = false;
  }

  return value;
})

onMounted(() => {
  sessionStorage.setItem('current page index', 2);
});


</script>

<template>
  <Suspense>

    <div class="app-container">
      <CustomNavBar v-show="showNavbar" />
      <router-view />
    </div>
  </Suspense>
 
</template>

<style scoped>

</style>
