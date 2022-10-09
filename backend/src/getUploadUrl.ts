import { APIGatewayProxyHandler } from "aws-lambda"
import { v4 } from "uuid"
import { S3 } from "aws-sdk"
import { PutObjectRequest } from "aws-sdk/clients/s3"
import { GetUploadUrlResponse } from "@hennigram/types/api/getUploadUrl"

export const getUploadUrl: APIGatewayProxyHandler = async event => {
    const { fileName, fileType } = JSON.parse(event.body || "{}") as { fileName: string; fileType: string }

    if (!fileName || !fileType) {
        return {
            statusCode: 400,
            body: `No filename or filetype provided: ${fileName}, ${fileType}`,
        }
    }

    const postId = v4()

    const response: GetUploadUrlResponse = {
        url: new S3().getSignedUrl("putObject", {
            Bucket: process.env.ASSETS_BUCKET!,
            Key: "assets/" + postId + "/" + fileName,
            ContentType: fileType,
        } as PutObjectRequest),
        postId,
    }
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
    }
}
