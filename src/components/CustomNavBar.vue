<script setup>
import CustomInput from "../components/CustomInput.vue";
import CustomButton from "../components/CustomButton.vue";
import router from "../router";
import CustomNavigationDropDown from "../components/CustomNavigationDropDown.vue";
import { ref, watch, onMounted } from "vue";
import {
  getCurrentAvatarId,
  getCurrentRole,
  getCurrentUsername,
} from "../services/user_service";
import searchValue from "../utils/search-title";

const searchBarTitle = ref("");

const indexOfActivePage = ref(2);
const disabledDashboard = ref(true);
const disabledUser = ref(true);
const currentUsername = ref("");
const currentAvatarId = ref(-1);
const allIdeasActive = ref(false);
const myIdeasActive = ref(true);
const createIdeaActive = ref(false);

let userDashboardElements = [];

const slideImages = [
  "src/assets/img/avatars/avatar1.svg",
  "src/assets/img/avatars/avatar2.svg",
  "src/assets/img/avatars/avatar3.svg",
  "src/assets/img/avatars/avatar4.svg",
  "src/assets/img/avatars/avatar5.svg",
  "src/assets/img/avatars/avatar6.svg",
  "src/assets/img/avatars/avatar7.svg",
];

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

watch(searchValue, (newValue) => {
  if (newValue.text !== undefined && newValue.key === "Enter") {
    searchBarTitle.value = newValue.text;
    router.push({ path: '/all'});
  }
});


router.beforeEach((to, from) => {
  if (
    from.name === "my-profile" ||
    from.name === "login" ||
    to.name === "default"
  ) {
    currentUsername.value = getCurrentUsername();
    currentAvatarId.value = getCurrentAvatarId();
  }

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

  if (getCurrentRole() === "ADMIN") {
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

onMounted(() => {
  currentUsername.value = getCurrentUsername();
  currentAvatarId.value = getCurrentAvatarId();

  indexOfActivePage.value = parseInt(
    localStorage.getItem("current page index")
  );

  if (indexOfActivePage.value === 1) {
    activateAllIdeas();
  } else if (indexOfActivePage.value === 2) {
    activateMyIdeas();
  } else if (indexOfActivePage.value === 4) {
    activateCreateIdea();
  } else {
    deactivateAll();
  }

});

function activateAllIdeas() {
  allIdeasActive.value = true;
  myIdeasActive.value = false;
  createIdeaActive.value = false;
}

function activateMyIdeas() {
  allIdeasActive.value = false;
  myIdeasActive.value = true;
  createIdeaActive.value = false;
}

function activateCreateIdea() {
  allIdeasActive.value = false;
  myIdeasActive.value = false;
  createIdeaActive.value = true;
}

function deactivateAll() {
  allIdeasActive.value = false;
  myIdeasActive.value = false;
  createIdeaActive.value = false;
}

function redirectToAllIdeas() {
  indexOfActivePage.value = 1;

  activateAllIdeas();

  localStorage.setItem("current page index", indexOfActivePage.value);
  router.push("/all");
}

function redirectToMyIdeas() {
  indexOfActivePage.value = 2;

  activateMyIdeas();

  localStorage.setItem("current page index", indexOfActivePage.value);
  router.push("/my");
}

function redirectToCreateIdea() {
  indexOfActivePage.value = 4;

  activateCreateIdea();

  localStorage.setItem("current page index", indexOfActivePage.value);
  router.push("/create-idea");
}

function isPageWithIndexActive(index) {
  return parseInt(localStorage.getItem("current page index")) == index
    ? true
    : false;
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
  if (elementId === "my-ideas" || elementId === "logout") {
    indexOfActivePage.value = 2;

    activateMyIdeas();
  } else if (elementId === "stats") {
    indexOfActivePage.value = 1;

    activateAllIdeas();
  } else {
    indexOfActivePage.value = 0;

    deactivateAll();
  }
  localStorage.setItem("current page index", indexOfActivePage.value);
}
</script>


<template>
  <nav id="navbar">
    <img src="../assets/img/AIMS.svg" class="aims-logo" />
    <div class="options">
      <div class="buttons">
        <CustomButton
          class="nav-button"
          id="all-ideas"
          @click="redirectToAllIdeas"
          :is-active="allIdeasActive"
        >
          All ideas
        </CustomButton>
        <CustomButton
          class="nav-button"
          id="my-ideas"
          @click="redirectToMyIdeas"
          :is-active="myIdeasActive"
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
            <span class="material-symbols-outlined"> arrow_drop_down </span>
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
          :is-active="createIdeaActive"
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
          :can-modify-search-value="true"
          v-model="searchBarTitle"
        />
      </div>
    </div>
    <div class="user">
      <div class="user-details">
        <h3
          style="font-size: 16px; font-weight: 550; height: 1vh; margin: 1vh 0"
        >
          {{ currentUsername }}
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
        style="padding: 20px 5px"
      >
        <img
          :src="slideImages[currentAvatarId]"
          alt="avatar not found"
          style="height: auto; width: 2vw"
        />
        <span class="material-symbols-outlined"> keyboard_arrow_down </span>
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
  min-height: 6vh;
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
  border-color: transparent;
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
  z-index: 100;
}

.aims-logo {
  padding-left: 20px;
}
</style>