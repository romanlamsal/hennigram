import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import EditContent from "./pages/EditContent.vue"
import Feed from "./pages/Feed.vue"

const app = createApp(App)

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
