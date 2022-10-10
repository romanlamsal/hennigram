<template>
    <div :class="imgContainerClasses">
        <img v-if="contentType.startsWith('image/')" :class="imgClasses" :src="fileSrc" :alt="filename" />
        <video v-else :src="fileSrc" controls />
    </div>
</template>

<script setup lang="ts">
import { toMediaUrl } from "@hennigram/utils/toMediaUrl"
import { computed } from "vue"

const props = defineProps<{ id: string; filename: string; contentType: string }>()

const imgContainerClasses = "w-full max-w-full h-full max-h-full flex items-center justify-center p-2"
const imgClasses = "object-contain max-w-full max-h-full h-full"

const fileSrc = computed(() => "/" + toMediaUrl(props.id, props.filename))
</script>

<style scoped lang="scss"></style>
