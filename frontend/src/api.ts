import axios from "axios"
import { GetUploadUrlResponse } from "@hennigram/types/api/getUploadUrl"
import { PostMeta } from "@hennigram/types/PostMeta"

export const api = axios.create({
    baseURL: "/api",
})

export async function uploadAsset(file: File) {
    const response = await api.post("/upload", { fileName: file.name, fileType: file.type }).then(res => res.data as GetUploadUrlResponse)

    await api.put(response.url, file)

    return response.postId
}

export const upsertPostMeta = async (postMeta: PostMeta) => api.post("/post-meta", postMeta)

export const getPostMeta = (id: string) => api.get("/post-meta/" + id).then(res => res.data as PostMeta)

export const deletePostMeta = (id: string) => api.delete("/post-meta/" + id)
