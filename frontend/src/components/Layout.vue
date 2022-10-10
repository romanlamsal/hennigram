<template>
    <div class="bg-gray-800 h-screen text-white pt-8">
        <SnackbarProvider />
        <section class="max-w-screen-lg mx-auto h-full grid grid-rows-[1fr_auto]">
            <main class="px-8 overflow-y-auto pb-16">
                <slot />
            </main>
            <Footer />
        </section>
    </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import Footer from "./Footer.vue"
import SnackbarProvider from "./SnackbarProvider.vue"

defineComponent({
    name: "Layout",
})
</script>

<style scoped lang="scss"></style>
