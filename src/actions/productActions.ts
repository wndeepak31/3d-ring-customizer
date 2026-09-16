'use server'

import { prisma } from '@/lib/prisma';
import slugify from 'slugify';
import { revalidatePath } from 'next/cache';
import { uploadFile, deleteFile } from '@/lib/s3';

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const sku = formData.get('sku') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const glbFile = formData.get('glbFile') as File;
  const thumbnailFile = formData.get('thumbnailFile') as File | null;
  const price = parseFloat((formData.get('price') as string) || '0');
  const weight = parseFloat((formData.get('weight') as string) || '0');
  const stock = parseInt((formData.get('stock') as string) || '0', 10);
  const metalType = formData.get('metalType') as string | null;
  const gemstone = formData.get('gemstone') as string | null;
  const isFeatured = formData.get('isFeatured') === 'on';
  const seoTitle = formData.get('seoTitle') as string | null;
  const seoDesc = formData.get('seoDesc') as string | null;
  const status = formData.get('status') as string || 'ACTIVE';
  const galleryFiles = formData.getAll('galleryFiles') as File[];
  const imageWhiteFile = formData.get('imageWhiteFile') as File | null;
  const imageYellowFile = formData.get('imageYellowFile') as File | null;
  const imageRoseFile = formData.get('imageRoseFile') as File | null;

  const glbUrlDirect = formData.get('glbUrl') as string | null;

  if (!name || !sku || (!glbFile && !glbUrlDirect)) {
    return { error: 'Name, SKU, and GLB file are required.' };
  }

  const slug = slugify(name, { lower: true, strict: true });

  try {
    // 1. Upload GLB 3D Model (or use direct S3 URL)
    let glbUrl = glbUrlDirect || '';
    if (!glbUrl && glbFile && glbFile.size > 0) {
      glbUrl = await uploadFile(glbFile, 'models');
    }

    if (!glbUrl) {
      return { error: 'GLB 3D model is required.' };
    }

    // 2. Upload Thumbnail if provided
    let thumbnailUrl: string | null = (formData.get('thumbnailUrl') as string) || null;
    if (!thumbnailUrl && thumbnailFile && thumbnailFile.size > 0) {
      thumbnailUrl = await uploadFile(thumbnailFile, 'thumbnails');
    }

    // 3. Upload Gallery Images
    const preGalleryUrls = (formData.getAll('galleryUrls') as string[]).filter(Boolean);
    const galleryUrls: string[] = [...preGalleryUrls];
    if (galleryFiles && galleryFiles.length > 0) {
      for (const file of galleryFiles) {
        if (file.size > 0) {
          const url = await uploadFile(file, 'thumbnails');
          galleryUrls.push(url);
        }
      }
    }

    // 4. Upload Specific Metal Images
    let imageWhite: string | null = (formData.get('imageWhite') as string) || null;
    let imageYellow: string | null = (formData.get('imageYellow') as string) || null;
    let imageRose: string | null = (formData.get('imageRose') as string) || null;

    if (!imageWhite && imageWhiteFile && imageWhiteFile.size > 0) {
      imageWhite = await uploadFile(imageWhiteFile, 'thumbnails');
    }
    if (!imageYellow && imageYellowFile && imageYellowFile.size > 0) {
      imageYellow = await uploadFile(imageYellowFile, 'thumbnails');
    }
    if (!imageRose && imageRoseFile && imageRoseFile.size > 0) {
      imageRose = await uploadFile(imageRoseFile, 'thumbnails');
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        category,
        description,
        price,
        weight,
        stock,
        metalType,
        gemstone,
        isFeatured,
        seoTitle,
        seoDesc,
        glbUrl,
        thumbnailUrl,
        imageWhite,
        imageYellow,
        imageRose,
        galleryUrls,
        status,
      }
    });
    
    revalidatePath('/admin/products');
    revalidatePath('/collection');
    return { success: true, product };
  } catch (error: any) {
    console.error('Upload Error:', error);
    return { error: error.message || 'Failed to create product. SKU might already exist.' };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const sku = formData.get('sku') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const glbFile = formData.get('glbFile') as File | null;
  const thumbnailFile = formData.get('thumbnailFile') as File | null;
  const price = parseFloat((formData.get('price') as string) || '0');
  const weight = parseFloat((formData.get('weight') as string) || '0');
  const stock = parseInt((formData.get('stock') as string) || '0', 10);
  const metalType = formData.get('metalType') as string | null;
  const gemstone = formData.get('gemstone') as string | null;
  const isFeatured = formData.get('isFeatured') === 'on';
  const seoTitle = formData.get('seoTitle') as string | null;
  const seoDesc = formData.get('seoDesc') as string | null;
  const status = formData.get('status') as string || 'ACTIVE';
  const galleryFiles = formData.getAll('galleryFiles') as File[];
  const imageWhiteFile = formData.get('imageWhiteFile') as File | null;
  const imageYellowFile = formData.get('imageYellowFile') as File | null;
  const imageRoseFile = formData.get('imageRoseFile') as File | null;

  if (!name || !sku) {
    return { error: 'Name and SKU are required.' };
  }

  const slug = slugify(name, { lower: true, strict: true });

  try {
    const dataToUpdate: any = {
      name,
      slug,
      sku,
      category,
      description,
      price,
      weight,
      stock,
      metalType,
      gemstone,
      isFeatured,
      seoTitle,
      seoDesc,
      status,
    };

    // Update GLB if provided (direct URL or file)
    const glbUrlDirect = formData.get('glbUrl') as string | null;
    if (glbUrlDirect) {
      dataToUpdate.glbUrl = glbUrlDirect;
    } else if (glbFile && glbFile.size > 0) {
      dataToUpdate.glbUrl = await uploadFile(glbFile, 'models');
    }

    // Update Thumbnail if provided (direct URL or file)
    const thumbnailUrlDirect = formData.get('thumbnailUrl') as string | null;
    if (thumbnailUrlDirect) {
      dataToUpdate.thumbnailUrl = thumbnailUrlDirect;
    } else if (thumbnailFile && thumbnailFile.size > 0) {
      dataToUpdate.thumbnailUrl = await uploadFile(thumbnailFile, 'thumbnails');
    }

    // Update Gallery if provided
    const preGalleryUrls = (formData.getAll('galleryUrls') as string[]).filter(Boolean);
    if (preGalleryUrls.length > 0) {
      dataToUpdate.galleryUrls = preGalleryUrls;
    } else if (galleryFiles && galleryFiles.length > 0 && galleryFiles[0].size > 0) {
      const galleryUrls: string[] = [];
      for (const file of galleryFiles) {
        if (file.size > 0) {
          const url = await uploadFile(file, 'thumbnails');
          galleryUrls.push(url);
        }
      }
      dataToUpdate.galleryUrls = galleryUrls;
    }

    // Update Specific Metal Images if provided (direct URL or file)
    const imageWhiteDirect = formData.get('imageWhite') as string | null;
    if (imageWhiteDirect) {
      dataToUpdate.imageWhite = imageWhiteDirect;
    } else if (imageWhiteFile && imageWhiteFile.size > 0) {
      dataToUpdate.imageWhite = await uploadFile(imageWhiteFile, 'thumbnails');
    }

    const imageYellowDirect = formData.get('imageYellow') as string | null;
    if (imageYellowDirect) {
      dataToUpdate.imageYellow = imageYellowDirect;
    } else if (imageYellowFile && imageYellowFile.size > 0) {
      dataToUpdate.imageYellow = await uploadFile(imageYellowFile, 'thumbnails');
    }

    const imageRoseDirect = formData.get('imageRose') as string | null;
    if (imageRoseDirect) {
      dataToUpdate.imageRose = imageRoseDirect;
    } else if (imageRoseFile && imageRoseFile.size > 0) {
      dataToUpdate.imageRose = await uploadFile(imageRoseFile, 'thumbnails');
    }

    const product = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });
    
    revalidatePath('/admin/products');
    revalidatePath('/collection');
    return { success: true, product };
  } catch (error: any) {
    console.error('Update Error:', error);
    return { error: error.message || 'Failed to update product. SKU might already exist.' };
  }
}

