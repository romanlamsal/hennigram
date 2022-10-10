import { AccessType, BackendLambda } from "../base/BackendLambda"
import { Construct } from "constructs"
import { Stack } from "aws-cdk-lib"
import { HttpMethod } from "aws-cdk-lib/aws-lambda"
import { ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam"
import { Bucket } from "aws-cdk-lib/aws-s3"

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
            buckets: {
                assets: AccessType.Read,
            },
            api: {
                path: "/post-meta/{id}",
                method: HttpMethod.GET,
            },
        })

        const getPageLambda = new BackendLambda(this, "GetPage", {
            name: "getPage",
            tables: {
                postMetas: AccessType.Read,
            },
            buckets: {
                assets: AccessType.Read,
            },
            api: {
                path: "/post-meta",
                method: HttpMethod.GET,
            },
        })
        const athenaResultBucketArn = Bucket.fromBucketName(this, "AthenaBucket", "lamsal.de-athena-results").bucketArn
        getPageLambda.addToRolePolicy(
            new PolicyStatement({
                actions: ["s3:*"],
                resources: [athenaResultBucketArn, athenaResultBucketArn + "/*"],
            })
        )
        getPageLambda.role!.addManagedPolicy(
            ManagedPolicy.fromManagedPolicyArn(this, "AthenaAccess", "arn:aws:iam::aws:policy/service-role/AWSQuicksightAthenaAccess")
        )

        new BackendLambda(this, "PutPostMeta", {
            name: "putPostMeta",
            tables: {
                postMetas: AccessType.ReadWrite,
            },
            buckets: {
                assets: AccessType.ReadWrite,
            },
            api: {
                path: "/post-meta",
                method: HttpMethod.POST,
            },
        })

        new BackendLambda(this, "DeletePostMeta", {
            name: "deletePostMeta",
            tables: {
                postMetas: AccessType.ReadWrite,
            },
            buckets: {
                assets: AccessType.ReadWrite,
            },
            api: {
                path: "/post-meta/{id}",
                method: HttpMethod.DELETE,
            },
        })
    }
}
