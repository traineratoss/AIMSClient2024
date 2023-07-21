<script setup>
import router from '../router';

function goToRegistration() {
    router.push('/register');
}
</script>

<template>
    <div>
        <div 
            id="container"
            class="text-color"
        >
            <h1 id="title">
                Terms & Conditions
            </h1>
            <div id="text-container">
                <p class="text-color">
                    Welcome to AIMS!
                </p>
                <p>These terms and conditions outline the rules of ATOSS Software's Website, 
                    located at https://www.atoss.com/en</p>
                <p>By accesing the website we asumme you accept these terms and conditions. 
                    Do not continue to use AIMS if you do not agree to take all the terms and 
                    conditions stated on this page.
                </p>
                <br>
                <p>Other ideas regarding terms & conditions</p>
                <br>
                <p class="text-color">
                    Cookies
                </p>
                <p>We employ the use of cookies. By accesing AIMS, you agree to use cookies in 
                    agreement with ATOSS Software's Privacy Policy.</p>
                <br>
                <p class="text-color">
                    License
                </p>
                <p>Unless otherwise stated, ATOSS Software and/or it's licensors own the intellectual 
                    property rights for all material on AIMS. All intellectual property rights 
                    reserved.</p>
                <p>You may acces this from AIMS for your personal use subject to restrsictions set 
                    in these terms and conditions</p>
            </div>
        </div>
        <button
            @click="goToRegistration"
        >
            I,ve read and accepted the Terms & Conditions
        </button>
    </div>
</template>

<style scoped>
    #title {
        font-size: 30px;
    }

    p {
        color: black;
    }

    .text-color {
        color: var(--selected-color);
    }

    #text-container {
        width: 70%;
        height: 30vh;
        overflow: auto;
        border: 1px solid black;
        padding: 10px;
        background-color: white;
    }

    #container {
        position: relative;
        top: 20px;
        display: flex;
        flex-direction: column;
        justify-items: center;
        align-items: center;
        gap: 100px;
    }

    button {
        background-color: var(--selected-color);
        border-width: 0.5px;
        padding: 5px;
        cursor: pointer;
        position: absolute;
        right: 13%;
        bottom: 10vh;
    }
</style>