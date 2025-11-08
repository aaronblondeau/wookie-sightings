import { app } from "../../_server/app";
import {
  generatePresignedUrlForUpload,
  uploadFile,
} from "../../../lib/getS3Client";

export interface FileUpload {
  key: string;
  bucket: string;
}

function parseDataUrl(dataUrl: string): { data: Buffer; contentType: string } {
  const parts = dataUrl.split(",");
  const meta = parts[0];
  const base64Data = parts[1];

  const contentTypeMatch = meta.match(/data:([^;]+)/);
  const contentType = contentTypeMatch
    ? contentTypeMatch[1]
    : "application/octet-stream";

  const data = Buffer.from(base64Data, "base64");
  return { data, contentType };
}

// https://kottster.app/docs/table/configuration/api#custom-server-api
const controller = app.defineTableController(
  {},
  {
    urlForKey: async (input): Promise<string> => {
      return process.env.VITE_S3_CDN_URL + "/" + input.key;
    },
    getFileUploadUrl: async (input): Promise<{ key: string; url: string }> => {
      if (!input.sightingId) {
        throw new Error("sighting id must be provided");
      }
      if (!input.name) {
        throw new Error("name must be provided");
      }
      if (!input.contentType) {
        throw new Error("contentType must be provided");
      }
      if (!process.env.S3_BUCKET) {
        throw new Error("S3_BUCKET is not configured");
      }

      const uuid = crypto.randomUUID();
      const fileName = `${uuid}_${input.name}`;
      const fileKey = `sightings/${input.sightingId}/${fileName}`;

      const url = await generatePresignedUrlForUpload(
        process.env.S3_BUCKET,
        fileKey,
        input.contentType
      );

      return { key: fileKey, url };
    },
    uploadFile: async (input): Promise<FileUpload> => {
      if (!input.sightingId) {
        throw new Error("sighting id must be provided");
      }
      if (!process.env.S3_BUCKET) {
        throw new Error("S3_BUCKET is not configured");
      }

      const uuid = crypto.randomUUID();
      const fileName = `${uuid}_${input.name}`;
      const fileKey = `sightings/${input.sightingId}/${fileName}`;

      const parsedFile = parseDataUrl(input.data);
      await uploadFile(
        process.env.S3_BUCKET,
        fileKey,
        parsedFile.data,
        parsedFile.contentType
      );

      return {
        key: fileKey,
        bucket: process.env.S3_BUCKET,
      };
    },
  }
);

// The Procedures type can be used on the frontend
// to get type-safety when calling server procedures.
export type Procedures = typeof controller.procedures;

export default controller;
