<script setup>
import CompanyLogo from "../components/CompanyLogo.vue";
import CustomInput from "../components/CustomInput.vue";
import CustomButton from "../components/CustomButton.vue";
import router from "../router";
import CustomNavigationDropDown from "../components/CustomNavigationDropDown.vue";
import { ref, onMounted } from "vue";
import { getCurrentRole, getCurrentUsername } from "../services/user_service";

const indexOfActivePage = ref(1);
const disabledDashboard = ref(true);
const disabledUser = ref(true);

function redirectToAllIdeas() {
  indexOfActivePage.value = 1;
  router.push("/all");
}

function redirectToMyIdeas() {
  indexOfActivePage.value = 2;
  router.push("/my");
}

function redirectToDashboard() {
  indexOfActivePage.value = 3;
  router.push("/admin-dashboard");
}

function redirectToCreateIdea() {
  indexOfActivePage.value = 4;
  router.push("/create-idea");
}

function redirectToMyProfile() {
  router.push("/my-profile");
}

function isPageWithIndexActive(index) {
  return indexOfActivePage.value == index ? true : false;
}

function onMouseEnterDashboard() {
  disabledDashboard.value = false;
}

function onMouseLeaveDashboard() {
  disabledDashboard.value = true;
}

function onMouseEnterUser() {
  disabledUser.value = false;
}

function onMouseLeaveUser() {
  disabledUser.value = true;
}

function dropDownClicked(elementId) {
  if (elementId === "my-ideas") {
    indexOfActivePage.value = 2;
  } else if (elementId === "stats") {
    indexOfActivePage.value = 1;
  } else {
    indexOfActivePage.value = 0;
  }
}

const dashboardElements = [
  {
    id: "all-users",
    name: "All users",
    route: "/admin-dashboard",
    icon: "group",
  },
  {
    id: "stats",
    name: "Statistics",
    route: "/all",
    icon: "bar_chart",
  },
];

let userDashboardElements = [];

router.beforeEach(() => {
  userDashboardElements = [];

  userDashboardElements.push({
    id: "profile",
    name: "Profile",
    route: "/my-profile",
    icon: "person",
  });

  userDashboardElements.push({
    id: "change-password",
    name: "Change Password",
    route: "/change",
    icon: "settings",
  });

  userDashboardElements.push({
    id: "my-ideas",
    name: "My ideas",
    route: "/my",
    icon: "lightbulb",
  });

  if(getCurrentRole() === 'ADMIN') {
    userDashboardElements.push({
      id: "dashboard",
      name: "Dashboard",
      route: "/admin-dashboard",
      icon: "dashboard",
    });
  }
  
  userDashboardElements.push({
    id: "logout",
    name: "Log out",
    route: "/login",
    icon: "logout",
  });
});

const searchAnIdeaByTitle = () => {
  console.log("d")
}

const handleSelected = () => {
  console.log("d")
}
</script>


<template>
  <nav id="navbar">
    <!-- <CompanyLogo
        /> -->
    <img src="../assets/img/AIMS.svg" class="aims-logo" />
    <div class="options">
      <div class="buttons">
        <CustomButton
          class="nav-button"
          id="all-ideas"
          @click="redirectToAllIdeas"
          :is-active="isPageWithIndexActive(1)"
        >
          All ideas
        </CustomButton>
        <CustomButton
          class="nav-button"
          id="my-ideas"
          @click="redirectToMyIdeas"
          :is-active="isPageWithIndexActive(2)"
        >
          My ideas
        </CustomButton>
        <div class="dashboard-dropdown">
          <CustomButton
            class="nav-button"
            id="dashboard"
            :is-active="isPageWithIndexActive(3)"
            @mouseenter="onMouseEnterDashboard"
            @mouseleave="onMouseLeaveDashboard"
            :style="{ display: !(getCurrentRole() === 'ADMIN') ? 'none' : '' }"
          >
            Dashboard
            <span class="material-symbols-outlined">
              arrow_drop_down
            </span>
            <div class="invisible-hover"></div>
          </CustomButton>
          <div class="dropdown-content">
            <CustomNavigationDropDown
              :element="dashboardElements"
              :disabled="disabledDashboard"
              @clicked-drop-down="dropDownClicked"
            />
          </div>
        </div>
      </div>
      <div>
        <CustomButton
          class="nav-button"
          id="create-idea"
          @click="redirectToCreateIdea"
          :is-active="isPageWithIndexActive(4)"
        >
          Create an Idea
        </CustomButton>
      </div>
      <div>
        <CustomInput
          id="search-an-idea"
          placeholder="&#xF002; Search an Idea (Title)"
          style="font-family: Segoe UI, FontAwesome"
          :type="'text'"
        />
      </div>
    </div>
    <div class="user">
      <div class="user-details">
        <h3 
          style="font-size: 16px; 
          font-weight: 550; 
          height: 1vh"
        >
          {{ getCurrentUsername() }}
        </h3>
        <router-link
          to="/my-profile"
          style="text-decoration: none; color: black"
        >
          User details
        </router-link>
      </div>
      <CustomButton
        class="nav-button"
        id="user-details-button"
        @mouseenter="onMouseEnterUser"
        @mouseleave="onMouseLeaveUser"
      >
        <span class="material-symbols-outlined">
          person
        </span>
        <span class="material-symbols-outlined">
          keyboard_arrow_down
        </span>
        <div class="dropdown-content-user">
          <CustomNavigationDropDown
            :element="userDashboardElements"
            :disabled="disabledUser"
            @clicked-drop-down="dropDownClicked"
          />
        </div>
      </CustomButton>
    </div>
  </nav>
</template>


<style scoped>
.dashboard-hovered {
  background-color: var(--selected-color);
}

nav {
  background-color: white;
  display: flex;
  gap: 1vw;
  width: 100vw;
  align-items: center;
  height: 9vh;
}

.material-symbols-outlined {
  font-size: 2vw;
}

.disabled {
  display: none;
}

.buttons {
  display: flex;
  justify-content: space-between;
  align-content: center;
  width: 15vw;
  align-items: center;
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
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

#user-details-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  margin-right: 1vw;
  height: 3.5vh;
}

.user {
  display: flex;
  gap: 1vw;
  align-items: center;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#search-an-idea {
  padding: 2.5px;
}

.dropdown-content {
  position: absolute;
  width: 100px;
}

.dropdown-content-user {
  position: absolute;
  right: 0;
  width: 200px;
  top: calc(100% + 1px);
  margin-right: -0.1vw;
}

.aims-logo {
  padding-left: 20px;
}
</style>