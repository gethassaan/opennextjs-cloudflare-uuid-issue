import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "dotenv/config";

/**
 *
 * this constant should only be used inside api calls
 *
 */
export const s3Client = new S3Client({
  region: process.env.CLOUDFLARE_R2_REGION || "",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
});

/**
 *
 * this function should only be used inside api calls
 *
 */
export const getImageUrl = async (fileName: string) => {
  try {
    const command = new GetObjectCommand({
      Key: fileName.trim().toLowerCase().replace(/ /g, "-"),
      Bucket: process.env.CLOUDFLARE_R2_BUCKET || "",
      ResponseExpires: new Date(Date.now() + 3600),
    });
    const presignedUrl = await getSignedUrl(s3Client, command);

    return presignedUrl;
  } catch (error) {
    console.log({ error });
    throw new Error("Failed to get image");
  }
};
