

<script setup>
import CustomNavBar from "./components/CustomNavBar.vue";
import { ref, onMounted } from "vue";
import router from "./router";
import { getCurrentRole, getCurrentUsername, logout } from "./services/user_service";

const showNavbar = ref(true);

onMounted(() => {
  localStorage.setItem('current page index', 2);
});

router.afterEach((to, from) => {
  if (
    to.name === "login" ||
    to.name === "register" ||
    to.name === "change" ||
    to.name === "recovery" ||
    to.name === "registration-complete" ||
    to.name === "page-not-found" ||
    to.name === 'password-changed' ||
    to.name === 'default'
  ) {
    showNavbar.value = false;
  } else {
    showNavbar.value = true;
  }

  if(!(getCurrentRole() && getCurrentUsername())) {
    showNavbar.value = false;
  }
});

router.beforeEach((to, from) => {
  if(to.name === 'default') {
    if(getCurrentRole() && getCurrentUsername()) {
      router.push('/my');
    }
  }

  if(to.name === 'admin-dashboard' && getCurrentRole() !== 'ADMIN') {
    router.push('/page-not-found');
    showNavbar.value = false;
    logout();
  }

  if(to.name !== 'login' && 
    to.name !== 'register' && 
    to.name !== 'recovery' &&
    to.name !== 'registration-complete' &&
    to.name !== 'page-not-found' &&
    to.name !== 'password-changed' &&
    to.name !== 'default') {
      if(!(getCurrentRole() && getCurrentUsername())) {
        showNavbar.value = false;
        router.push('/page-not-found');
      }
    }
});
</script>

<template>
  <div class="app-container">
    <!-- <TestNavbar /> -->
    <CustomNavBar v-show="showNavbar" />
    <router-view />
  </div>
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
