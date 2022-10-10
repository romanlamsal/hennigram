declare module "aws-lambda/handler" {
    export interface ClientContextEnv {
        ASSETS_BUCKET: string
        POSTS_TABLE: string
        POSTS_TABLE_DATED_INDEX: string
        ATHENA_WORKGROUP: string
    }
}

declare module "athena-express" {
    interface QueryObjectInterface {
        db?: string
        pagination?: number
        NextToken?: string
        QueryExecutionId?: string
        catalog?: string
    }
}

export default {}
