<template>
    <div class="">
        <main class="flex flex-col items-center space-y-12">
            <Post v-for="post in feedStore.posts" :key="post.id" :post="post" />
            <footer class="h-24 w-full bg-gray-500 flex items-center justify-center">
                <div v-if="feedStore.loading">Loading...</div>
                <div v-else-if="feedStore.stopLoading">The End</div>
                <div v-else v-element-in-view.once="feedStore.loadPage"></div>
            </footer>
        </main>
    </div>
</template>

<script setup lang="ts">
import { useFeed } from "../store/useFeed"
import { onMounted } from "vue"
import Post from "../components/Post.vue"

const feedStore = useFeed()

onMounted(() => {
    feedStore.loadPage()
})
</script>

<style scoped lang="scss"></style>
