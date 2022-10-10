<template>
    <div class="h-0 relative mx-4">
        <div v-for="{ message } in snacksStore.queue" class="absolute top-0 w-full rounded-full border bg-green-500 text-white p-4">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import { useSnacks } from "../store/useSnacks"

defineComponent({
    name: "SnackbarProvider",
})

const snacksStore = useSnacks()
</script>

<style scoped lang="scss"></style>
