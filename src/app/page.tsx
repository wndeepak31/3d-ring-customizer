import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';

export default function BrilliantEarthHome() {
  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />

      {/* Split Hero Section */}
      <div className="flex flex-col md:flex-row w-full h-[60vh] md:h-[550px]">
        {/* Left Hero */}
        <div className="flex-1 relative bg-gray-100 flex items-end justify-center pb-16">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/be-hero-left.png')" }} />
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 text-center text-white">
            <h1 className="font-serif text-4xl md:text-[44px] mb-6 drop-shadow-md">Make it Official</h1>
            <Link href="/collection" className="inline-block bg-[#163f35] text-white px-8 py-3.5 text-sm font-medium hover:bg-[#0f2c25] transition-colors">
              Shop Engagement Rings
            </Link>
          </div>
        </div>

        {/* Right Hero */}
        <div className="flex-1 relative bg-[#163f35] flex items-end justify-center pb-16">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/be-hero-right.png')" }} />
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 text-center text-white">
            <h1 className="font-serif text-4xl md:text-[44px] mb-6 drop-shadow-md">Add To Your Story</h1>
            <Link href="/collection" className="inline-block bg-white text-[#163f35] px-8 py-3.5 text-sm font-medium hover:bg-gray-100 transition-colors">
              Shop Charms
            </Link>
          </div>
        </div>
      </div>

      {/* Shop Jewelry by Category */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-20">
        <h2 className="font-serif text-3xl md:text-[34px] text-[#2c2c2c] mb-2 tracking-tight">Shop Jewelry by Category</h2>
        <p className="text-[#555] text-[15px] mb-12 font-serif italic tracking-wide">Thoughtfully designed collections for the big day and every day.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-4 gap-y-8 md:gap-6">
          {[
            { title: "Engagement Rings", img: "/images/cat-engagement.png" },
            { title: "Women's Wedding Rings", img: "/images/cat-womens.png" },
            { title: "Men's Wedding Rings", img: "/images/cat-mens.png" },
            { title: "Gemstone Rings", img: "/images/cat-gemstone.png" },
            { title: "Earrings", img: "/images/cat-engagement.png" }, // Reused for mockup completion
            { title: "Necklaces", img: "/images/cat-womens.png" } // Reused for mockup completion
          ].map((cat, i) => (
            <Link href="/collection" key={i} className="group">
              <div className="w-full aspect-square mb-4 overflow-hidden bg-gray-50 border border-gray-100">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1s] ease-out" />
              </div>
              <h3 className="text-[#2c2c2c] text-[14px] group-hover:underline underline-offset-4">{cat.title}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Shop Diamonds by Shape */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-24 border-t border-gray-100">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="font-serif text-3xl md:text-[34px] text-[#2c2c2c] mb-12 tracking-tight">Shop Diamonds by Shape</h2>
            <div className="w-[80%] max-w-[400px] mx-auto lg:mx-0 aspect-[4/3] bg-gray-50 border border-gray-100 rounded flex items-center justify-center overflow-hidden">
               <img src="/images/cat-engagement.png" alt="Engagement Ring" className="w-full h-full object-cover mix-blend-multiply" />
            </div>
          </div>
          
          <div className="flex-[1.5] grid grid-cols-3 md:grid-cols-5 gap-y-12 gap-x-4 w-full pt-8">
            {[
              "Oval", "Round", "Emerald", "Marquise", "Radiant",
              "Pear", "Elongated Cushion", "Cushion", "Princess", "Asscher"
            ].map((shape, i) => (
              <Link href="/collection" key={i} className="flex flex-col items-center group text-center">
                <div className="w-16 h-16 bg-gray-50 mb-3 overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <img src="/images/cat-engagement.png" className="w-full h-full object-cover mix-blend-multiply opacity-70" alt={shape} />
                </div>
                <span className="text-[13px] text-[#444] font-medium group-hover:underline underline-offset-4">{shape}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Promo Banner */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-24">
        <div className="bg-[#163f35] w-full flex flex-col md:flex-row items-center px-8 md:px-16 py-10 md:py-12 text-white">
          <div className="w-40 h-40 bg-white/10 shrink-0 rounded-sm mb-6 md:mb-0 md:mr-10 bg-cover bg-center" style={{ backgroundImage: "url('/images/cat-engagement.png')" }}></div>
          <div className="text-center md:text-left">
            <h4 className="text-sm tracking-widest mb-3 font-semibold uppercase">Ends Soon!</h4>
            <h3 className="font-serif text-2xl md:text-3xl mb-4 tracking-wide leading-snug">
              RECEIVE 1/4 CARAT LAB DIAMOND STUDS <br className="hidden md:block"/>
              <span className="text-[13px] font-sans tracking-normal font-medium text-white/90">WITH PURCHASE OVER ₹80,000. A ₹16,000 VALUE.</span>
            </h3>
            <p className="text-xs tracking-wider uppercase">Use Code <span className="font-bold underline underline-offset-2">STUDS</span> in Cart.*</p>
          </div>
        </div>
      </div>
    </div>
  );
}
