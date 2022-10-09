import { APIGatewayProxyHandler } from "aws-lambda"
import { PostMeta } from "@hennigram/types/PostMeta"
import { DynamoDB } from "aws-sdk"

export const getPage: APIGatewayProxyHandler = async event => {
    // TODO: comes with get so rather use param
    const { startFrom } = JSON.parse(event.body || "{}") as { startFrom?: string }

    const page: PostMeta[] = await new DynamoDB.DocumentClient()
        .scan({
            TableName: process.env.POSTS_TABLE!,
            IndexName: process.env.POSTS_TABLE_DATED_INDEX!,
            ExclusiveStartKey: startFrom ? { id: startFrom } : undefined,
        })
        .promise()
        .then(res => res.Items as PostMeta[])

    return {
        statusCode: 200,
        body: JSON.stringify(page),
        headers: {
            "Content-Type": "application/json",
        },
    }
}
