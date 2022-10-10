import { APIGatewayProxyHandler } from "aws-lambda"
import { queryPage } from "./query-page"

export const getPage: APIGatewayProxyHandler = async event => {
    // TODO: comes with get so rather use param
    const { nextToken, queryId } = event.queryStringParameters || {}

    /*const page: PostMeta[] = await new DynamoDB.DocumentClient()
        .scan({
            TableName: process.env.POSTS_TABLE!,
            IndexName: process.env.POSTS_TABLE_DATED_INDEX!,
            ExclusiveStartKey: startFrom ? { id: startFrom } : undefined,
        })
        .promise()
        .then(res => res.Items as PostMeta[])*/

    const result = await queryPage({ nextToken, queryExecutionId: queryId })

    return {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: {
            "Content-Type": "application/json",
        },
    }
}
