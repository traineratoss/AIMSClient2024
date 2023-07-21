<script setup>
import UserIcon from '../components/UserIcon.vue';
import CustomButton from '../components/CustomButton.vue';

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
                Change Password
            </div>
        </h1>
        <div id="profile-img">
            <UserIcon />
        </div>
        <div>
            <input 
                type="password" 
                id="current-password-input" 
                placeholder="Current password"
            >
        </div>
        <div>
            <input 
                type="password" 
                id="current-password-input" 
                placeholder="New password"
            >
        </div>
        <div>
            <input 
                type="password" 
                id="current-password-input" 
                placeholder="Confirm new password"
            >
        </div>
        <div id="controls-container">
            <router-link 
                to="/my-profile"
                id="cancel"
            >  
                Cancel
            </router-link>
            <CustomButton
                id="submit"
            >
                Submit
            </CustomButton>
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

    #cancel {
        display: flex;
        align-items: center;
    }

    input {
        padding: 5px;
        border: none;
    }

    #controls-container {
        display: flex;
        justify-content: space-between;
        gap: 20px;
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
