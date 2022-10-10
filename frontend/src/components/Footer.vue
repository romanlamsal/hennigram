<template>
    <footer class="grid grid-cols-3 pt-4">
        <nav
            v-for="{ label, icon, target, isActive } in navElements"
            :key="label"
            @click="router.push(target)"
            class="flex flex-col items-center justify-center p-4 cursor-pointer rounded-t-lg space-y-2"
            :class="isActive && 'bg-gray-700'"
        >
            <component :is="icon" />
            {{ label }}
        </nav>
    </footer>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { Rss, Upload, FolderMultipleImage } from "mdue"
import { computed } from "vue"

const router = useRouter()
const route = useRoute()

const navElements = computed(() => [
    {
        label: "Feed",
        icon: Rss,
        target: "/",
        isActive: route.path === "/",
    },
    {
        label: "Gallery",
        icon: FolderMultipleImage,
        target: "/gallery",
        isActive: route.path.startsWith("/gallery"),
    },
    {
        label: "Upload",
        icon: Upload,
        target: "/edit-content",
        isActive: route.path.startsWith("/edit-content"),
    },
])
</script>

<style scoped lang="scss"></style>
