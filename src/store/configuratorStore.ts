import { create } from 'zustand';

export type MetalType = '14W' | '14Y' | '14R' | '18W' | '18Y' | '18R';
export type GemstoneType = 'diamond' | 'ruby' | 'emerald' | 'sapphire';
export type GemShape = 'round' | 'princess' | 'cushion' | 'oval' | 'pear' | 'emerald';
export type RingSize = number;

interface ConfiguratorState {
  metal: MetalType;
  gemstone: GemstoneType;
  gemShape: GemShape;
  gemSize: number; // in carats
  ringSize: RingSize;
  
  // Setters
  setMetal: (metal: MetalType) => void;
  setGemstone: (gemstone: GemstoneType) => void;
  setGemShape: (shape: GemShape) => void;
  setGemSize: (size: number) => void;
  setRingSize: (size: RingSize) => void;
  
  // Price
  basePrice: number;
  totalPrice: number;
}

const calculatePrice = (metal: MetalType, size: number) => {
  let price = 1500; // Base setting price
  
  if (metal.startsWith('18')) price += 500;
  else price += 200; // 14k prices
  
  // Simple mock calculation for diamond based on carat size
  price += Math.pow(size, 2) * 4500; 
  
  return price;
};

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  metal: '14W',
  gemstone: 'diamond',
  gemShape: 'round',
  gemSize: 1.0,
  ringSize: 6,
  
  basePrice: 1500,
  totalPrice: calculatePrice('14W', 1.5),
  
  setMetal: (metal) => set((state) => ({ 
    metal, 
    totalPrice: calculatePrice(metal, state.gemSize) 
  })),
  
  setGemstone: (gemstone) => set({ gemstone }),
  
  setGemShape: (gemShape) => set({ gemShape }),
  
  setGemSize: (gemSize) => set((state) => ({ 
    gemSize, 
    totalPrice: calculatePrice(state.metal, gemSize) 
  })),
  
  setRingSize: (ringSize) => set({ ringSize }),
}));
