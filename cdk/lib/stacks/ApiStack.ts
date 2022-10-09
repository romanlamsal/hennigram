import { App, Stack } from "aws-cdk-lib"
import { Authorizer, EndpointType, IdentitySource, MethodLoggingLevel, RequestAuthorizer, RestApi } from "aws-cdk-lib/aws-apigateway"
import { BackendLambda } from "../base/BackendLambda"

export class ApiStack extends Stack {
    static StageName = "api"

    apiGateway: RestApi
    sessionAuthorizer: Authorizer

    constructor(app: App) {
        super(app, "ApiGateway")

        this.apiGateway = new RestApi(this, "ApiGateway", {
            restApiName: "HennigramAPI",
            endpointConfiguration: {
                types: [EndpointType.REGIONAL],
            },
            cloudWatchRole: true,
            deployOptions: {
                loggingLevel: MethodLoggingLevel.INFO,
                stageName: ApiStack.StageName,
            },
        })

        this.sessionAuthorizer = new RequestAuthorizer(this, "SessionAuthorizer", {
            handler: new BackendLambda(this, "/Lambda", {
                name: "sessionAuthorizerHandler",
            }),
            identitySources: [IdentitySource.header("Cookie")],
        })
    }
}
