import { APIGatewayProxyHandler } from "aws-lambda"
import { PostMeta } from "@hennigram/types/PostMeta"
import { DynamoDB } from "aws-sdk"

export const putPostMeta: APIGatewayProxyHandler = async event => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: "No post meta given.",
        }
    }

    const postMeta = JSON.parse(event.body) as PostMeta

    await new DynamoDB.DocumentClient()
        .put({
            TableName: process.env.POSTS_TABLE!,
            Item: postMeta,
        })
        .promise()

    return {
        statusCode: 200,
        body: "",
    }
}
