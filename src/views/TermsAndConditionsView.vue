<script setup>
import router from '../router';
import sampleText from '../assets/termsAndConditions/termsAndConditions.js';

function goToRegistration() {
    router.push('/register');
}
const fileContent = sampleText;
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
            <div id="text-container" v-html="fileContent">
                
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
        color:black;
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