'use client';

import React from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ProductDetail from '@/components/ProductDetail';
import { getStoredProducts } from '@/lib/data';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();

  if (!id) {
    notFound();
    return null;
  }

  const products = getStoredProducts();
  const product = products.find(p => p.id === id);

  if (!product) {
    notFound();
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA]">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        {/* We reuse the ProductDetail component; onClose will redirect back to the home page */}
        <ProductDetail product={product} onClose={() => router.replace('/')} />
      </main>
    </div>
  );
}
