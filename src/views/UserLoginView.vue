<script setup>
import router from '../router';

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
            <i 
                class="fa-regular fa-circle-user"
                id="user-icon"
            >
            </i>
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
            <button 
                id="sign-in"
            >
                Sign in
            </button>
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

    #sign-in {
        border-width: 3px;
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

    #user-icon {
        font-size: 70px;
    }
</style>
