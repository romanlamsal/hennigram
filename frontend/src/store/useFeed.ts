import { defineStore } from "pinia"
import type { PostMeta } from "@hennigram/types/PostMeta"
import type { GetPageRequest, GetPageResponse } from "@hennigram/types/api/getPage"
import { api } from "../api"

export type FeedStoreState = {
    pagination: GetPageResponse["pagination"]
    posts: PostMeta[]
    loading: boolean
    stopLoading: boolean
}

export const useFeed = defineStore("feed", {
    state(): FeedStoreState {
        return {
            pagination: {},
            posts: [],
            loading: false,
            stopLoading: false,
        }
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

            if (this.pagination.nextToken && !pagination.nextToken) {
                console.log("Reached the end of the feed. Found", this.posts.length, "posts.")
                this.stopLoading = true
            }

            this.pagination = pagination
            this.posts.push(...page)
        },
    },
})
