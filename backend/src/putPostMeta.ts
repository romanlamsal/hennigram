import { APIGatewayProxyHandler } from "aws-lambda"
import { PostMeta } from "@hennigram/types/PostMeta"
import { DynamoDB, S3 } from "aws-sdk"
import { toBucketKey } from "./toBucketKey"

export const putPostMeta: APIGatewayProxyHandler = async event => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: "No post meta given.",
        }
    }

    const postMeta = JSON.parse(event.body) as PostMeta

    await Promise.all([
        new S3()
            .putObject({
                Bucket: process.env.ASSETS_BUCKET!,
                Key: toBucketKey(postMeta),
                Body: event.body,
            })
            .promise(),

        new DynamoDB.DocumentClient()
            .put({
                TableName: process.env.POSTS_TABLE!,
                Item: postMeta,
            })
            .promise(),
    ])

    return {
        statusCode: 200,
        body: "",
    }
}
