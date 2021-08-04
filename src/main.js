import Vue from "vue";
import App from "./App.vue";
import "./assets/css/index.css";
import router from "./router"
import VueRouter from "vue-router";

import a from "./test"
console.log(a);


Vue.use(VueRouter)

new Vue({
    router,
    render(h) {
        return h(App);
    }
}).$mount("#app")

