'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import Image from 'next/image';

export default function Header() {
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F4F1EA]/95 backdrop-blur-md border-b border-[#F2C94C]/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1A1A1A] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png" 
                alt="جوليمار طرطوس" 
                width={40}
                height={40}
                className="object-contain" 
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="font-extrabold text-[#1A1A1A] text-sm leading-none">جوليمار</p>
              <p className="text-xs text-[#D4A827] font-semibold">طرطوس</p>
            </div>
            <div className="sm:hidden font-extrabold text-[#1A1A1A] text-sm">جوليمار طرطوس</div>
          </Link>

          {/* Center tagline (desktop only) */}
          <p className="hidden md:block text-xs text-gray-500 font-medium tracking-wide">
            ✨ أزياء نسائية راقية • توصيل لجميع المحافظات
          </p>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Admin Demo Button */}
            <Link
              href="/admin"
              id="admin-panel-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F2C94C] text-[#1A1A1A] text-xs font-bold rounded-lg hover:bg-[#D4A827] transition-all duration-200 shadow-sm hover:shadow-md animate-pulse-gold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="hidden sm:inline">لوحة الإدارة</span>
              <span className="sm:hidden">إدارة</span>
            </Link>

            {/* Cart Button */}
            <button
              id="cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#1A1A1A] text-[#F2C94C] rounded-xl hover:bg-[#2D2D2D] transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              aria-label="سلة المشتريات"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-[#F2C94C] text-[#1A1A1A] text-xs font-extrabold rounded-full flex items-center justify-center animate-bounce-in">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      {isCartOpen && <CartDrawer />}
    </>
  );
}
