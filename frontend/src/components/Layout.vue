<template>
    <div class="bg-gray-800 h-screen text-white pt-8 grid grid-rows-[1fr_auto]">
        <main>
            <slot />
        </main>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import Footer from "./Footer.vue"

defineComponent({
    name: "Layout",
})
</script>

<style scoped lang="scss"></style>
