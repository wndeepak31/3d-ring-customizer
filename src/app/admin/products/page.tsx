import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Edit3 } from 'lucide-react';
import DeleteProductButton from '@/components/DeleteProductButton';
import ProductStatusToggle from '@/components/ProductStatusToggle';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-1">Products Catalog</h1>
          <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Manage all uploaded GLB models</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-full bg-[#0B132B] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-900 focus:outline-none transition-colors uppercase tracking-wider"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="py-4 pl-8 pr-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="whitespace-nowrap py-5 pl-8 pr-3 text-sm font-bold text-gray-900">{product.name}</td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm font-semibold text-gray-500">{product.sku}</td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm font-semibold text-gray-500">{product.category || '-'}</td>
                  <td className="whitespace-nowrap px-3 py-5">
                    <ProductStatusToggle id={product.id} initialStatus={product.status} />
                  </td>
                  <td className="whitespace-nowrap px-8 py-5 text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-4">
                      <Link href={`/admin/products/${product.id}/edit`} className="text-blue-500 hover:text-blue-700 transition-colors" title="Edit Product">
                        <Edit3 className="h-5 w-5" />
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm font-semibold text-gray-500">
                    No products uploaded yet. Click "Add Product" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
