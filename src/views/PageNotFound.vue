<script setup>
import router from '../router';

function redirectToLogin() {
    router.push('/login');
}

</script>

<template>
    <img 
        id="aims"
        src="../assets/img/AIMS.svg"
        @click="redirectToLogin"
    >
    <div class="notFound">
        <img src="../assets/img/404_Error_Page_not_Found.svg"/>
    </div>

</template>

<style scoped>
    .notFound{
        width: 50%;
        height: 50%;
        margin-left: 40vh;
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