import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Package, TrendingUp, ArrowUpRight, FolderOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const totalProducts = await prisma.product.count();
  const activeProducts = await prisma.product.count({ where: { status: 'ACTIVE' } });

  return (
    <div className="max-w-7xl mx-auto font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Products System Insights</h1>
          </div>
          <div className="flex items-center text-xs font-bold tracking-widest text-green-500 uppercase">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Live Intelligence <span className="text-gray-300 mx-2">|</span> <span className="text-gray-400">Admin Terminal: superadmin@jewelcore.local</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Active Products Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">Active on Storefront</p>
            <div className="flex items-end space-x-3">
              <h2 className="text-4xl font-black text-gray-900">{activeProducts}</h2>
              <span className="text-sm font-semibold text-gray-400 pb-1">Total active items</span>
            </div>
          </div>
        </div>

        {/* Total Products Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">Total Catalog</p>
              <h3 className="text-2xl font-black text-gray-900">{totalProducts}</h3>
              <p className="text-xs font-semibold text-gray-400 mt-1 uppercase">Uploaded Models</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
           <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
              <FolderOpen className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">System Action</p>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">Manage Catalog</h2>
              <Link href="/admin/products" className="bg-[#0B132B] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-blue-900 transition-colors uppercase tracking-wider">
                Open Audit
              </Link>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-6">
             <div className="flex items-center text-sm font-bold tracking-widest text-gray-500 uppercase">
                <Package className="h-4 w-4 mr-2 text-purple-500" />
                Latest Uploads Pipeline
             </div>
             <span className="bg-[#0B132B] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Strategic View</span>
           </div>

           <div className="space-y-6">
              {/* This would be a dynamic list, currently placeholder for design */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-gray-400">
                    G
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Engagement Ring Model</h4>
                    <div className="flex items-center mt-1">
                      <div className="h-1 w-16 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-gray-400 uppercase">Processed</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-sm font-bold text-gray-900">R_30006_EMD</div>
                   <Link href="/admin/products" className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wide">View Asset</Link>
                </div>
              </div>
           </div>
        </div>

        <div className="bg-[#0B132B] rounded-3xl p-8 shadow-lg text-white">
           <div className="flex justify-between items-center mb-6">
             <div className="flex items-center text-sm font-bold tracking-widest text-blue-400 uppercase">
                <TrendingUp className="h-4 w-4 mr-2" />
                Category Distribution
             </div>
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top Tier</span>
           </div>

           <div className="mt-8 flex items-center space-x-4">
             <div className="h-12 w-12 rounded-2xl bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold">
               ER
             </div>
             <div className="flex-1">
               <h4 className="text-sm font-bold text-white">Engagement Rings</h4>
               <p className="text-xs font-semibold text-gray-400 mt-1 uppercase">High Conversion Category</p>
             </div>
             <div className="text-xl font-black text-blue-400">100%</div>
           </div>
        </div>
      </div>
    </div>
  );
}
