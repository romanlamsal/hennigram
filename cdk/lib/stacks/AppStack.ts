import { AccessType, BackendLambda } from "../base/BackendLambda"
import { Construct } from "constructs"
import { Stack } from "aws-cdk-lib"
import { HttpMethod } from "aws-cdk-lib/aws-lambda"

export class AppStack extends Stack {
    constructor(scope: Construct) {
        super(scope, "AppStack", { stackName: "HennigramApp" })

        new BackendLambda(this, "GetUploadUrl", {
            name: "getUploadUrl",
            buckets: {
                assets: AccessType.Write,
            },
            api: {
                path: "/upload",
                method: HttpMethod.POST,
            },
        })

        new BackendLambda(this, "GetPostMeta", {
            name: "getPostMeta",
            tables: {
                postMetas: AccessType.Read,
            },
            api: {
                path: "/post-meta/{id}",
                method: HttpMethod.GET,
            },
        })

        new BackendLambda(this, "GetPage", {
            name: "getPage",
            tables: {
                postMetas: AccessType.Read,
            },
            api: {
                path: "/post-meta",
                method: HttpMethod.GET,
            },
        })

        new BackendLambda(this, "PutPostMeta", {
            name: "putPostMeta",
            tables: {
                postMetas: AccessType.ReadWrite,
            },
            api: {
                path: "/post-meta",
                method: HttpMethod.POST,
            },
        })
    }
}
