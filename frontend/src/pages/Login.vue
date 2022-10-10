<template>
    <div>Login with key {{ apiKey }}:</div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { onMounted, ref } from "vue"

const route = useRoute()

const apiKey = route.query.apiKey

const success = ref<boolean>()

onMounted(() => {})
</script>

<style scoped lang="scss"></style>
