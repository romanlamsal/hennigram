export const mediaUrlPrefix = "static-assets"

export const toMediaUrl = (postId: string, filename: string) => `${mediaUrlPrefix}/${postId}/${filename}`
