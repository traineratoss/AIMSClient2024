<script setup>
import CostumButton from '../components/CustomButton.vue';
import UserIcon from '../components/UserIcon.vue';

</script>

<template>
    <div id="company-logo">
        <img src="../assets/img/company.png" alt="company logo">
    </div>
    <div class="container">
        <h1 id="title">
            <div class="big-text" id="name">
                AIMS
            </div>
            <div class="big-text">
                Password Recovery
            </div>
        </h1>
        <div id="profile-img">
            <UserIcon />
        </div>
        <div>
            <input 
                type="text" 
                id="username-email-input" 
                placeholder="Username/E-mail"
            >
        </div>
        <div>
            <CostumButton
                id="request-password"
            >
                Request new Password
            </CostumButton>
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

    #company-logo {
        position: relative;
        top: 20px;
        left: 5vw;
    }
</style>
