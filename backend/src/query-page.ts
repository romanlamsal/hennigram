// noinspection SqlNoDataSourceInspection

import type { GetPageResponse } from "@hennigram/types/api/getPage"

import { AthenaExpress } from "athena-express"
import AWS from "aws-sdk"
import { PostMeta } from "@hennigram/types/PostMeta"

const query = `
    SELECT id,
    filename,
    contentType,
    dating,
    created,
    description,
    CAST(dimensions as JSON) as dimensions
    FROM posts ORDER BY dating DESC;
`.trim()

export async function queryPage({
    nextToken,
    queryExecutionId,
}: { nextToken?: string; queryExecutionId?: string } = {}): Promise<GetPageResponse> {
    const athenaExpress = new AthenaExpress({
        aws: AWS,
        s3: "s3://lamsal.de-athena-results/",
        db: "hennigram",
        formatJson: true,
        waitForResults: true,
    })

    const result = await athenaExpress.query({
        sql: query,
        pagination: 20,
        ...(nextToken && queryExecutionId
            ? {
                  NextToken: nextToken,
                  QueryExecutionId: queryExecutionId,
              }
            : {}),
    })

    return {
        pagination: {
            nextToken: result.NextToken,
            queryId: result.QueryExecutionId,
        },
        page: result.Items!.map(item => {
            const castedItem = item as Omit<PostMeta, "dimensions"> & { dimensions: string }
            const [width, height]: [number, number] = JSON.parse(castedItem.dimensions!)
            ;(item as any).dimensions = { width, height }

            return item as PostMeta
        }),
    }
}
