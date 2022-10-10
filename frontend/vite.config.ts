import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        port: 4040,
        host: true,
        proxy: {
            "/api": {
                target: "https://hennigram.lamsal.de",
                changeOrigin: true,
            },
            "/static-assets": {
                target: "https://hennigram.lamsal.de",
                changeOrigin: true,
            },
        },
    },
})
