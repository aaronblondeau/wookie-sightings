import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { S3ClientConfig } from "@aws-sdk/client-s3/dist-types/S3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export function getClient() {
  const s3ClientConfig = {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || "",
      secretAccessKey: process.env.S3_SECRET_KEY || "",
    },
    region: process.env.S3_REGION || "us-east-1",
  } as S3ClientConfig;
  if (process.env.S3_ENDPOINT) {
    // Only useful for MINIO or other S3 compatible services
    // s3ClientConfig.forcePathStyle = true // for Minio?
    s3ClientConfig.forcePathStyle = false; // for DO Spaces
    s3ClientConfig.endpoint = process.env.S3_ENDPOINT;
  }
  const s3ClientClient = new S3Client(s3ClientConfig);
  return s3ClientClient;
}

export async function uploadFile(
  bucket: string,
  fileKey: string,
  body: File | Buffer,
  contentType: string
) {
  const client = getClient();
  const upload = new Upload({
    client: client,
    params: {
      Bucket: bucket,
      Key: fileKey, // Or a generated key
      Body: body,
      ContentType: contentType,
    },
  });
  await upload.done();
}

export async function generatePresignedUrlForUpload(
  bucket: string,
  fileKey: string,
  contentType: string,
  expiresInSeconds: number = 3600 // Default to 1 hour
): Promise<string> {
  const client = getClient();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileKey,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(client, command, {
    expiresIn: expiresInSeconds,
  });

  return presignedUrl;
}
