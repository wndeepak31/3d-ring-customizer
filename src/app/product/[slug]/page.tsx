import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductMediaGallery } from '@/components/viewer3d/ProductMediaGallery';
import { ConfiguratorPanel } from '@/components/configurator/ConfiguratorPanel';
import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';
import { getSettings } from '@/actions/settingsActions';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug }
  });
  const settings = await getSettings();

  if (!product || product.status !== 'ACTIVE') {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-[1400px] mx-auto w-full px-4 md:px-8 py-6 pb-20">
        {/* Breadcrumbs */}
        <div className="text-[11px] text-gray-500 tracking-wider mb-6">
          <Link href="/" className="hover:underline">Home</Link> /{' '}
          <Link href="/collection" className="hover:underline">Engagement Rings</Link> /{' '}
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Column: 3D Viewer & Gallery */}
          <div className="flex-[1.5] w-full">
            <ProductMediaGallery
              glbUrl={product.glbUrl}
              thumbnailUrl={product.thumbnailUrl}
              imageWhite={product.imageWhite}
              imageYellow={product.imageYellow}
              imageRose={product.imageRose}
              galleryUrls={product.galleryUrls}
              productName={product.name}
            />
            
            {/* Optional lower details */}
            <div className="mt-16 hidden lg:block text-[#444] border-t border-gray-100 pt-12">
               <h3 className="font-serif text-2xl mb-6 tracking-wide">Product Details</h3>
               <p className="text-sm leading-relaxed text-gray-600 max-w-2xl">
                 {product.description || `The ${product.name} features a stunning display of craftsmanship, with delicate pavé diamonds along the band and a brilliant center stone setting that captures light from every angle.`}
               </p>
            </div>
          </div>
          
          {/* Right Column: Configurator Panel */}
          <div className="flex-1 w-full lg:sticky lg:top-24 self-start">
             <ConfiguratorPanel 
               productName={product.name} 
               basePrice={product.price || 0}
               weightInGrams={product.weight || 0}
               settings={settings}
             />
          </div>
        </div>
      </main>
    </div>
  );
}
