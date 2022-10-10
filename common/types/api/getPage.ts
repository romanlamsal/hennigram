import { PostMeta } from "../PostMeta"

export type GetPageRequest = {
    params: {
        nextToken?: string
        queryId?: string
    }
}

export type GetPageResponse = {
    pagination: {
        nextToken?: string
        queryId?: string
    }
    page: PostMeta[]
}
