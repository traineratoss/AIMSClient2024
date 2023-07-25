<script setup>
import CompanyLogo from "../components/CompanyLogo.vue";
import CustomInput from "../components/CustomInput.vue";
import CustomButton from "../components/CustomButton.vue";
import router from "../router";
import { computed, ref } from "vue";

const indexOfActivePage = ref(1);

function redirectToAllIdeas() {
    indexOfActivePage.value = 1;
    router.push('/all');
}

function redirectToMyIdeas() {
    indexOfActivePage.value = 2;
    router.push('/my');
}

function redirectToDashboard() {
    indexOfActivePage.value = 3;
    router.push('/admin-dashboard');
}

function redirectToCreateIdea() {
    indexOfActivePage.value = 4;
    router.push('/create-idea');
}

function redirectToMyProfile() {
    router.push('/my-profile');
}

function isPageWithIndexActive(index) {
  return indexOfActivePage.value == index ? true : false;
}

</script>


<template>
    <nav id="navbar">
        <CompanyLogo
        />
        <div class="options">
            <div class="buttons">
                <CustomButton 
                    class = "nav-button" 
                    id="all-ideas"
                    @click="redirectToAllIdeas"
                    :is-active=isPageWithIndexActive(1)
                >
                    All ideas
                </CustomButton>
                <CustomButton 
                    class = "nav-button" 
                    id="my-ideas"
                    @click="redirectToMyIdeas"
                    :is-active=isPageWithIndexActive(2)
                >
                    My ideas
                </CustomButton>
                <div class="dashboard-dropdown">
                    <CustomButton 
                        class = "nav-button" 
                        id = "dashboard"
                        @click="redirectToDashboard"
                        :is-active=isPageWithIndexActive(3)
                        >
                        Dashboard <i class="fa-solid fa-caret-down fa-xl"></i>
                        
                    </CustomButton>
                    <div class="dropdown-content">
                    </div>
                </div>
            </div>
            <div>
                <CustomButton 
                    class = "nav-button" 
                    id="create-idea"
                    @click="redirectToCreateIdea"
                    :is-active=isPageWithIndexActive(4)
                >
                    Create an Idea
                </CustomButton>
            </div>
            <div>
                <CustomInput id ="search-an-idea" placeholder="&#xF002; Search an Idea (Title)" style="font-family: Segoe UI, FontAwesome"/>
            </div>
        </div>
        <div class="user">
            <div class="user-details">
                <h3 style="font-size: 16px; font-weight: 550;">Username</h3>
                <router-link to="/my-profile" style="text-decoration: none; color: black">User details</router-link>
            </div>
            <CustomButton 
                class = "nav-button" 
                id="user-details-button"
                @click="redirectToMyProfile"
            >
                <i class="fa-solid fa-user fa-2xl"></i>
                <i class="fa-solid fa-chevron-down fa-xl"></i>
            </CustomButton>
        </div>
    </nav>    
</template>


<style scoped>
nav {
    background-color: white;
    display: flex;
    gap: 30px;
    width: 100vw;
    align-items: center;

}

.buttons {
    display: flex;
    justify-content: space-between;
    width: 15vw;
}

.options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80vw;
}

.nav-button {
    font-weight: bold;
    background-color: transparent;
    width: auto;
    height: auto;
}

.nav-button:hover {
    background-color: var(--selected-color);
}

#dashboard {
    border: none;
}

#user-details-button {
    border: none;
}

.user {
    display: flex;   
    gap: 20px;
}

.user-details {
    display: flex;
    flex-direction: column;
}

#search-an-idea {
    padding: 2.5px;
}

</style>