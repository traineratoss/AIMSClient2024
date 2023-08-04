import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import mitt from 'mitt';
const emitter = mitt();
const app = createApp(App);
app.config.globalProperties.emitter = emitter;
app.use(router)

app.mount('#app')



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
