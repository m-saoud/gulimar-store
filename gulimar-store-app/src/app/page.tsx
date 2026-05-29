'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES, INITIAL_PRODUCTS, Product } from '@/lib/data';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('gulimar_products');
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        setProducts(INITIAL_PRODUCTS);
      }
    } catch {
      setProducts(INITIAL_PRODUCTS);
    }
  }, []);

  const filtered = activeCategory === 'الكل'
    ? products
    : products.filter(p => p.category === activeCategory);

  const categoryEmojis: Record<string, string> = {
    'الكل': '🌟',
    'فساتين': '👗',
    'بيجامات': '🌙',
    'لانجري': '💎',
    'طلعت': '✨',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA]">
      <Header />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-[#1A1A1A] text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#F2C94C]/10" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#F2C94C]/5" />
          <div className="absolute top-10 left-1/2 w-32 h-32 rounded-full bg-[#F2C94C]/5" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 md:py-16 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-right">
            <div className="inline-flex items-center gap-2 bg-[#F2C94C]/10 border border-[#F2C94C]/30 text-[#F2C94C] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              ✨ وصلت التشكيلة الجديدة
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3">
              جوليمار{' '}
              <span className="text-[#F2C94C]">طرطوس</span>
            </h1>
            <p className="text-gray-300 text-sm md:text-lg mb-6 max-w-md mx-auto md:mx-0 leading-relaxed">
              أزياء نسائية راقية بأسعار تناسبك 💫<br />
              توصيل سريع لجميع المحافظات السورية
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2.5 gap-x-3 text-xs md:text-sm font-semibold">
              <div className="flex items-center gap-1 text-[#F2C94C] bg-white/5 px-2.5 py-1 rounded-full border border-white/10 sm:border-0 sm:bg-transparent sm:p-0">
                <span>🚚</span><span>توصيل مضمون</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-1 text-[#F2C94C] bg-white/5 px-2.5 py-1 rounded-full border border-white/10 sm:border-0 sm:bg-transparent sm:p-0">
                <span>💰</span><span>دفع عند الاستلام</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-1 text-[#F2C94C] bg-white/5 px-2.5 py-1 rounded-full border border-white/10 sm:border-0 sm:bg-transparent sm:p-0">
                <span>✅</span><span>جودة مضمونة</span>
              </div>
            </div>
          </div>

          {/* Decorative product showcase */}
          <div className="hidden md:flex gap-3 shrink-0">
            {['👗', '🌙', '💎'].map((icon, i) => (
              <div
                key={i}
                className="w-24 h-28 rounded-2xl bg-white/10 border border-[#F2C94C]/20 flex items-center justify-center text-4xl shadow-lg"
                style={{ transform: `rotate(${(i - 1) * 4}deg)`, animationDelay: `${i * 0.1}s` }}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                id={`cat-${cat}`}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  activeCategory === cat
                    ? 'bg-[#1A1A1A] text-[#F2C94C] shadow-md scale-105'
                    : 'bg-white text-gray-600 hover:bg-[#F2C94C]/10 hover:text-[#1A1A1A] border border-gray-200'
                }`}
              >
                <span>{categoryEmojis[cat]}</span>
                <span>{cat}</span>
                {activeCategory === cat && (
                  <span className="bg-[#F2C94C] text-[#1A1A1A] text-xs font-extrabold rounded-full w-4 h-4 flex items-center justify-center">
                    {(cat === 'الكل' ? products : products.filter(p => p.category === cat)).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#1A1A1A] text-lg">
            {activeCategory === 'الكل' ? 'جميع المنتجات' : activeCategory}
          </h2>
          <span className="text-sm text-gray-500">{filtered.length} منتج</span>
        </div>

        {/* Products Grid */}
        {!mounted ? (
          // Loading skeleton
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">😔</span>
            <p className="text-gray-500 font-medium">لا توجد منتجات في هذه الفئة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className="animate-fadeIn h-full flex flex-col"
                style={{ animationDelay: `${i * 0.07}s`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white py-8 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[#F2C94C] font-extrabold text-xl mb-1">جوليمار طرطوس</p>
          <p className="text-gray-400 text-sm">متجر الأزياء النسائية الراقية • طرطوس، سوريا</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-gray-500 text-xs">
            <span>📍 طرطوس</span>
            <span>•</span>
            <span>📱 واتساب المحل</span>
            <span>•</span>
            <span>🚚 توصيل لكل سوريا</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
