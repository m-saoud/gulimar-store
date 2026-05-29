'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/data';

const COLOR_NAMES: Record<string, string> = {
  '#000000': 'أسود',
};

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAdd = () => {
    if (!selectedSize) return;
    if (product.colors?.length && !selectedColor) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      size: selectedSize,
      color: selectedColor || 'عادي',
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const displayedImage = product.colorImages?.[selectedColor] || product.image;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div onClick={handleOverlayClick} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative bg-white rounded-2xl max-w-md sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 md:p-6 pt-10 md:pt-12 shadow-xl">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 bg-white rounded-full p-2 hover:bg-gray-100 shadow-md z-10 transition border border-gray-100" 
          aria-label="إغلاق"
        >
          ✕
        </button>
        <div className="bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Image */}
          <div className="flex-1 flex items-center justify-center bg-[#FAF9F5] p-3 md:p-4 rounded-xl min-h-[200px] md:min-h-[320px]">
            {mounted && displayedImage ? (
              <img src={displayedImage} alt={product.name} className="max-w-full max-h-[220px] md:max-h-[320px] object-contain rounded-lg" />
            ) : (
              <span className="text-5xl md:text-6xl">{product.icon}</span>
            )}
          </div>
          {/* Details */}
          <div className="flex-1 p-1 md:p-2 flex flex-col justify-between">
            <div>
              <h1 className="font-bold text-lg md:text-2xl mb-1 md:mb-2 text-gray-900">{product.name}</h1>
              <p className="text-[#D4A827] font-extrabold text-xl md:text-2xl mb-3 md:mb-4">
                {product.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">ل.س</span>
              </p>
              
              {/* Size selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-3 md:mb-4">
                  <p className="text-gray-600 mb-1 font-semibold text-xs md:text-sm">المقاس:</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {product.sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg border text-xs md:text-sm transition-all duration-200 ${
                          selectedSize === size 
                            ? 'bg-[#1A1A1B] text-[#F2C94C] border-[#1A1A1B] font-bold' 
                            : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4 md:mb-6">
                  <p className="text-gray-600 mb-1 font-semibold text-xs md:text-sm">اللون:</p>
                  <div className="flex gap-2 flex-wrap items-center">
                    {product.colors.map(color => (
                      <button 
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 transition-all duration-200 ${
                          selectedColor === color 
                            ? 'border-[#1A1A1B] ring-2 ring-[#F2C94C]/50 scale-110' 
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                        title={COLOR_NAMES[color] || color}
                      />
                    ))}
                    {selectedColor && (
                      <span className="text-xs text-gray-500 font-medium">
                        ({COLOR_NAMES[selectedColor] || selectedColor})
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 md:mt-6 flex flex-col gap-2 md:gap-3">
              <button 
                onClick={handleAdd}
                className={`w-full py-2.5 md:py-3.5 rounded-xl font-bold transition-all duration-200 shadow-sm active:scale-[0.98] text-sm md:text-base ${
                  added 
                    ? 'bg-green-500 text-white' 
                    : 'bg-[#1A1A1B] text-[#F2C94C] hover:bg-[#2D2D2D]'
                }`}
              >
                {added ? '✓ تمت الإضافة' : '🛍️ أضيفي للسلة'}
              </button>
              <Link 
                href="/checkout"
                onClick={onClose}
                className="block w-full py-2.5 md:py-3.5 text-center bg-[#F2C94C] text-[#1A1A1B] font-bold rounded-xl hover:bg-[#D4A827] transition-all duration-200 shadow-sm text-sm md:text-base"
              >
                🧾 إتمام الطلب
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
