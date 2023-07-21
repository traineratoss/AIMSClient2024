import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CommentView from "../views/CommentView.vue";
import AllIdeasView from "../views/AllIdeasView.vue";
import UserLoginView from "../views/UserLoginView.vue";
import MyIdeasView from "../views/MyIdeasView.vue";
import PasswordRecoveryView from "../views/PasswordRecoveryView.vue";
import RegisterView from "../views/RegisterView.vue";
import ChangePasswordView from "../views/ChangePasswordView.vue";
import MyProfileView from "../views/MyProfileView.vue";
import TermsAndConditionsView from "../views/TermsAndConditionsView.vue";
import RegistrationCompleteView from "../views/RegistrationCompleteView.vue";
import IdeaCard from "../components/IdeaCard.vue";
import IdeaList from "../components/IdeaList.vue";
import DeleteIdeaView from "../views/DeleteIdeaView.vue";
import AdminDashboardView from "../views/AdminDashboardView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/comment",
      name: "comment",
      component: CommentView,
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
      path: "/registration-complete",
      name: "registration-complete",
      component: RegistrationCompleteView,
    },
    {
      path: "/change",
      name: "change",
      component: ChangePasswordView,
    },
    {
      path: "/my-profile",
      name: "my-profile",
      component: MyProfileView,
    },
    {
      path: "/terms",
      name: "terms",
      component: TermsAndConditionsView,
    },
    {
      path: "/idea",
      name: "idea:id",
      component: IdeaCard,
    },
    {
      path: "/",
      name: "idealist",
      component: IdeaList,
    },
    {
      path: "/viewidea",
      name: "viewidea",
      component: IdeaCard,
    },
    {
      path: "/",
      name: "idealist",
      component: IdeaList,
    },
    {
      path: "/delete",
      name: "delete",
      component: DeleteIdeaView,
    },
    {
      path: "/admin-dashboard",
      name: "admin-dashboard",
      component: AdminDashboardView,
    },
  ],
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
