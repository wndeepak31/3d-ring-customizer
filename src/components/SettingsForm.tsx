'use client';
import { useState, useEffect } from 'react';
import { updateGoldPrice } from '@/actions/settingsActions';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export default function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Main state for 24k gold
  const [gold24k, setGold24k] = useState(initialSettings?.goldPrice24k || 7000);
  
  // Auto-calculated states for display only
  const [gold22k, setGold22k] = useState(0);
  const [gold18k, setGold18k] = useState(0);
  const [gold14k, setGold14k] = useState(0);
  const [gold10k, setGold10k] = useState(0);

  // Other precious metals (stored in DB)
  const [silver, setSilver] = useState(initialSettings?.silverPrice || 90);
  const [platinum, setPlatinum] = useState(initialSettings?.platinumPrice || 3000);
  const [palladium, setPalladium] = useState(initialSettings?.palladiumPrice || 3000);
  const [diamondPrice, setDiamondPrice] = useState(initialSettings?.diamondPrice || 32000);
  const [makingCharge, setMakingCharge] = useState(initialSettings?.makingChargePerGram || 2000);

  // Live auto-calculate when 24k changes
  useEffect(() => {
    setGold22k(parseFloat((gold24k * 0.916).toFixed(4)));
    setGold18k(parseFloat((gold24k * 0.750).toFixed(4)));
    setGold14k(parseFloat((gold24k * 0.583).toFixed(4)));
    setGold10k(parseFloat((gold24k * 0.417).toFixed(4)));
  }, [gold24k]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    const formData = new FormData();
    formData.append('goldPrice24k', gold24k.toString());
    formData.append('silverPrice', silver.toString());
    formData.append('platinumPrice', platinum.toString());
    formData.append('palladiumPrice', palladium.toString());
    formData.append('diamondPrice', diamondPrice.toString());
    formData.append('makingChargePerGram', makingCharge.toString());

    const result = await updateGoldPrice(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-100 max-w-5xl overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-100 p-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex space-x-3">
          <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-500 border border-gray-200">Billing</span>
          <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-500 border border-gray-200 flex items-center">
            Resources <span className="ml-1 text-[10px]">▼</span>
          </span>
        </div>
      </div>
      
      <div className="p-8">
        <div className="bg-blue-50/50 border border-blue-100 text-blue-800 text-sm p-4 rounded-lg flex items-start mb-8">
          <span className="mr-3 bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs mt-0.5">i</span>
          Automated Price Updation is enabled. The product prices will be updated instantly based on these rates.
        </div>
        
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-100">⚠️ {error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm font-bold flex items-center border border-green-100"><CheckCircle2 className="w-5 h-5 mr-2" /> Prices updated successfully!</div>}
        
        <form onSubmit={handleSubmit}>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Metal Prices</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            
            {/* 24K Gold (Master) */}
            <div className="col-span-1">
              <label className="block text-[11px] font-bold text-gray-600 mb-2">Gold Price 24K / Gram <span className="text-red-500">*</span></label>
              <div className="relative flex items-center">
                <input 
                  type="number" step="0.0001"
                  value={gold24k} 
                  onChange={(e) => setGold24k(parseFloat(e.target.value) || 0)}
                  required 
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                />
                <span className="absolute right-3 text-xs font-bold text-gray-400">INR</span>
              </div>
            </div>

            {/* 22K Gold (Calculated) */}
            <div className="col-span-1">
              <label className="block text-[11px] font-bold text-gray-600 mb-2">Gold Price 22K / Gram</label>
              <div className="relative flex items-center opacity-75">
                <input 
                  type="number" readOnly value={gold22k}
                  className="block w-full bg-gray-50 border border-gray-200 rounded-md py-2 px-3 text-sm text-gray-600 focus:outline-none cursor-not-allowed" 
                />
                <span className="absolute right-3 text-xs font-bold text-gray-400">INR</span>
              </div>
            </div>

            {/* 18K Gold (Calculated) */}
            <div className="col-span-1">
              <label className="block text-[11px] font-bold text-gray-600 mb-2">Gold Price 18K / Gram</label>
              <div className="relative flex items-center opacity-75">
                <input 
                  type="number" readOnly value={gold18k}
                  className="block w-full bg-gray-50 border border-gray-200 rounded-md py-2 px-3 text-sm text-gray-600 focus:outline-none cursor-not-allowed" 
                />
                <span className="absolute right-3 text-xs font-bold text-gray-400">INR</span>
              </div>
            </div>

            {/* 14K Gold (Calculated) */}
            <div className="col-span-1">
              <label className="block text-[11px] font-bold text-gray-600 mb-2">Gold Price 14K / Gram</label>
              <div className="relative flex items-center opacity-75">
                <input 
                  type="number" readOnly value={gold14k}
                  className="block w-full bg-gray-50 border border-gray-200 rounded-md py-2 px-3 text-sm text-gray-600 focus:outline-none cursor-not-allowed" 
                />
                <span className="absolute right-3 text-xs font-bold text-gray-400">INR</span>
              </div>
            </div>

            {/* 10K Gold (Calculated) */}
            <div className="col-span-1">
              <label className="block text-[11px] font-bold text-gray-600 mb-2">Gold Price 10K / Gram</label>
              <div className="relative flex items-center opacity-75">
                <input 
                  type="number" readOnly value={gold10k}
                  className="block w-full bg-gray-50 border border-gray-200 rounded-md py-2 px-3 text-sm text-gray-600 focus:outline-none cursor-not-allowed" 
                />
                <span className="absolute right-3 text-xs font-bold text-gray-400">INR</span>
              </div>
            </div>

            {/* Silver */}
            <div className="col-span-1">
              <label className="block text-[11px] font-bold text-gray-600 mb-2">Silver Price / Gram</label>
              <div className="relative flex items-center">
                <input 
                  type="number" step="0.0001"
                  value={silver} 
                  onChange={(e) => setSilver(parseFloat(e.target.value) || 0)}
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                />
                <span className="absolute right-3 text-xs font-bold text-gray-400">INR</span>
              </div>
            </div>

            {/* Platinum */}
            <div className="col-span-1">
              <label className="block text-[11px] font-bold text-gray-600 mb-2">Platinum Price / Gram</label>
              <div className="relative flex items-center">
                <input 
                  type="number" step="0.0001"
                  value={platinum} 
                  onChange={(e) => setPlatinum(parseFloat(e.target.value) || 0)}
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                />
                <span className="absolute right-3 text-xs font-bold text-gray-400">INR</span>
              </div>
            </div>

            {/* Palladium */}
            <div className="col-span-1">
              <label className="block text-[11px] font-bold text-gray-600 mb-2">Palladium Price / Gram</label>
              <div className="relative flex items-center">
                <input 
                  type="number" step="0.0001"
                  value={palladium} 
                  onChange={(e) => setPalladium(parseFloat(e.target.value) || 0)}
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                />
                <span className="absolute right-3 text-xs font-bold text-gray-400">INR</span>
              </div>
            </div>

          </div>

          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-10 mb-6 border-t border-gray-100 pt-8">Other Cost Factors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="col-span-1">
              <label className="block text-[11px] font-bold text-gray-600 mb-2">Fixed Diamond Cost (1 Carat)</label>
              <div className="relative flex items-center">
                <input 
                  type="number" step="0.01"
                  value={diamondPrice} 
                  onChange={(e) => setDiamondPrice(parseFloat(e.target.value) || 0)}
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                />
                <span className="absolute right-3 text-xs font-bold text-gray-400">INR</span>
              </div>
            </div>
            <div className="col-span-1">
              <label className="block text-[11px] font-bold text-gray-600 mb-2">Making Charge / Gram</label>
              <div className="relative flex items-center">
                <input 
                  type="number" step="0.01"
                  value={makingCharge} 
                  onChange={(e) => setMakingCharge(parseFloat(e.target.value) || 0)}
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                />
                <span className="absolute right-3 text-xs font-bold text-gray-400">INR</span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button type="submit" disabled={loading} className="inline-flex items-center justify-center px-6 py-2.5 shadow-sm text-sm font-bold rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none transition-colors disabled:opacity-70">
              {loading ? 'Refreshing...' : <><RefreshCw className="mr-2 h-4 w-4" /> Refresh Prices</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
