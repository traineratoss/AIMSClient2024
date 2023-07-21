<script setup>
import router from '../router';
import CustomButton from '../components/CustomButton.vue';
import UserIcon from '../components/UserIcon.vue';

function redirectToRegister() {
    router.push('/register');
}
</script>

<template>
    <div id="company-logo">
        <img src="../assets/img/company.png" alt="company logo">
    </div>
    <div class="container">
        <h1 id="header">
            <span id="name">
                AIMS
            </span>
            Log in
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
            <input 
                type="password" 
                id="password-input" 
                placeholder="Password"
            >
        </div>
        <div>
            <CustomButton
                id="sign-in"
            >
                Sign in
            </CustomButton>
        </div>
        <div 
            id="forgot-password"
        >
            <router-link to="/recovery">  
                Forgot password?
            </router-link>
        </div>
        <button 
            id="register"
            @click="redirectToRegister"
        >
            Register
        </button>
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

    button {
        padding: 5px;
        padding-right: 30px;
        padding-left: 30px;
        cursor: pointer;
    }

    #register {
        border: none;
        position: relative;
        bottom: -10vh;
    }

    #name {
        color: var(--selected-color);
    }

    #sign-in {
        background-color: var(--selected-color);
    }

    #forgot-password {
        text-decoration: underline;
    }

    #forgot-password:hover {
        cursor: pointer;
    }

    h1, h1 span {
        font-size: 30px;
    }

    #company-logo {
        position: relative;
        top: 20px;
        left: 5vw;
    }
</style>
