'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, UploadCloud, Settings, LogOut, Search, Bell } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If we are on the login page, don't render the sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Upload Model', href: '/admin/products/new', icon: UploadCloud },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F4F7FB] font-sans">
      {/* Sidebar - Deep Dark Blue */}
      <div className="w-64 bg-[#0B132B] flex flex-col shadow-xl z-20">
        <div className="h-20 flex items-center px-6 border-b border-[#1E293B]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xl">L</div>
            <span className="text-xl font-bold tracking-wide text-white">Jewel Core Admin</span>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                    : 'text-gray-400 hover:bg-[#1E293B] hover:text-white'
                }`}
              >
                <Icon className={`mr-4 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[#1E293B] mt-auto">
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = '/admin/login';
            }}
            className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-400 rounded-xl hover:bg-[#1E293B] hover:text-red-300 transition-colors"
          >
            <LogOut className="mr-4 h-5 w-5" />
            Log out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Navigation Bar */}
        <header className="h-20 bg-white shadow-sm z-10 flex items-center justify-between px-8">
          <div className="flex items-center max-w-md w-full">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search or type command..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-gray-400 hover:text-gray-500 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">Super Admin</div>
                <div className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Access Level 5</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#0B132B] flex items-center justify-center text-white font-bold text-sm">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
