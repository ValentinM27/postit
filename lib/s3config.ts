import * as AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

export const s3 = new AWS.S3({
  endpoint: process.env.ENDPOINT,
});

export const bucketName = process.env.BUCKET_NAME || "";

export interface S3UploadParams {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
}

export interface S3GetParams {
  Bucket: string;
  Key: string;
}
