'use client';
import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function ClientFooterWrapper() {
  const pathname = usePathname();
  
  // Hide footer on all admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  return <Footer />;
}
