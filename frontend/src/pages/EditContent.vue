<template>
    <div v-if="data">
        <main class="p-8">
            <div class="border rounded-lg border-white mx-auto md:max-w-screen-md h-96" @click="!id ? $refs.input.click() : null">
                <div v-if="!id" class="cursor-pointer" :class="imgContainerClasses">
                    <input
                        type="file"
                        id="upload"
                        :multiple="false"
                        class="hidden"
                        ref="input"
                        @change="file = $event.target.files[0]"
                        accept="image/*,video/*"
                    />
                    <label for="upload" class="cursor-inherit" v-if="!file">
                        <span>Click here to upload</span>
                    </label>
                    <img v-else :src="fileUrl" alt="upload" :class="imgClasses" />
                </div>
                <div v-else :class="imgContainerClasses">
                    <img
                        v-if="data.contentType.startsWith('image/')"
                        :src="`/assets/${data.id}/${data.filename}`"
                        :alt="data.filename"
                        :class="imgClasses"
                    />
                </div>
            </div>
            <div class="grid grid-cols-[auto_1fr] gap-8 mt-8">
                <label for="description">Description</label>
                <input id="description" class="text-black" v-model="data.description" />
                <label for="dating">Dating</label>
                <input id="dating" type="date" class="text-black" v-model="data.dating" />
            </div>
            <div class="text-right mt-16">
                <button
                    class="border rounded-md p-2 w-full bg-white text-gray-800 font-semibold"
                    @click="uploadAndCreate"
                    :disabled="loading"
                >
                    save
                </button>
            </div>
        </main>
    </div>
    <div v-else>Loading...</div>
</template>

<script setup lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { createPost, getPostMeta } from "../api"
import type { PostMeta } from "@hennigram/types/PostMeta"

defineComponent({
    name: "EditContent",
})

const router = useRouter()
const route = useRoute()

const id = route.params.id
const data = ref<PostMeta>()
onMounted(async () => {
    if (id) {
        data.value = await getPostMeta(id as string)
    } else {
        data.value = {
            id: "",
            description: "",
            dating: new Date().toISOString().split("T")[0],
            filename: "",
            created: "",
            contentType: "",
            dimensions: {
                width: -1,
                height: -1,
            },
        }
    }
})

const file = ref<File>()
const fileUrl = computed(() => (file.value ? URL.createObjectURL(file.value) : undefined))

watch(
    () => data.value?.dating,
    (value, oldValue) => {
        console.log("FROM", oldValue, "TO", value)
    }
)

const imgContainerClasses = "w-full max-w-full h-full max-h-full flex items-center justify-center"
const imgClasses = "object-fit max-w-full max-h-full h-full"

const loading = ref<boolean>(false)

async function uploadAndCreate() {
    if (!file.value) {
        return
    }

    loading.value = true
    await createPost(file.value, {
        description: data.value!.description,
        dating: data.value?.dating || new Date().toISOString(),
    })
        .then(({ id }) => router.push("/edit-content/" + id))
        .finally(() => (loading.value = false))
}

async function update() {}
</script>

<style scoped lang="scss"></style>
