import VueRouter from "vue-router";
import A from "./view/a.vue"
import B from "./view/b.vue"
import Hello from "./components/HelloWorld.vue"

const router = new VueRouter({
    routes: [
        {
            name: "AAA",
            path: "/a",
            component: ()=>import("./view/a.vue")
            // component: A
        },
        {
            name: "BBB",
            path: "/b",
            component: ()=>import("./view/b.vue")
        },
        {
            name: "hello",
            path: "/hello",
            component: ()=>import("./components/HelloWorld.vue")
        }
    ]
})


export default router;