import App from "./App.vue";
import Vue from "vue";

import "./assets/css/index.scss";


new Vue({
    render(h) {
        return h(App);
    }
}).$mount("#app")

