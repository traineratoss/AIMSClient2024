<script setup>

</script>

<template>
    <div id="company-logo">
        <img src="" alt="company logo">
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
            <button 
                id="request-password"
            >
                Request new Password
            </button>
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

    button {
        padding: 5px;
        padding-right: 30px;
        padding-left: 30px;
        cursor: pointer;
    }

    #request-password {
        border-width: 3px;
        background-color: var(--selected-color);
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

    #user-icon {
        font-size: 70px;
    }
</style>
