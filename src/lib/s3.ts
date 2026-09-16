
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const region = process.env.AWS_REGION || 'eu-north-1';
const bucketName = process.env.AWS_S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

export const isS3Configured = (): boolean => {
  return Boolean(bucketName && accessKeyId && secretAccessKey);
};

export const s3Client = isS3Configured()
  ? new S3Client({
    region,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
  })
  : null;

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.glb':
      return 'model/gltf-binary';
    case '.gltf':
      return 'model/gltf+json';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    case '.hdr':
      return 'application/octet-stream';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Uploads a file to AWS S3 if configured, otherwise falls back to local storage.
 * @param file - The File instance to upload
 * @param folder - Destination folder, e.g. 'models' or 'thumbnails'
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(file: File, folder: 'models' | 'thumbnails' = 'thumbnails'): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;

  // If AWS S3 is configured, upload directly to S3
  if (isS3Configured() && s3Client && bucketName) {
    const key = `${folder}/${cleanFileName}`;
    const contentType = file.type || getContentType(file.name);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    // Form the standard AWS S3 object URL
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  }

  // Graceful fallback to local public/uploads directory if AWS S3 is not yet configured
  const localDir = path.join(process.cwd(), 'public/uploads', folder);
  await mkdir(localDir, { recursive: true });
  const localFilePath = path.join(localDir, cleanFileName);
  await writeFile(localFilePath, buffer);

  return `/uploads/${folder}/${cleanFileName}`;
}

/**
 * Deletes a file from AWS S3 if it resides in the S3 bucket.
 * @param fileUrl - The public URL of the file
 */
export async function deleteFile(fileUrl?: string | null): Promise<void> {
  if (!fileUrl || !isS3Configured() || !s3Client || !bucketName) return;

  try {
    const s3Prefix = `https://${bucketName}.s3.${region}.amazonaws.com/`;
    if (fileUrl.startsWith(s3Prefix)) {
      const key = fileUrl.replace(s3Prefix, '');
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: key,
        })
      );
    }
  } catch (error) {
    console.error('Failed to delete S3 file:', error);
  }
}

/**
 * Generates a presigned URL allowing the browser to upload a file directly to AWS S3.
 * Completely avoids Vercel's 4.5MB serverless payload limit.
 */
export async function getPresignedUploadUrl(
  fileName: string,
  fileType: string,
  folder: 'models' | 'thumbnails' = 'thumbnails'
): Promise<{ uploadUrl: string; publicUrl: string; key: string; contentType: string } | null> {
  if (!isS3Configured() || !s3Client || !bucketName) {
    return null;
  }

  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
  const cleanFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
  const key = `${folder}/${cleanFileName}`;
  const contentType = fileType || getContentType(fileName);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

  return { uploadUrl, publicUrl, key, contentType };
}
