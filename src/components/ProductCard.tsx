'use client';

import Link from 'next/link';
import { Product } from '@/lib/data';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col border border-[#F2C94C]/10 h-full">
      {/* Product Image Container */}
      <div className="relative flex-1 flex items-center justify-center bg-[#FAF9F5] border-b border-[#F2C94C]/10 overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#F2C94C]/5" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-[#F2C94C]/5" />
        
        {/* Image or Icon */}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 relative z-10 transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <span className="text-6xl drop-shadow-lg select-none relative z-10">{product.icon}</span>
        )}
        
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 right-3 bg-[#1A1A1A] text-[#F2C94C] text-xs font-bold px-2.5 py-1 rounded-full z-20 shadow-sm">
            {product.badge}
          </span>
        )}
        {/* Category chip */}
        <span className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm text-[#1A1A1A] text-xs font-semibold px-2 py-0.5 rounded-full z-20">
          {product.category}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-4 flex flex-col gap-2.5 sm:gap-3">
        {/* Name & Price */}
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <h3 className="font-bold text-[#1A1A1A] text-xs sm:text-sm md:text-base leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-center">
            {product.name}
          </h3>
          <span className="text-[#D4A827] font-extrabold text-xs sm:text-sm md:text-base">
            {product.price.toLocaleString()} <span className="text-[10px] sm:text-xs font-normal text-gray-500">ل.س</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
