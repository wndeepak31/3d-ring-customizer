import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Heart, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { getSettings } from '@/actions/settingsActions';
import { calculateDynamicPrice } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

export default async function CollectionPage() {
  const settings = await getSettings();
  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Top Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-12">
        <div className="text-[11px] text-gray-500 tracking-wider mb-8">
          <Link href="/" className="hover:underline">Home</Link> / <span className="text-gray-900 font-medium">Engagement Rings</span>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-[#2c2c2c] mb-4 tracking-tight">Engagement Rings</h1>
          <p className="text-gray-600 text-[15px] max-w-2xl mx-auto">
            From solitaires to diamond accents, choose your dream engagement ring and we'll bring it to life.
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex justify-between items-center border-t border-gray-200 py-4 mb-4">
          <button className="flex items-center gap-2 bg-[#163f35] text-white px-6 py-2.5 text-xs tracking-wider font-medium hover:bg-[#0f2c25] transition-colors rounded-sm">
            Filters <SlidersHorizontal size={14} />
          </button>
          
          <div className="flex items-center gap-6">
            <span className="text-[13px] font-semibold text-gray-800">{products.length} Results</span>
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2.5 text-xs text-[#2c2c2c] font-medium bg-white hover:bg-gray-50 rounded-sm">
              Sort By: Best Sellers <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12">
          {products.map((product, index) => {
             const badges = ["AWARD WINNING", "HIDDEN HALO", "MOST LOVED", null];
             const badge = badges[index % 4];
             
             // Defaulting to 18K Yellow Gold for display if metalType is not set
             const defaultMetal = product.metalType || '18Y'; 
             const calculatedPrice = calculateDynamicPrice({
               basePrice: product.price,
               weightInGrams: product.weight || 0,
               metalCode: defaultMetal,
               settings: settings
             });
             
             const price = calculatedPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
             
             return (
              <Link key={product.id} href={`/product/${product.slug}`} className="group block relative border border-transparent hover:border-gray-200 hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-all p-4 bg-white rounded-md h-full flex flex-col">
                {badge && (
                  <div className="absolute top-4 left-4 bg-[#163f35] text-white text-[8px] font-bold tracking-[0.15em] px-2.5 py-1 rounded-sm z-10 uppercase">
                    {badge}
                  </div>
                )}
                <div className="absolute top-4 right-4 z-10 text-gray-400 hover:text-[#163f35] transition-colors bg-white p-1 rounded-full shadow-sm">
                  <Heart size={16} strokeWidth={1.5} />
                </div>
                
                <div className="w-full aspect-square bg-[#f8f8f8] mb-5 p-6 flex items-center justify-center overflow-hidden rounded-sm relative mt-2">
                  {product.thumbnailUrl ? (
                    <img
                      src={product.thumbnailUrl}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply opacity-95 group-hover:scale-105 transition-transform duration-[800ms]"
                    />
                  ) : (
                    <div className="text-gray-300 text-sm">No Image</div>
                  )}
                </div>
                
                <div className="flex justify-center gap-2.5 mb-4">
                   <div className="w-3.5 h-3.5 rounded-full bg-[#e3d081] shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] cursor-pointer hover:ring-2 ring-gray-300 ring-offset-2"></div>
                   <div className="w-3.5 h-3.5 rounded-full bg-[#f4f4f4] shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] cursor-pointer hover:ring-2 ring-gray-300 ring-offset-2"></div>
                   <div className="w-3.5 h-3.5 rounded-full bg-[#e0ac93] shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] cursor-pointer hover:ring-2 ring-gray-300 ring-offset-2"></div>
                   <div className="w-3.5 h-3.5 rounded-full bg-[#e8e9eb] shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] cursor-pointer hover:ring-2 ring-gray-300 ring-offset-2"></div>
                </div>

                <div className="text-center flex-1 flex flex-col justify-end">
                  <h3 className="text-[13px] text-[#333] font-medium leading-snug group-hover:underline underline-offset-4">{product.name}</h3>
                  <p className="text-[13px] text-[#666] mt-1.5">{price}</p>
                </div>
              </Link>
             );
          })}
        </div>
        
        {products.length === 0 && (
          <div className="w-full text-center py-32 border-t border-gray-100 mt-8">
            <p className="text-sm tracking-widest uppercase text-gray-500">No matching products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
