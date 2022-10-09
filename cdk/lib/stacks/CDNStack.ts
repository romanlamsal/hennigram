import { App, Duration, RemovalPolicy, Stack } from "aws-cdk-lib"
import { HttpOrigin, HttpOriginProps, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins"
import { IRestApi } from "aws-cdk-lib/aws-apigateway"
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3"
import {
    AllowedMethods,
    CacheCookieBehavior,
    CachedMethods,
    CacheHeaderBehavior,
    CachePolicy,
    CacheQueryStringBehavior,
    Distribution,
    OriginProtocolPolicy,
    OriginSslPolicy,
    ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront"
import { apiStack, globals } from "../../bin/cdk"
import { DnsValidatedCertificate } from "aws-cdk-lib/aws-certificatemanager"
import { ARecord, RecordTarget } from "aws-cdk-lib/aws-route53"
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets"

export class ApiGatewayOrigin extends HttpOrigin {
    constructor(apigateway: IRestApi, props: HttpOriginProps) {
        const { region } = Stack.of(apigateway)
        super(apigateway.restApiId + ".execute-api." + region + ".amazonaws.com", props)
    }
}

export class CDNStack extends Stack {
    constructor(app: App) {
        super(app, "CDN")

        const hostedZone = globals.hostedZone
        const apiGateway = apiStack.apiGateway

        const domainName = hostedZone.zoneName
        const frontendBucket = new Bucket(this, "Frontend", {
            bucketName: domainName,
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "index.html",
            accessControl: BucketAccessControl.PUBLIC_READ,
            removalPolicy: RemovalPolicy.DESTROY,
        })

        const apiGatewayOrigin = new ApiGatewayOrigin(apiGateway, {
            originPath: "/",
            originSslProtocols: [OriginSslPolicy.TLS_V1, OriginSslPolicy.TLS_V1_1, OriginSslPolicy.TLS_V1_2],
            protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
        })

        const certificate = new DnsValidatedCertificate(this, "CustomCloudfront", {
            domainName,
            hostedZone,
            region: "us-east-1",
        })

        const distro = new Distribution(this, "CDN", {
            defaultBehavior: {
                origin: new S3Origin(frontendBucket),
                allowedMethods: AllowedMethods.ALLOW_ALL,
                cachedMethods: CachedMethods.CACHE_GET_HEAD,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: new CachePolicy(this, "BucketOriginCachePolicy", {
                    queryStringBehavior: CacheQueryStringBehavior.all(),
                    cookieBehavior: CacheCookieBehavior.all(),
                }),
            },
            domainNames: [domainName],
            defaultRootObject: "index.html",
            certificate,
        })

        distro.addBehavior("/api/*", apiGatewayOrigin, {
            allowedMethods: AllowedMethods.ALLOW_ALL,
            cachedMethods: CachedMethods.CACHE_GET_HEAD,
            viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
            cachePolicy: new CachePolicy(this, "/CloudfrontCache", {
                cachePolicyName: "api",
                queryStringBehavior: CacheQueryStringBehavior.all(),
                cookieBehavior: CacheCookieBehavior.all(),
                headerBehavior: CacheHeaderBehavior.allowList("Cookie", "Cookies", "Origin", "CloudFront-Forwarded-Proto", "Referer"),
                minTtl: Duration.seconds(0),
                defaultTtl: Duration.seconds(0),
                maxTtl: Duration.seconds(10),
            }),
        })

        const assetsOrigin = new S3Origin(globals.assetsBucket)
        distro.addBehavior("/assets/*", assetsOrigin, {
            allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
            cachedMethods: CachedMethods.CACHE_GET_HEAD,
            viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
        })

        new ARecord(this, "DistributionAlias", {
            zone: hostedZone,
            recordName: domainName,
            target: RecordTarget.fromAlias(new CloudFrontTarget(distro)),
        })
    }
}
