'use client';
import React from 'react';
import { useConfiguratorStore, MetalType, GemstoneType } from '@/store/configuratorStore';
import { Check, Info, Heart, Share, Gem } from 'lucide-react';
import { calculateDynamicPrice } from '@/lib/pricing';

const METALS: { id: MetalType; label: string; color: string }[] = [
  { id: '14W', label: '14K White Gold', color: '#D8D8D8' },
  { id: '14Y', label: '14K Yellow Gold', color: '#c6a86c' },
  { id: '14R', label: '14K Rose Gold', color: '#e1b7a1' },
  { id: '18W', label: '18K White Gold', color: '#E0E0E0' },
  { id: '18Y', label: '18K Yellow Gold', color: '#c6a86c' },
  { id: '18R', label: '18K Rose Gold', color: '#e1b7a1' },
];

const GEMSTONES: { id: GemstoneType; label: string; color: string }[] = [
  { id: 'diamond', label: 'Diamond', color: '#FFFFFF' },
  // { id: 'ruby', label: 'Ruby', color: '#E0115F' },
  // { id: 'emerald', label: 'Emerald', color: '#50C878' },
  // { id: 'sapphire', label: 'Sapphire', color: '#0F52BA' },
];

export function ConfiguratorPanel({ 
  productName,
  basePrice = 0,
  weightInGrams = 0,
  settings
}: { 
  productName?: string;
  basePrice?: number;
  weightInGrams?: number;
  settings?: any;
}) {
  const { 
    metal, setMetal, 
    gemstone, setGemstone,
    gemSize, setGemSize,
    ringSize, setRingSize
  } = useConfiguratorStore();

  let displayPrice = 0;
  if (settings) {
    displayPrice = calculateDynamicPrice({
      basePrice,
      weightInGrams,
      metalCode: metal,
      gemSize,
      settings
    });
  }

  return (
    <div className="w-full flex flex-col gap-8 bg-white p-2">
      {/* Title & Price */}
      <div>
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-3xl md:text-[32px] font-serif text-[#2c2c2c] tracking-tight pr-4 leading-tight">{productName || 'Design Your Ring'}</h1>
          <div className="flex gap-4 text-gray-400 pt-1 shrink-0">
            <button className="hover:text-[#163f35] transition-colors"><Heart size={20} strokeWidth={1.5} /></button>
            <button className="hover:text-[#163f35] transition-colors"><Share size={20} strokeWidth={1.5} /></button>
          </div>
        </div>
        <div className="text-2xl font-serif text-[#163f35] tracking-wide">₹{displayPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
        <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1.5"><Info size={12}/> Price includes setting and center diamond.</p>
      </div>
      
      {/* 1. Metal Selector */}
      <div className="space-y-4 border-t border-gray-200 pt-8 mt-2">
        <div className="flex justify-between items-baseline mb-2">
           <h3 className="text-[11px] font-bold text-[#2c2c2c] uppercase tracking-[0.15em]">1. Choose Metal</h3>
           <p className="text-[11px] text-[#163f35] font-semibold">{METALS.find(m => m.id === metal)?.label}</p>
        </div>
        
        <div className="flex gap-3">
          {METALS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMetal(m.id)}
              className={`w-11 h-11 rounded-full border-[1.5px] flex items-center justify-center transition-all ${
                metal === m.id ? 'border-[#163f35] ring-2 ring-offset-2 ring-[#163f35]/20' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div 
                className="w-8 h-8 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]" 
                style={{ backgroundColor: m.color }}
              >
                {metal === m.id && <Check className="w-[14px] h-[14px] mx-auto mt-2 text-[#163f35] mix-blend-difference" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Gemstone Selector */}
      <div className="space-y-4 border-t border-gray-200 pt-8 mt-2">
        <div className="flex justify-between items-baseline mb-2">
           <h3 className="text-[11px] font-bold text-[#2c2c2c] uppercase tracking-[0.15em]">2. Choose Gemstone</h3>
           <p className="text-[11px] text-[#163f35] font-semibold">{GEMSTONES.find(g => g.id === gemstone)?.label}</p>
        </div>
        
        <div className="flex gap-3">
          {GEMSTONES.map((g) => (
            <button
              key={g.id}
              onClick={() => setGemstone(g.id)}
              className={`w-11 h-11 rounded-full border-[1.5px] flex items-center justify-center transition-all ${
                gemstone === g.id ? 'border-[#163f35] ring-2 ring-offset-2 ring-[#163f35]/20' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div 
                className="w-8 h-8 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] flex items-center justify-center" 
                style={{ backgroundColor: g.color }}
              >
                {gemstone === g.id ? (
                  <Check className={`w-[14px] h-[14px] ${g.id === 'diamond' ? 'text-black' : 'text-white'}`} />
                ) : (
                  <Gem className={`w-[14px] h-[14px] ${g.id === 'diamond' ? 'text-gray-400' : 'text-white/70'}`} />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Carat Size */}
      <div className="space-y-4 border-t border-gray-200 pt-8 mt-2">
        <div className="flex justify-between items-baseline mb-4">
           <h3 className="text-[11px] font-bold text-[#2c2c2c] uppercase tracking-[0.15em]">3. Carat Size</h3>
           <span className="text-[11px] text-[#163f35] font-semibold">{gemSize.toFixed(2)} Carat</span>
        </div>
        <div className="pt-2 px-1">
          <input 
            type="range" 
            min="0.5" max="2.0" step="0.5" 
            value={gemSize}
            onChange={(e) => setGemSize(parseFloat(e.target.value))}
            className="w-full accent-[#163f35] cursor-pointer h-1 bg-gray-200 rounded-lg appearance-none"
          />
        </div>
        <div className="flex justify-between text-[10px] font-medium text-gray-400 px-1">
          <span>0.5ct</span>
          <span>1.0ct</span>
          <span>1.5ct</span>
          <span>2.0ct</span>
        </div>
      </div>

      {/* 4. Ring Size */}
      <div className="space-y-4 border-t border-gray-200 pt-8 mt-2">
        <div className="flex justify-between items-baseline mb-4">
           <h3 className="text-[11px] font-bold text-[#2c2c2c] uppercase tracking-[0.15em]">4. Ring Size</h3>
           <a href="#" className="text-[10px] text-gray-500 underline underline-offset-2 hover:text-black">Size Guide</a>
        </div>
        <select 
          value={ringSize}
          onChange={(e) => setRingSize(parseFloat(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-sm bg-white text-[#333] text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#163f35] focus:border-[#163f35] cursor-pointer shadow-sm"
        >
          {[4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8].map(size => (
            <option key={size} value={size}>US Size {size}</option>
          ))}
        </select>
      </div>

      {/* Action Button */}
      <div className="mt-8 pt-4">
        <button className="w-full py-4 bg-[#163f35] text-white rounded-sm uppercase tracking-[0.2em] text-[12px] font-bold hover:bg-[#0f2c25] transition-colors shadow-md hover:shadow-lg active:scale-[0.99]">
          Add to Bag
        </button>
        <div className="text-center mt-5 text-[10px] text-gray-500 tracking-widest uppercase flex items-center justify-center gap-2">
          <span>Free Shipping</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>30-Day Returns</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>Lifetime Warranty</span>
        </div>
      </div>
    </div>
  );
}
