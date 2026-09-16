'use server';

import { getPresignedUploadUrl, isS3Configured } from '@/lib/s3';

export async function getPresignedUrlAction(
  fileName: string,
  fileType: string,
  folder: 'models' | 'thumbnails' = 'thumbnails'
) {
  try {
    if (!isS3Configured()) {
      return { data: null };
    }

    const data = await getPresignedUploadUrl(fileName, fileType, folder);
    return { data };
  } catch (error: any) {
    console.error('Failed to generate presigned S3 upload URL:', error);
    return { error: error?.message || 'Failed to generate upload URL' };
  }
}
