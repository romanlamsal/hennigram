<template>
    <div v-if="data">
        <div class="border rounded-lg border-white mx-auto max-w-full md:max-w-screen-md h-96">
            <div v-if="!id" class="relative" :class="imgContainerClasses">
                <input
                    type="file"
                    id="upload"
                    :multiple="false"
                    class="hidden"
                    ref="input"
                    @change="file = $event.target.files[0]"
                    accept="image/*,video/*"
                />
                <img v-if="file && file.type.startsWith('image/')" :src="fileUrl" alt="upload" :class="imgClasses" />
                <video v-else-if="file && file.type.startsWith('video/')" :src="fileUrl" />
                <label for="upload" class="cursor-pointer absolute inset-0 flex justify-center items-center">
                    <span v-if="!file">Click here to upload</span>
                </label>
            </div>
            <div v-else :class="imgContainerClasses">
                <img
                    v-if="data.contentType.startsWith('image/')"
                    :src="'/' + toMediaUrl(data.id, data.filename)"
                    :alt="data.filename"
                    :class="imgClasses"
                />
                <video v-else :src="'/' + toMediaUrl(data.id, data.filename)" />
            </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-2 sm:gap-8 mt-8 w-full">
            <label for="description">Description</label>
            <textarea id="description" class="text-black resize-y" v-model="data.description" rows="5" />
            <label for="dating">Dating</label>
            <input id="dating" type="date" class="text-black" v-model="data.dating" />
        </div>
        <div class="text-right mt-16" :class="[id && 'grid grid-cols-[auto_1fr] gap-x-8']">
            <button
                v-if="id"
                class="border border-red-500 rounded-md py-2 px-4 w-full bg-red-500 text-white font-semibold disabled:opacity-50"
                @click="callDelete"
                :disabled="loading"
            >
                <TrashCan />
            </button>
            <button
                class="border rounded-md p-2 w-full bg-white text-gray-800 font-semibold disabled:opacity-50"
                @click="save"
                :disabled="loading"
            >
                {{ id ? "update" : "save" }}
            </button>
        </div>
    </div>
    <div v-else>Loading...</div>
</template>

<script setup lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getPostMeta } from "../api"
import type { PostMeta } from "@hennigram/types/PostMeta"
import { toMediaUrl } from "@hennigram/utils/toMediaUrl"
import { usePosts } from "../store/usePosts"
import { TrashCan } from "mdue"

defineComponent({
    name: "EditContent",
})

const router = useRouter()
const route = useRoute()
const postsStore = usePosts()

const id = ref(route.params.id as string | undefined)

const data = ref<PostMeta>()

onMounted(async () => {
    if (id.value) {
        data.value = await getPostMeta(id.value)
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

const imgContainerClasses = "w-full max-w-full h-full max-h-full flex items-center justify-center"
const imgClasses = "object-contain max-w-full max-h-full h-full"

const loading = ref<boolean>(false)

const withLoading = <T extends unknown>(prms: Promise<T>) => {
    loading.value = true
    return prms.finally(() => (loading.value = false))
}

async function save() {
    if (!id.value) {
        await uploadAndCreate()
    } else {
        await update()
    }
}

async function uploadAndCreate() {
    if (!file.value) {
        return
    }

    await withLoading(
        postsStore.createPost(file.value, {
            description: data.value!.description,
            dating: data.value?.dating || new Date().toISOString(),
        })
    ).then(({ id }) => router.replace("/edit-content/" + id))
}

async function update() {
    await withLoading(postsStore.updatePost(data.value!))
    await router.push("/")
}

async function callDelete() {
    await withLoading(postsStore.deletePost(id.value!))
    await router.push("/")
}
</script>

<style scoped lang="scss"></style>
