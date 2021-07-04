import App from "./App.vue";
import Vue from "vue";
import "./assets/css/index.css";

new Vue({
    render(h) {
        return h(App);
    }
}).$mount("#app")

