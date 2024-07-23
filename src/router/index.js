import { createRouter, createWebHistory } from "vue-router";
import AllIdeasView from "../views/AllIdeasView.vue";
import UserLoginView from "../views/UserLoginView.vue";
import MyIdeasView from "../views/MyIdeasView.vue";
import PasswordRecoveryView from "../views/PasswordRecoveryView.vue";
import RegisterView from "../views/RegisterView.vue";
import RegistrationCompleteViewVue from "../views/RegistrationCompleteView.vue";
import ChangePasswordView from "../views/ChangePasswordView.vue";
import MyProfileView from "../views/MyProfileView.vue";
import AdminDashboardView from "../views/AdminDashboardView.vue";
import CreateIdeaView from "../views/CreateIdeaView.vue";
import PageNotFound from "../views/PageNotFound.vue";
import TestView from "../views/TestView.vue";
import { getCurrentRole, getCurrentUsername } from "../services/user_service";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "default",
      component: UserLoginView,
    },
    {
      path: "/all",
      name: "all",
      component: AllIdeasView,
    },
    {
      path: "/my",
      name: "my",
      component: MyIdeasView,
    },
    {
      path: "/login",
      name: "login",
      component: UserLoginView,
    },
    {
      path: "/my-profile",
      name: "my-profile",
      component: MyProfileView,
    },
    {
      path: "/recovery",
      name: "recovery",
      component: PasswordRecoveryView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/create-idea",
      name: "create-idea",
      component: CreateIdeaView,
    },
    {
      path: "/registration-complete",
      name: "registration-complete",
      component: RegistrationCompleteViewVue,
    },
    {
      path: "/change",
      name: "change",
      component: ChangePasswordView,
    },
    {
      path: "/my-profile",
      name: "my profile",
      component: MyProfileView,
    },
    {
      path: "/admin-dashboard",
      name: "admin-dashboard",
      component: AdminDashboardView,
    },
    {
      path: "/test",
      name: "test",
      component: TestView,
    },
    {
      path: "/:pathMatch(.*)*",
      alias: '/page-not-found',
      name: "page-not-found",
      component: PageNotFound,
    },
  ],
});

router.beforeEach((to, from) => {
  if (getCurrentUsername() !== null) {
    if (to.name === 'change') {
      return;
    }
    
    if (to.name === 'login' || 
        to.name === 'register' || 
        to.name === 'recovery' ||
        to.name === 'registration-complete' ||
        to.name === 'default') {
          router.push('/my');
      }
    
    if (getCurrentRole() === 'STANDARD' && to.name === 'admin-dashboard') {
      router.push('/page-not-found');
      showNavbar.value = false;
      return;
    }
  } else {
    if (to.name !== 'login' && 
        to.name !== 'register' && 
        to.name !== 'recovery' &&
        to.name !== 'registration-complete' &&
        to.name !== 'page-not-found' &&
        to.name !== 'default') {
          router.push('/login');
      }
  }
});


/*

FlorinCP : 

If you want to check Authorized status everytime a navigating action is trigger,
just add router.beforeEach() inside src/router.js like this:

*/

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login', '/register', '/home'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem('user');

//   // trying to access a restricted page + not logged in
//   // redirect to login page
//   if (authRequired && !loggedIn) {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router;
