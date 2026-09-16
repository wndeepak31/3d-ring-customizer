import { getPresignedUrlAction } from '@/actions/uploadActions';

/**
 * Uploads a file directly from the user's browser to AWS S3 using a presigned URL.
 * Bypasses Vercel's 4.5MB serverless payload limit so large 3D models and renders upload fast and without error.
 */
export async function uploadDirectToS3(
  file: File,
  folder: 'models' | 'thumbnails' = 'thumbnails'
): Promise<string | null> {
  try {
    const res = await getPresignedUrlAction(file.name, file.type, folder);

    if (res.data?.uploadUrl) {
      const { uploadUrl, publicUrl, contentType } = res.data;

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`S3 direct upload failed with status ${uploadResponse.status}`);
      }

      return publicUrl;
    }

    return null;
  } catch (error) {
    console.error('Direct S3 upload failed:', error);
    throw error;
  }
}
