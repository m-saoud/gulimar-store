'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useEffect } from 'react';

const COLOR_NAMES: Record<string, string> = {
  '#000000': 'أسود',
  '#FFFFFF': 'أبيض',
  '#F2C94C': 'ذهبي',
  '#E0A96D': 'بيج',
  '#FFC0CB': 'وردي',
  '#FF0000': 'أحمر',
  '#C0C0C0': 'فضي',
  '#000080': 'كحلي',
};

export default function CartDrawer() {
  const { cart, removeFromCart, cartTotal, setIsCartOpen } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer — slides in from left (RTL: left = start) */}
      <aside className="relative mr-auto w-full max-w-sm bg-[#F4F1EA] shadow-2xl flex flex-col animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#1A1A1A] text-white">
          <h2 className="font-bold text-lg flex items-center gap-2">
            🛍️ <span>سلة المشتريات</span>
            {cart.length > 0 && (
              <span className="bg-[#F2C94C] text-[#1A1A1A] text-xs font-extrabold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.reduce((a, i) => a + i.quantity, 0)}
              </span>
            )}
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="إغلاق"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <span className="text-5xl mb-3">🛒</span>
              <p className="text-gray-500 font-medium">السلة فارغة حالياً</p>
              <p className="text-gray-400 text-sm mt-1">أضيفي منتجات لتبدأ التسوق</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-[#F2C94C]/10 animate-fadeIn"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-[#F4F1EA] flex items-center justify-center text-xl shrink-0">
                  🎁
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1A1A1A] text-sm truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs bg-[#F2C94C]/20 text-[#D4A827] font-semibold px-1.5 py-0.5 rounded-md">
                      {item.size}
                    </span>
                    {item.color && item.color !== 'عادي' && (
                      <span className="inline-flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded-md">
                        <span
                          className="w-2 h-2 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[10px] text-gray-500 font-medium">
                          {COLOR_NAMES[item.color] || item.color}
                        </span>
                      </span>
                    )}
                    <span className="text-xs text-gray-400">× {item.quantity}</span>
                  </div>
                  <p className="text-[#D4A827] font-extrabold text-sm mt-0.5">
                    {(item.price * item.quantity).toLocaleString()} ل.س
                  </p>
                </div>
                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id, item.size, item.color)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                  aria-label="حذف"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">الإجمالي:</span>
              <span className="text-[#1A1A1A] font-extrabold text-xl">
                {cartTotal.toLocaleString()} <span className="text-sm font-normal text-gray-500">ل.س</span>
              </span>
            </div>
            <Link
              href="/checkout"
              id="checkout-btn"
              onClick={() => setIsCartOpen(false)}
              className="block w-full py-3.5 text-center bg-[#F2C94C] text-[#1A1A1A] font-extrabold rounded-xl hover:bg-[#D4A827] transition-all duration-200 shadow-md hover:shadow-lg btn-hover-lift text-sm"
            >
              إتمام الطلب ←
            </Link>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full py-2 text-center text-gray-500 text-sm hover:text-[#1A1A1A] transition-colors"
            >
              مواصلة التسوق
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
