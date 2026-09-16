'use client';
import Link from 'next/link';
import { Search, User, Heart, ShoppingBag } from 'lucide-react';

export function Navbar() {
  return (
    <div className="w-full bg-white flex flex-col z-50 sticky top-0 border-b border-gray-200 shadow-sm">
      {/* Top Promo Bar */}
      <div className="bg-[#f7f2ea] text-[#163f35] text-[10px] md:text-xs font-bold tracking-widest text-center py-2.5 uppercase border-b border-[#e8dcc4]">
        <span className="hidden md:inline">ENDS SOON! </span>Receive 1/4 Carat Lab Diamond Studs With Purchase Over ₹80,000. Use Code <span className="font-bold underline decoration-1 underline-offset-2">STUDS</span> in Cart. {'>'}
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-4 md:px-8">
        {/* Top Header Row */}
        <div className="flex justify-between items-center h-16">
          <div className="flex-1 hidden md:flex items-center gap-6 text-[11px] text-gray-500 tracking-wide font-medium">
            <span>800.691.0952</span>
            <Link href="#" className="hover:text-black hover:underline underline-offset-4">Stores</Link>
            <Link href="#" className="hover:text-black hover:underline underline-offset-4">Virtual Appointment</Link>
          </div>
          
          <div className="flex-1 flex justify-start md:justify-center">
            <Link href="/" className="font-serif text-2xl md:text-3xl tracking-[0.1em] text-[#2c2c2c] uppercase">
              JEWEL CORE<sup className="text-[10px] ml-0.5">®</sup>
            </Link>
          </div>
          
          <div className="flex-1 flex justify-end items-center gap-5 text-gray-700">
            <button className="hover:text-black transition-colors"><Search size={18} strokeWidth={1.5} /></button>
            <button className="hover:text-black transition-colors"><User size={18} strokeWidth={1.5} /></button>
            <button className="hover:text-black transition-colors"><Heart size={18} strokeWidth={1.5} /></button>
            <button className="hover:text-black transition-colors"><ShoppingBag size={18} strokeWidth={1.5} /></button>
            <span className="text-[11px] font-medium ml-1 hidden md:inline tracking-wide">INR</span>
          </div>
        </div>

        {/* Secondary Nav Links */}
        <div className="hidden md:flex justify-center space-x-12 pb-4 text-[10px] font-semibold tracking-[0.15em] text-[#444]">
          <Link href="/collection" className="hover:underline underline-offset-[8px] decoration-gray-400">ENGAGEMENT RINGS</Link>
          <Link href="/collection" className="hover:underline underline-offset-[8px] decoration-gray-400">WEDDING RINGS</Link>
          <Link href="/collection" className="hover:underline underline-offset-[8px] decoration-gray-400">DIAMONDS</Link>
          <Link href="/collection" className="hover:underline underline-offset-[8px] decoration-gray-400">GEMSTONES</Link>
          <Link href="/collection" className="hover:underline underline-offset-[8px] decoration-gray-400">JEWELRY</Link>
          <Link href="#" className="hover:underline underline-offset-[8px] decoration-gray-400">GIFTS</Link>
          <Link href="/admin/login" className="hover:underline underline-offset-[8px] decoration-gray-400">ADMIN</Link>
        </div>
      </div>
    </div>
  );
}
