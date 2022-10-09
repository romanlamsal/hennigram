import { Code, Function, FunctionProps, HttpMethod, Runtime } from "aws-cdk-lib/aws-lambda"
import { Construct } from "constructs"
import { apiStack, globals } from "../../bin/cdk"
import * as path from "path"
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway"

const backendDistPath = path.join(__dirname, "../../../backend/dist")

export enum AccessType {
    Read = "R",
    Write = "W",
    ReadWrite = "RW",
}

type DefaultedPropKeys = Extract<keyof FunctionProps, "runtime" | "functionName" | "code" | "handler">

type DefaultedProps = Omit<FunctionProps, DefaultedPropKeys> & Partial<Pick<FunctionProps, DefaultedPropKeys>>

export type BackendLambdaProps = DefaultedProps & {
    name: string
    tables?: {
        orders?: AccessType
    }
    util?: {
        mailing?: boolean
    }
    api?: {
        path: string
        method: HttpMethod
        authorizer?: boolean
    }
}

export class BackendLambda extends Function {
    constructor(scope: Construct, id: string, { tables, util, name, api, ...lambdaProps }: BackendLambdaProps) {
        super(scope, id, {
            runtime: Runtime.NODEJS_16_X,
            functionName: name.replace("Handler", "Lambda"),
            code: Code.fromAsset(backendDistPath),
            handler: "handler." + name,
            ...lambdaProps,
        })

        this.addTables(tables)
        this.addUtil(util)

        if (api) {
            apiStack.apiGateway.root.resourceForPath(api.path).addMethod(api.method, new LambdaIntegration(this), {
                authorizer: api.authorizer ? apiStack.sessionAuthorizer : undefined,
            })
        }
    }

    addTables(tables?: BackendLambdaProps["tables"]) {
        if (!tables) {
            return
        }

        if (tables.orders) {
            this.addEnvironment("POSTS_TABLE", globals.orderTable.tableName)
            this.addEnvironment("POSTS_TABLE_DATED_INDEX", "dating")
            switch (tables.orders) {
                case AccessType.Read:
                    globals.orderTable.grantReadData(this)
                    break
                case AccessType.Write:
                    globals.orderTable.grantWriteData(this)
                    break
                case AccessType.ReadWrite:
                    globals.orderTable.grantReadWriteData(this)
                    break
            }
        }
    }

    addUtil(util?: BackendLambdaProps["util"]) {
        if (!util) {
            return
        }

        if (util.mailing) {
            this.addEnvironment("MAIL_USER", "traesontickets@lamsal.de")
            this.addEnvironment("MAIL_PASS", "TraesonTickets123")
        }
    }
}
