import { Athena } from "aws-sdk"
import { setTimeout } from "timers/promises"
import { PostMeta } from "@hennigram/types/PostMeta"
import { queryPage } from "../query-page"

const athena = new Athena()

const createTableQuery = `CREATE EXTERNAL TABLE hennigram_posts (
    id string,
    filename string,
    contentType string,
    dimensions struct<
        width:INT,
        height:INT
    >,
    dating string,
    created string,
    description string
)
ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
LOCATION 's3://hennigram-assets.lamsal.de/data';`

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
export async function doquery() {
    const queryExecutionResult = await athena
        .startQueryExecution({
            QueryString: query,
            WorkGroup: "primary",
            QueryExecutionContext: {
                Database: "hennigram",
            },
            ResultConfiguration: {
                OutputLocation: "s3://lamsal.de-athena-results/",
            },
        })
        .promise()

    let timeout = 10_000 // 10s
    while (timeout > 0) {
        const start = new Date().getTime()
        const queryExecutionState = await athena
            .getQueryExecution({
                QueryExecutionId: queryExecutionResult.QueryExecutionId!,
            })
            .promise()

        const currentState = queryExecutionState.QueryExecution!.Status?.State
        if (currentState === "FAILED" || currentState === "SUCCEEDED") {
            break
        }

        await setTimeout(100)

        timeout -= new Date().getTime() - start
    }

    const results = await athena
        .getQueryResults({
            QueryExecutionId: queryExecutionResult.QueryExecutionId!,
        })
        .promise()

    const [header, ...rows] = results.ResultSet!.Rows!

    const keys = header.Data!.map(head => head.VarCharValue) as (keyof PostMeta)[]

    return rows.map(row => {
        const obj: Partial<PostMeta> = {}

        row.Data!.forEach((data, index) => {
            const columnName = keys[index]
            if (columnName === "dimensions") {
                const [width, height] = JSON.parse(data.VarCharValue!)
                obj["dimensions"] = { width, height }
            } else {
                obj[columnName] = data.VarCharValue!
            }
        })

        return obj
    })
}

// doquery()

queryPage().then(res => console.log(JSON.stringify(res, null, 2)))
