import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import auth from "@/router/auth";
import vue3GoogleLogin from "vue3-google-login";
// Import Bootstrap and BootstrapVue CSS files
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import { Vue3Toastify } from "vue3-toastify";
// Import BootstrapVue 3
import BootstrapVue3 from "bootstrap-vue-3";

const app = createApp(App);

const gauthClientId =
  "573356083224-pqd0j2jlnqvfq79g9nunnujuakqtgoqs.apps.googleusercontent.com";
app.use(vue3GoogleLogin, {
  clientId: gauthClientId,
});
app.use(BootstrapVue3);
app.use(router);
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
});
// Check for stored credentials and update auth state
const storedUser = localStorage.getItem("user");
if (storedUser) {
  auth.loggedIn = true;
}
app.mount("#app");
