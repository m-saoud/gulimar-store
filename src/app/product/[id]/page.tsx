'use client';
import React, { useState, useEffect } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { getStoredProducts, Product } from '@/lib/data';

// Utility to map color hex to Arabic name (same as in other components)
const COLOR_NAMES: Record<string, string> = {
  '#000000': 'أسود',
};

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  if (!id) { notFound(); return null; }
  const products = getStoredProducts();
  const product = products.find(p => p.id === id);
  if (!product) { notFound(); return null; }

  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl max-w-md sm:max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto p-4 pt-12 shadow-xl animate-fadeIn">
        <button onClick={() => router.replace('/')} className="absolute top-5 right-5 text-gray-700 hover:text-gray-900 bg-white rounded-full p-2 hover:bg-gray-100 shadow-md z-10 transition" aria-label="إغلاق">✕</button>
        <nav className="flex items-center justify-between text-sm mb-4 pt-8">
          <Link href="/" className="text-[#F2C94C] hover:underline">الرئيسية</Link>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>
        <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col lg:flex-row">
          {/* Image */}
          <div className="flex-1 flex items-center justify-center bg-[#FAF9F5] p-4">
            {mounted && displayedImage ? (
              <img src={displayedImage} alt={product.name} className="max-w-full max-h-[400px] object-contain" />
            ) : (
              <span className="text-6xl">{product.icon}</span>
            )}
          </div>
          {/* Details */}
          <div className="flex-1 p-6 flex flex-col">
            <h1 className="font-bold text-2xl mb-2">{product.name}</h1>
            <p className="text-[#D4A827] font-extrabold text-xl mb-4">
              {product.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">ل.س</span>
            </p>
            {/* Size selector */}
            <div className="mb-4">
              <p className="text-gray-600 mb-1">المقاس:</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(size => (
                  <button key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 rounded border transition ${selectedSize === size ? 'bg-[#F2C94C] text-[#1A1A1A]' : 'bg-white text-gray-600 hover:bg-[#F2C94C] hover:text-[#1A1A1A]'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {/* Color selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-600 mb-1">اللون:</p>
                <div className="flex gap-2 flex-wrap items-center">
                  {product.colors.map(color => (
                    <button key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition ${selectedColor === color ? 'border-[#1A1A1A] ring-2 ring-[#F2C94C]/40' : 'border-gray-200 hover:border-[#1A1A1A]'}`}
                      style={{ backgroundColor: color }}
                      title={COLOR_NAMES[color]}
                    />
                  ))}
                  {selectedColor && <span className="ml-2 text-sm text-gray-600">{COLOR_NAMES[selectedColor] || selectedColor}</span>}
                </div>
              </div>
            )}
            <button onClick={handleAdd}
              className={`mt-auto w-full py-3 rounded-lg font-bold transition ${added ? 'bg-green-500 text-white' : 'bg-[#1A1A1B] text-[#F2C94C] hover:bg-[#F2C94C] hover:text-[#1A1A1B]'}`}
            >
              {added ? '✓ تمت الإضافة' : '🛍️ أضيفي للسلة'}
            </button>
            <Link href="/checkout"
              className="mt-3 block w-full py-3 text-center bg-[#F2C94C] text-[#1A1A1B] font-bold rounded hover:bg-[#D4A827] transition-colors"
            >
              🧾 إتمام الطلب
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
