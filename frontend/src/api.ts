import axios from "axios"
import { GetUploadUrlResponse } from "@hennigram/types/api/getUploadUrl"
import { PostMeta } from "@hennigram/types/PostMeta"

export const api = axios.create({
    baseURL: "/api",
})

const measureImage = (file: File): Promise<{ width: number; height: number }> => {
    const _URL = window.URL || window.webkitURL
    return new Promise((resolve, reject) => {
        const img = new Image()
        const objectUrl = _URL.createObjectURL(file)
        img.onload = function () {
            resolve({ width: img.width, height: img.height })
            _URL.revokeObjectURL(objectUrl)
        }
        img.onerror = err => reject(err)
        img.src = objectUrl
    })
}

async function uploadAsset(file: File) {
    const response = await api.post("/upload", { fileName: file.name, fileType: file.type }).then(res => res.data as GetUploadUrlResponse)

    await api.put(response.url, file)

    return response.postId
}

const upsertPostMeta = async (postMeta: PostMeta) => api.post("/post-meta", postMeta)

export async function createPost(file: File, { description, dating }: Pick<PostMeta, "description" | "dating">) {
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

    return postMeta
}

export const getPostMeta = (id: string) => api.get("/post-meta/" + id).then(res => res.data as PostMeta)

export const getPage = (startFrom?: string) => api.get("/post-meta", { params: { startFrom } }).then(res => res.data as PostMeta[])
