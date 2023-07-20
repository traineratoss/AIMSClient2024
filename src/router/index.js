import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CommentView from "../views/CommentView.vue";
import AllIdeas from "../views/AllIdeas.vue";
import MyIdeas from "../views/MyIdeas.vue";
import RegisterView from "../views/RegisterView.vue";

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
      component: AllIdeas,
    },
    {
      path: "/my",
      name: "my",
      component: MyIdeas,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
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
