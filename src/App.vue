<!-- <script setup>
import TestNavbar from './components/TestNavbar.vue'

</script>

<template>
  <TestNavbar/>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style> -->

<script setup>
import TestNavbar from "./components/TestNavbar.vue";
import CustomNavBar from "./components/CustomNavBar.vue";
import { ref } from "vue";
import router from "./router";
import { getCurrentRole, getCurrentUsername, logout } from "./services/user_service";

const showNavbar = ref(true);

router.afterEach((to, from) => {
  if (
    to.name === "login" ||
    to.name === "register" ||
    to.name === "terms" ||
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
    to.name !== 'terms' && 
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
