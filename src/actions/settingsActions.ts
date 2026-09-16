'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
  try {
    let settings = await prisma.systemSettings.findUnique({
      where: { id: 'global' },
    });

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          id: 'global',
          goldPrice24k: 7000,
          silverPrice: 90,
          platinumPrice: 3000,
          palladiumPrice: 3000,
          diamondPrice: 32000,
          makingChargePerGram: 2000,
        },
      });
    }

    return settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return { 
      goldPrice24k: 7000,
      silverPrice: 90,
      platinumPrice: 3000,
      palladiumPrice: 3000,
      diamondPrice: 32000,
      makingChargePerGram: 2000,
    }; 
  }
}

export async function updateGoldPrice(formData: FormData) {
  try {
    const goldPrice24k = parseFloat(formData.get('goldPrice24k') as string) || 7000;
    const silverPrice = parseFloat(formData.get('silverPrice') as string) || 90;
    const platinumPrice = parseFloat(formData.get('platinumPrice') as string) || 3000;
    const palladiumPrice = parseFloat(formData.get('palladiumPrice') as string) || 3000;
    const diamondPrice = parseFloat(formData.get('diamondPrice') as string) || 32000;
    const makingChargePerGram = parseFloat(formData.get('makingChargePerGram') as string) || 2000;
    
    if (isNaN(goldPrice24k) || goldPrice24k <= 0) {
      return { error: 'Invalid gold price' };
    }

    const settings = await prisma.systemSettings.upsert({
      where: { id: 'global' },
      update: {
        goldPrice24k,
        silverPrice,
        platinumPrice,
        palladiumPrice,
        diamondPrice,
        makingChargePerGram,
      },
      create: {
        id: 'global',
        goldPrice24k,
        silverPrice,
        platinumPrice,
        palladiumPrice,
        diamondPrice,
        makingChargePerGram,
      },
    });

    revalidatePath('/admin/settings');
    revalidatePath('/collection');
    return { success: true, settings };
  } catch (error) {
    console.error('Error updating settings:', error);
    return { error: 'Failed to update gold price' };
  }
}
