import { App, Stack } from "aws-cdk-lib"
import { Table } from "../base/Table"
import { AttributeType } from "aws-cdk-lib/aws-dynamodb"
import { HostedZone, IHostedZone } from "aws-cdk-lib/aws-route53"
import { Bucket } from "aws-cdk-lib/aws-s3"

export class Globals extends Stack {
    readonly orderTable: Table
    readonly assetsBucket: Bucket

    readonly hostedZone: IHostedZone

    constructor(app: App) {
        super(app, "Globals")

        // manually created
        this.hostedZone = HostedZone.fromHostedZoneId(this, "DNS", "Z02569773OU5DLTUGCQLU")

        this.orderTable = new Table(this, "PostsV1", {
            tableName: "HennigramPostsV1",
            partitionKey: {
                name: "id",
                type: AttributeType.STRING,
            },
        })
        this.orderTable.addGlobalSecondaryIndex({
            indexName: "dating",
            partitionKey: {
                name: "dating",
                type: AttributeType.STRING,
            },
        })

        this.assetsBucket = new Bucket(this, "Assets", {
            bucketName: "assets.hennigram.lamsal.de",
        })
    }
}
