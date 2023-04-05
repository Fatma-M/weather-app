import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./tailwind.css";

import BaseModal from "@/components/BaseModal";

const app = createApp(App);

app.use(router);

app.component("BaseModal", BaseModal);

app.mount("#app");
