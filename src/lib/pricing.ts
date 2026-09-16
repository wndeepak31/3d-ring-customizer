/**
 * Calculates the exact dynamic price of a product based on metal type, product weight, and global settings.
 * 
 * Logic:
 * 1. Base weight is assumed to be 18K.
 * 2. Calculate actual weight for the selected metal using Specific Gravity.
 * 3. Calculate metal cost (Actual Weight * Metal Rate).
 * 4. Calculate making charge (Actual Weight * Making Charge Per Gram).
 * 5. Add fixed Diamond Cost.
 * 6. Add any fixed basePrice entered on the product (if any).
 */

export function calculateDynamicPrice({
  basePrice = 0,
  weightInGrams = 0,
  metalCode = '18K',
  gemSize = 1.0,
  settings
}: {
  basePrice?: number;
  weightInGrams?: number;
  metalCode?: string;
  gemSize?: number;
  settings: {
    goldPrice24k: number;
    silverPrice: number;
    platinumPrice: number;
    palladiumPrice: number;
    diamondPrice: number;
    makingChargePerGram: number;
  }
}) {
  const diamondCost = settings.diamondPrice * gemSize;
  const base = basePrice > 0 ? basePrice : 0;

  if (weightInGrams <= 0) {
    return base + diamondCost;
  }

  // Specific Gravities
  const sg18K = 15.5;
  let targetSG = sg18K;
  let metalRatePerGram = 0;

  // Determine Target SG and Metal Rate
  if (metalCode.includes('14')) {
    targetSG = 13.4;
    metalRatePerGram = settings.goldPrice24k * 0.583;
  } else if (metalCode.includes('18')) {
    targetSG = 15.5;
    metalRatePerGram = settings.goldPrice24k * 0.750;
  } else if (metalCode.includes('22')) {
    targetSG = 17.7;
    metalRatePerGram = settings.goldPrice24k * 0.916;
  } else if (metalCode.includes('24')) {
    targetSG = 19.32;
    metalRatePerGram = settings.goldPrice24k;
  } else if (metalCode === 'PLAT' || metalCode.includes('PT')) {
    targetSG = 21.4;
    metalRatePerGram = settings.platinumPrice;
  } else if (metalCode === 'SILVER') {
    targetSG = 10.49;
    metalRatePerGram = settings.silverPrice;
  } else if (metalCode === 'PALLADIUM') {
    targetSG = 12.0;
    metalRatePerGram = settings.palladiumPrice;
  } else {
    // Fallback to 18K
    targetSG = sg18K;
    metalRatePerGram = settings.goldPrice24k * 0.750;
  }

  // Calculate actual weight based on SG ratio
  const actualWeight = weightInGrams * (targetSG / sg18K);

  // Costs
  const metalCost = actualWeight * metalRatePerGram;
  const makingCost = actualWeight * settings.makingChargePerGram;

  // If basePrice is > 0, we add it. Otherwise just the calculated costs.
  return base + metalCost + makingCost + diamondCost;
}
