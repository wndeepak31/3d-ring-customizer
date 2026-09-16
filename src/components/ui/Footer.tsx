import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 border-t-[8px] border-[#163f35]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h4 className="font-serif text-lg mb-6 tracking-wide">Customer Care</h4>
            <ul className="space-y-4 text-[13px] text-gray-300">
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Shipping Information</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Lifetime Warranty</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-6 tracking-wide">About Us</h4>
            <ul className="space-y-4 text-[13px] text-gray-300">
              <li><Link href="#" className="hover:text-white transition-colors">Our Mission</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Beyond Conflict Free™</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Recycled Gold</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Lab Grown Diamonds</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-6 tracking-wide">Education</h4>
            <ul className="space-y-4 text-[13px] text-gray-300">
              <li><Link href="#" className="hover:text-white transition-colors">Diamond Guide</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Ring Sizer</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Metal Guide</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Gemstone Guide</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-6 tracking-wide">Join Our Newsletter</h4>
            <p className="text-[13px] text-gray-400 mb-4 leading-relaxed">Be the first to know about exciting new designs, special events, and much more.</p>
            <div className="flex h-10">
              <input type="email" placeholder="Email Address" className="px-4 py-2 w-full text-black outline-none text-sm" />
              <button className="bg-[#163f35] px-6 text-sm font-medium hover:bg-[#0f2c25] transition-colors whitespace-nowrap tracking-wide">SIGN UP</button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-400 tracking-wide">
          <p>© 2026 JEWEL CORE. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Site Map</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
