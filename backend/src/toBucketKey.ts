import { PostMeta } from "@hennigram/types/PostMeta"

export const toBucketKey = ({ id }: Pick<PostMeta, "id">) => `data/${id}.json`
