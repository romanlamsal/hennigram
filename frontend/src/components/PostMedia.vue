<template>
    <div :class="imgContainerClasses">
        <img :class="imgClasses" :src="`/assets/${id}/${filename}`" :alt="filename" />
    </div>
</template>

<script setup lang="ts">
defineProps<{ id: string; filename: string; contentType: string }>()

const imgContainerClasses = "w-full max-w-full h-full max-h-full flex items-center justify-center"
const imgClasses = "object-fit max-w-full max-h-full h-full"
</script>

<style scoped lang="scss"></style>
