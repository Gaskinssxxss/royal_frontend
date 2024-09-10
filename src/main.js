import { createApp } from "vue";
import App from "./App.vue";
import "./assets/styles/tailwind.css";
import router from "./router";
import store from "./services/store";

import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

createApp(App).use(router).use(store).use(VueToast).mount("#app");
