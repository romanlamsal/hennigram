import { BillingMode, Table as DynamoTable, TableProps } from "aws-cdk-lib/aws-dynamodb"
import { Construct } from "constructs"

export class Table extends DynamoTable {
    constructor(scope: Construct, id: string, props: TableProps) {
        super(scope, id, {
            billingMode: BillingMode.PAY_PER_REQUEST,
            ...props,
        })
    }
}
