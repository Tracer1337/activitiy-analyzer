import Vue from "vue"
import VueRouter from "vue-router"

import IndexPage from "../pages/IndexPage.vue"

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: "/",
            component: IndexPage
        }
    ]
})

export default router