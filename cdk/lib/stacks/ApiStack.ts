import { App, Stack } from "aws-cdk-lib"
import { Authorizer, EndpointType, MethodLoggingLevel, RestApi } from "aws-cdk-lib/aws-apigateway"

export class ApiStack extends Stack {
    static StageName = "api"

    apiGateway: RestApi
    sessionAuthorizer: Authorizer

    constructor(app: App) {
        super(app, "ApiGateway", { stackName: "HennigramApi" })

        this.apiGateway = new RestApi(this, "ApiGateway", {
            restApiName: "HennigramApi",
            endpointConfiguration: {
                types: [EndpointType.REGIONAL],
            },
            cloudWatchRole: true,
            deployOptions: {
                loggingLevel: MethodLoggingLevel.INFO,
                stageName: ApiStack.StageName,
            },
        })

        /*this.sessionAuthorizer = new RequestAuthorizer(this, "SessionAuthorizer", {
            handler: new BackendLambda(this, "/Lambda", {
                name: "sessionAuthorizerHandler",
            }),
            identitySources: [IdentitySource.header("Cookie")],
        })*/
    }
}
