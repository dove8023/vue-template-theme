import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import router from './router'
import store from './vuex/store'
import GSui from "@gs-ui/gs-ui"
import 'element-ui/lib/theme-chalk/index.css'
import { Upload, Dialog } from 'element-ui'
import kmpInit from "./kmp"
import "@/assets/icon/iconfont.css"
import "@/assets/css/index.scss"

import "./config"



Vue.config.productionTip = false

Vue.component(Upload.name, Upload)
Vue.component(Dialog.name, Dialog)

Vue.use(VueRouter)
Vue.use(GSui)

!(async function(){
    const configs = (window as any ).epApp.configs;

    console.time("kmp-web loading: ")
    await kmpInit(configs.theme)
    console.timeEnd("kmp-web loading: ")
    
    const faviconPath = configs.faviconPath
    const link = document.querySelector("link[rel*='icon']") as Element ;
    link.setAttribute("href",faviconPath||"./defaultFavicon.ico")
    
    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app')
}())
