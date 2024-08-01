import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { customFetch } from "./utils/customFetch";

import axios from "axios";
import { isRefreshTokenExipred, isAccessTokenExpired, setTokenExpiry, refreshTokens } from "./services/token.service"
import { logout } from "./services/user_service";


const nativeFetch = window.fetch
window.fetch = customFetch;


const app = createApp(App);
app.use(router);

app.mount("#app");

//new comment

// import { createApp } from "vue";
// import App from "./securityTest/App.vue";
// import router from "./securityTest/router";
// import store from "./securityTest/storeTEST"
// import "bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";

// createApp(App)
//   .use(router)
//   .use(store)
//   .mount("#app");

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async function(config) {

    config.withCredentials = true;

    if (isRefreshTokenExipred()) {
        await logout();
    }

    if (isAccessTokenExpired()) {
        await refreshTokens();
    }

    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export {
    nativeFetch,
    axiosInstance
};