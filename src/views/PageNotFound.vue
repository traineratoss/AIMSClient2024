<script setup>
import router from "../router";

function redirectToLogin() {
  router.push("/login");
}
</script>

<template>
  <img id="aims" src="../assets/img/AIMS.svg" @click="redirectToLogin" />
  <div class="notFound">
    <img src="../assets/img/404_Error_Page_not_Found.svg" id="not-found" />
  </div>
</template>

<style scoped>
.notFound {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#not-found {
  height: 90vh;
}

#aims:hover {
  cursor: pointer;
}

#aims {
  position: absolute;
  top: 5vh;
  left: 5vw;
}
</style>