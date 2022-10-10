import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import EditContent from "./pages/EditContent.vue"
import Feed from "./pages/Feed.vue"
import { createPinia } from "pinia"
import elementInView from "@lamsal-de/vue-element-in-view"

const app = createApp(App)

app.use(elementInView, { threshold: 0.8 })

const pinia = createPinia()
app.use(pinia)

const routes: RouteRecordRaw[] = [
    {
        path: "/edit-content/:id?",
        component: EditContent,
    },
    {
        path: "/",
        component: Feed,
    },
]
const router = createRouter({
    routes,
    history: createWebHistory(),
})

app.use(router)

app.mount("#app")
