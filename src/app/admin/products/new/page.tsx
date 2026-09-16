'use client';
import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/actions/productActions';
import { UploadCloud, CheckCircle2, FileCheck2, X, Image as ImageIcon } from 'lucide-react';

function formatBytes(bytes: number) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedGlb, setSelectedGlb] = useState<File | null>(null);
  const glbInputRef = useRef<HTMLInputElement>(null);

  const [previewWhite, setPreviewWhite] = useState<string | null>(null);
  const [previewYellow, setPreviewYellow] = useState<string | null>(null);
  const [previewRose, setPreviewRose] = useState<string | null>(null);
  const [previewThumb, setPreviewThumb] = useState<string | null>(null);

  const handleGlbChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedGlb(e.target.files[0]);
    }
  };

  const handleClearGlb = () => {
    setSelectedGlb(null);
    if (glbInputRef.current) {
      glbInputRef.current.value = '';
    }
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    setPreview: (url: string | null) => void
  ) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await createProduct(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/admin/products');
    }
  };

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Upload Asset</h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Create a new product in the catalog</p>
      </div>

      <div className="bg-white shadow-sm rounded-3xl border border-gray-100 p-10">
        {error && <div className="mb-8 p-5 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold flex items-center"><span className="mr-3">⚠️</span> {error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
            
            <div className="sm:col-span-1">
              <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Name</label>
              <input type="text" name="name" id="name" required className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. The Classic Solitaire" />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="sku" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">SKU / Identifier</label>
              <input type="text" name="sku" id="sku" required className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="e.g. R00002" />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="category" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
              <select id="category" name="category" className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none">
                <option value="Engagement Rings">Engagement Rings</option>
                <option value="Wedding Bands">Wedding Bands</option>
                <option value="Fine Jewelry">Fine Jewelry</option>
              </select>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="status" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Visibility Status</label>
              <select id="status" name="status" className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none">
                <option value="ACTIVE">Active (Public)</option>
                <option value="DRAFT">Draft (Hidden)</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center mb-4">
              <input type="checkbox" id="isFeatured" name="isFeatured" className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="isFeatured" className="ml-3 block text-sm font-bold text-gray-900">
                Feature on Homepage
              </label>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
              <textarea id="description" name="description" rows={4} className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none" placeholder="Enter product details..."></textarea>
            </div>

            <div className="sm:col-span-2 mt-4 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-6">Pricing & Inventory</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label htmlFor="price" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Base Price (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-semibold">₹</span>
                    </div>
                    <input type="number" step="0.01" name="price" id="price" defaultValue={0} required className="block w-full pl-9 bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="stock" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock Quantity</label>
                  <input type="number" name="stock" id="stock" defaultValue={0} required className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 mt-4 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-6">Product Specifications</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <label htmlFor="weight" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Weight (g)</label>
                  <div className="relative">
                    <input type="number" step="0.01" name="weight" id="weight" defaultValue={0} required className="block w-full pr-9 bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-semibold">g</span>
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="metalType" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Default Metal</label>
                  <select id="metalType" name="metalType" defaultValue="14W" className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none">
                    <option value="14W">14K White Gold</option>
                    <option value="14Y">14K Yellow Gold</option>
                    <option value="14R">14K Rose Gold</option>
                    <option value="18W">18K White Gold</option>
                    <option value="18Y">18K Yellow Gold</option>
                    <option value="18R">18K Rose Gold</option>
                    <option value="PLAT">Platinum</option>
                  </select>
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="gemstone" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Default Gemstone</label>
                  <select id="gemstone" name="gemstone" defaultValue="diamond" className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none">
                    <option value="diamond">Diamond</option>
                    <option value="ruby">Ruby</option>
                    <option value="emerald">Emerald</option>
                    <option value="sapphire">Sapphire</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 mt-4 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Media Assets</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Upload 3D GLB model and product render images</p>
                </div>
              </div>

              {/* GLB File Upload & Selected Indicator */}
              <div className="mb-6">
                <label htmlFor="glbFile" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  3D GLB Asset (*.glb) <span className="text-red-500">*</span>
                </label>

                {selectedGlb ? (
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <FileCheck2 className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Model Ready
                          </span>
                          <span className="text-xs text-gray-600 font-semibold">
                            {formatBytes(selectedGlb.size)}
                          </span>
                        </div>
                        <p className="font-bold text-sm text-gray-900 mt-1 truncate">{selectedGlb.name}</p>
                        <p className="text-[11px] text-emerald-700 font-medium">
                          Will be uploaded directly to AWS S3 bucket upon creating the product.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleClearGlb}
                      className="px-3.5 py-2 rounded-xl bg-white text-red-600 hover:bg-red-50 border border-gray-200 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
                    >
                      <X className="w-3.5 h-3.5" /> Remove / Reselect
                    </button>
                  </div>
                ) : (
                  <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="space-y-3 text-center flex flex-col items-center">
                      <div className="h-14 w-14 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-500">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="glbFile" className="relative cursor-pointer rounded-md font-bold text-blue-600 hover:text-blue-700">
                          <span>Click to select 3D model (.glb)</span>
                          <input
                            ref={glbInputRef}
                            id="glbFile"
                            name="glbFile"
                            type="file"
                            accept=".glb"
                            required
                            onChange={handleGlbChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Supports binary .glb files (up to 50MB)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Metal Color Images */}
              <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-3 mb-6">
                {/* White Gold */}
                <div className="sm:col-span-1 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="imageWhiteFile" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      White Gold Image
                    </label>
                    {previewWhite && (
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {previewWhite ? (
                      <img
                        src={previewWhite}
                        alt="White Gold"
                        className="w-14 h-14 object-cover rounded-xl border border-gray-200 bg-white"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="text-xs text-gray-500 min-w-0">
                      <p className="font-semibold text-gray-700 truncate">
                        {previewWhite ? 'Ready to upload' : 'No image chosen'}
                      </p>
                      <p className="text-[10px] text-gray-400">14W, 18W, PLAT</p>
                    </div>
                  </div>

                  <input
                    type="file"
                    name="imageWhiteFile"
                    id="imageWhiteFile"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setPreviewWhite)}
                    className="block w-full text-xs focus:outline-none transition-colors file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                  />
                </div>

                {/* Yellow Gold */}
                <div className="sm:col-span-1 p-4 bg-yellow-50/50 rounded-2xl border border-yellow-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="imageYellowFile" className="block text-xs font-bold text-yellow-800 uppercase tracking-wider">
                      Yellow Gold Image
                    </label>
                    {previewYellow && (
                      <span className="text-[10px] font-bold text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {previewYellow ? (
                      <img
                        src={previewYellow}
                        alt="Yellow Gold"
                        className="w-14 h-14 object-cover rounded-xl border border-yellow-200 bg-white"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl border border-dashed border-yellow-300 flex items-center justify-center text-yellow-500">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="text-xs text-yellow-800/80 min-w-0">
                      <p className="font-semibold text-yellow-900 truncate">
                        {previewYellow ? 'Ready to upload' : 'No image chosen'}
                      </p>
                      <p className="text-[10px] text-yellow-700/60">14Y, 18Y</p>
                    </div>
                  </div>

                  <input
                    type="file"
                    name="imageYellowFile"
                    id="imageYellowFile"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setPreviewYellow)}
                    className="block w-full text-xs focus:outline-none transition-colors file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-yellow-200 file:text-yellow-900 hover:file:bg-yellow-300"
                  />
                </div>

                {/* Rose Gold */}
                <div className="sm:col-span-1 p-4 bg-pink-50/50 rounded-2xl border border-pink-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="imageRoseFile" className="block text-xs font-bold text-pink-800 uppercase tracking-wider">
                      Rose Gold Image
                    </label>
                    {previewRose && (
                      <span className="text-[10px] font-bold text-pink-800 bg-pink-100 px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {previewRose ? (
                      <img
                        src={previewRose}
                        alt="Rose Gold"
                        className="w-14 h-14 object-cover rounded-xl border border-pink-200 bg-white"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl border border-dashed border-pink-300 flex items-center justify-center text-pink-500">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="text-xs text-pink-800/80 min-w-0">
                      <p className="font-semibold text-pink-900 truncate">
                        {previewRose ? 'Ready to upload' : 'No image chosen'}
                      </p>
                      <p className="text-[10px] text-pink-700/60">14R, 18R</p>
                    </div>
                  </div>

                  <input
                    type="file"
                    name="imageRoseFile"
                    id="imageRoseFile"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setPreviewRose)}
                    className="block w-full text-xs focus:outline-none transition-colors file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-pink-200 file:text-pink-900 hover:file:bg-pink-300"
                  />
                </div>
              </div>

              {/* Primary Thumbnail and Gallery */}
              <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                <div className="sm:col-span-1 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="thumbnailFile" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Primary Thumbnail (Optional)
                    </label>
                    {previewThumb && (
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {previewThumb ? (
                      <img
                        src={previewThumb}
                        alt="Thumbnail"
                        className="w-14 h-14 object-cover rounded-xl border border-gray-200 bg-white"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="text-xs text-gray-500 min-w-0">
                      <p className="font-semibold text-gray-700 truncate">
                        {previewThumb ? 'Ready to upload' : 'No thumbnail chosen'}
                      </p>
                      <p className="text-[10px] text-gray-400">Used for catalog listing</p>
                    </div>
                  </div>

                  <input
                    type="file"
                    name="thumbnailFile"
                    id="thumbnailFile"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setPreviewThumb)}
                    className="block w-full text-xs focus:outline-none transition-colors file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div className="sm:col-span-1 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <label htmlFor="galleryFiles" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Gallery Images (Multiple)
                  </label>
                  <input
                    type="file"
                    name="galleryFiles"
                    id="galleryFiles"
                    accept="image/*"
                    multiple
                    className="block w-full text-xs focus:outline-none transition-colors file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                    Hold Ctrl/Cmd to select multiple images
                  </p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 mt-4 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-6">Search Engine Optimization</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="seoTitle" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Title</label>
                  <input type="text" name="seoTitle" id="seoTitle" className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" placeholder="Optimized title for Google" />
                </div>
                <div>
                  <label htmlFor="seoDesc" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Description</label>
                  <textarea id="seoDesc" name="seoDesc" rows={3} className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none" placeholder="Brief summary of the product for search results"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-8 border-t border-gray-100">
            <div className="flex justify-end space-x-4">
              <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-200 rounded-full shadow-sm text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors uppercase tracking-wider">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="inline-flex items-center justify-center px-8 py-3 border border-transparent shadow-md text-sm font-bold rounded-full text-white bg-[#0B132B] hover:bg-blue-900 focus:outline-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider">
                {loading ? 'Processing...' : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Save Asset
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
