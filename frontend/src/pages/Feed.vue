<template>
    <div>
        <main>
            <div v-for="post in posts" :key="post.id">{{ post }}</div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import type { PostMeta } from "@hennigram/types/PostMeta"
import { getPage } from "../api"

const posts = ref<PostMeta[]>([])

onMounted(() => {
    getPage().then(res => (posts.value = res))
})
</script>

<style scoped lang="scss"></style>
