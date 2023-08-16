

<script setup>
import CustomNavBar from "./components/CustomNavBar.vue";
import { ref, onMounted, computed } from "vue";
import router from "./router";
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
  localStorage.setItem('current page index', 2);
});


</script>

<template>
  <Suspense>

    <div class="app-container">
      <!-- <TestNavbar /> -->
      <CustomNavBar v-show="showNavbar" />
      <router-view />
    </div>
  </Suspense>
  <!-- <div id="app">

    <Header >
      <template v-slot:logo>
        <h1 class="brand">M<span class="uer">uer</span></h1>

      </template>

      
      <template v-slot:navbar>
        <navbar :showBars="showBars" class="nav">
          <nav-link @hide-dropdown="hideDropDown" class="link" url="/">Home</nav-link>
          <nav-link @hide-dropdown="hideDropDown" class="link" url="/about">Services</nav-link>
          <nav-link @hide-dropdown="hideDropDown" class="link" url="/">Products</nav-link>
        </navbar>

        <i @click="toggleBars" 
        class="fas bars"
        :class="{'fa-times':showBars, 'fa-bars':!showBars}"></i>

        
      </template>

      

    </Header>

    <router-view/>
  </div> -->
</template>

<style scoped>
/* .app-container {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
} */
</style>