export async function deleteProduct(id: string) {
  try {
    // Optionally cleanup files from S3
    const existing = await prisma.product.findUnique({
      where: { id },
      select: {
        glbUrl: true,
        thumbnailUrl: true,
        imageWhite: true,
        imageYellow: true,
        imageRose: true,
        galleryUrls: true,
      }
    });

    if (existing) {
      await deleteFile(existing.glbUrl);
      await deleteFile(existing.thumbnailUrl);
      await deleteFile(existing.imageWhite);
      await deleteFile(existing.imageYellow);
      await deleteFile(existing.imageRose);
      for (const url of existing.galleryUrls || []) {
        await deleteFile(url);
      }
    }

    await prisma.product.delete({
      where: { id }
    });
    revalidatePath('/admin/products');
    revalidatePath('/collection');
    return { success: true };
  } catch (error: any) {
    console.error('Delete Error:', error);
    return { error: 'Failed to delete product.' };
  }
}

export async function toggleProductStatus(id: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const product = await prisma.product.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath('/admin/products');
    revalidatePath('/admin');
    revalidatePath('/collection');
    if (product.slug) {
      revalidatePath(`/product/${product.slug}`);
    }
    return { success: true, status: newStatus };
  } catch (error: any) {
    console.error('Toggle status error:', error);
    return { error: 'Failed to update product status.' };
  }
}
