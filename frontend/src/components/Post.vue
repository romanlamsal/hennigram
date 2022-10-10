<template>
    <article class="max-w-screen-md w-full grid grid-rows-[24rem_auto]">
        <PostMedia v-bind="post" class="border-2 border-white rounded-t-lg" />
        <div class="bg-white border-2 border-white rounded-b-lg text-gray-800 box-border p-2">
            <div class="text-lg">
                {{ post.description }}
            </div>
            <div class="text-sm">
                <span>{{ new Date(post.dating).toLocaleDateString() }}</span>
                <span></span>
            </div>
        </div>
    </article>
</template>

<script lang="ts" setup>
import PostMedia from "./PostMedia.vue"
import { PostMeta } from "@hennigram/types/PostMeta"

defineProps<{ post: PostMeta }>()
</script>

<style scoped></style>
