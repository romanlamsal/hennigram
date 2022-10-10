import { defineStore } from "pinia"
import type { PostMeta } from "@hennigram/types/PostMeta"
import type { GetPageRequest, GetPageResponse } from "@hennigram/types/api/getPage"
import { api, deletePostMeta, uploadAsset, upsertPostMeta } from "../api"
import { measureImage } from "../util/measureImage"
import { useSnacks } from "./useSnacks"

export type PostStoreState = {
    pagination: GetPageResponse["pagination"]
    posts: PostMeta[]
    loading: boolean
    stopLoading: boolean
}

export const usePosts = defineStore("post", {
    state(): PostStoreState {
        return {
            pagination: {},
            posts: [],
            loading: false,
            stopLoading: false,
        }
    },
    getters: {
        sortedPosts: state =>
            state.posts.sort((a, b) => {
                const aDate = new Date(a.dating).getTime(),
                    bDate = new Date(b.dating).getTime()
                if (aDate === bDate) {
                    return new Date(b.created).getTime() - new Date(a.created).getTime()
                }
                return bDate - aDate
            }),
    },
    actions: {
        async loadPage() {
            if (this.loading || this.stopLoading) {
                return
            }

            this.loading = true
            const params: GetPageRequest["params"] = this.pagination

            const { page, pagination } = await api
                .get<GetPageResponse>("/post-meta", { params })
                .then(res => res.data)
                .catch(err => {
                    console.error("Error fetching page:", err)
                    throw err
                })
                .finally(() => (this.loading = false))

            if (!pagination.nextToken) {
                console.log("Reached the end of the feed. Found", this.posts.length, "posts.")
                this.stopLoading = true
            }

            this.pagination = pagination
            this.posts.push(...page)
        },
        async createPost(file: File, { description, dating }: Pick<PostMeta, "description" | "dating">) {
            const snacksStore = useSnacks()
            const [postId, dimensions] = await Promise.all([
                uploadAsset(file),
                file.type.startsWith("image/")
                    ? measureImage(file)
                    : Promise.resolve({
                          width: -1,
                          height: -1,
                      }),
            ])

            const postMeta: PostMeta = {
                id: postId,
                contentType: file.type,
                dimensions,
                dating,
                created: new Date().toISOString(),
                description,
                filename: file.name,
            }

            await upsertPostMeta(postMeta)
            snacksStore.push({ message: "Successfully saved :)" })

            this.posts.push(postMeta)

            return postMeta
        },
        async updatePost(updatedPost: PostMeta) {
            const snacksStore = useSnacks()

            await upsertPostMeta(updatedPost)
            const existingIndex = this.posts.findIndex(post => post.id === updatedPost.id)
            if (existingIndex >= 0) {
                this.posts[existingIndex] = updatedPost
            }

            snacksStore.push({ message: "Successfully saved :)" })
        },
        async deletePost(id: string) {
            await deletePostMeta(id)
            this.posts.splice(
                this.posts.findIndex(post => post.id === id),
                1
            )
        },
    },
})
