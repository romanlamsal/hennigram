import { APIGatewayProxyHandler } from "aws-lambda"
import { S3 } from "aws-sdk"
import { toBucketKey } from "./toBucketKey"
import { PostMeta } from "@hennigram/types/PostMeta"
import { toMediaUrl } from "@hennigram/utils/toMediaUrl"

export const deletePostMeta: APIGatewayProxyHandler = async event => {
    const { id } = (event.pathParameters || {}) as { id: string }

    if (!id) {
        return {
            statusCode: 400,
            body: "No id provided.",
        }
    }

    const metaPath = toBucketKey({ id })
    const Bucket = process.env.ASSETS_BUCKET!

    const item: PostMeta = await new S3()
        .getObject({
            Bucket,
            Key: metaPath,
        })
        .promise()
        .then(res => (res.Body ? JSON.parse(res.Body?.toString()) : undefined))

    const s3 = new S3()
    const mediaPath = toMediaUrl(id, item.filename)
    console.log("FETCHED:", metaPath, item.id, item.filename, mediaPath)
    await Promise.all([
        s3
            .copyObject({
                Bucket,
                CopySource: Bucket + "/" + metaPath,
                Key: "archive/" + metaPath,
            })
            .promise(),
        s3
            .copyObject({
                Bucket,
                CopySource: Bucket + "/" + mediaPath,
                Key: "archive/" + mediaPath,
            })
            .promise(),
    ])
    await Promise.all([
        s3
            .deleteObject({
                Bucket,
                Key: metaPath,
            })
            .promise(),
        s3
            .deleteObject({
                Bucket,
                Key: mediaPath,
            })
            .promise(),
    ])

    return {
        statusCode: 200,
        body: "success",
    }
}
