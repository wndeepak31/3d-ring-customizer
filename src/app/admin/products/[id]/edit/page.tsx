import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditProductForm from '@/components/EditProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Edit Asset</h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Modify product details</p>
      </div>

      <EditProductForm product={product} />
    </div>
  );
}
