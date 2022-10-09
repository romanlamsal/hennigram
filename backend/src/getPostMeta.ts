import { APIGatewayProxyHandler } from "aws-lambda"
import { DynamoDB } from "aws-sdk"
import { PostMeta } from "@hennigram/types/PostMeta"

export const getPostMeta: APIGatewayProxyHandler = async event => {
    const { id } = (event.pathParameters || {}) as { id: string }

    if (!id) {
        return {
            statusCode: 400,
            body: "No id provided.",
        }
    }

    const item: PostMeta = await new DynamoDB.DocumentClient()
        .get({
            TableName: process.env.POSTS_TABLE!,
            Key: {
                id,
            },
        })
        .promise()
        .then(res => res.Item as PostMeta)

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
