import { APIGatewayProxyHandler } from "aws-lambda"
import { S3 } from "aws-sdk"
import { PostMeta } from "@hennigram/types/PostMeta"
import { toBucketKey } from "./toBucketKey"

export const getPostMeta: APIGatewayProxyHandler = async event => {
    const { id } = (event.pathParameters || {}) as { id: string }

    if (!id) {
        return {
            statusCode: 400,
            body: "No id provided.",
        }
    }

    const item: PostMeta = await new S3()
        .getObject({
            Bucket: process.env.ASSETS_BUCKET!,
            Key: toBucketKey({ id }),
        })
        .promise()
        .then(res => (res.Body ? JSON.parse(res.Body?.toString()) : undefined))

    /*const item: PostMeta = await new DynamoDB.DocumentClient()
        .get({
            TableName: process.env.POSTS_TABLE!,
            Key: {
                id,
            },
        })
        .promise()
        .then(res => res.Item as PostMeta)*/

    if (!item) {
        return {
            statusCode: 404,
            body: "",
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(item),
        headers: {
            "Content-Type": "application/json",
        },
    }
}
