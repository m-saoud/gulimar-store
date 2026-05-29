'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('id') || 'JUL-XXXX';
  const [order, setOrder] = useState<any>(null);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    setConfetti(true);
    try {
      const stored = localStorage.getItem('gulimar_last_order');
      if (stored) setOrder(JSON.parse(stored));
    } catch {}
  }, []);

  const WHATSAPP_NUMBER = '963933000000';
  const waMessage = encodeURIComponent(
    `مرحباً، لدي طلب جديد من متجر جوليمار طرطوس 🛍️\nرقم الطلب: ${orderId}\nأرجو التأكيد والمتابعة 🙏`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  const paymentLabels: Record<string, string> = {
    cash: 'الدفع عند التوصيل',
    pickup: 'استلام من المحل',
    syriatel_cash: 'سيريتل كاش',
    sham_cash: 'شام كاش',
    bemo: 'بيمو بنك',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA]">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full">

          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#F2C94C]/20">
            {/* Top banner */}
            <div className="bg-[#1A1A1A] px-6 py-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#F2C94C]/10" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-[#F2C94C]/5" />
              </div>
              <div className={`relative text-6xl mb-4 ${confetti ? 'animate-bounce-in' : ''}`}>🎉</div>
              <h1 className="relative text-white font-extrabold text-2xl mb-1">تم استلام طلبك!</h1>
              <p className="relative text-[#F2C94C] text-sm font-medium">سنتواصل معك قريباً لتأكيد الطلب</p>
            </div>

            {/* Order details */}
            <div className="p-6 space-y-4">
              {/* Order ID */}
              <div className="flex items-center justify-between p-4 bg-[#F4F1EA] rounded-2xl border border-[#F2C94C]/20">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">رقم طلبك</p>
                  <p className="font-extrabold text-[#1A1A1A] text-xl tracking-wide">{orderId}</p>
                </div>
                <div className="w-10 h-10 bg-[#F2C94C] rounded-full flex items-center justify-center text-lg">
                  📋
                </div>
              </div>

              {/* Order info */}
              {order && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">الاسم:</span>
                    <span className="font-bold text-[#1A1A1A]">{order.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">المنطقة:</span>
                    <span className="font-bold text-[#1A1A1A]">{order.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">الدفع:</span>
                    <span className="font-bold text-[#1A1A1A]">{paymentLabels[order.paymentMethod] || order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-gray-200 pt-2 mt-2">
                    <span className="text-gray-500 font-bold">الإجمالي:</span>
                    <span className="font-extrabold text-[#D4A827] text-lg">{order.total?.toLocaleString()} ل.س</span>
                  </div>
                </div>
              )}

              {/* Steps */}
              <div className="bg-[#F4F1EA] rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-gray-600 mb-2">الخطوات القادمة:</p>
                {['سنراجع طلبك خلال دقائق', 'سنتصل بك للتأكيد', 'يُشحن طلبك إلى عنوانك 🚚'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 bg-[#F2C94C] text-[#1A1A1A] rounded-full flex items-center justify-center text-xs font-extrabold shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a
                id="whatsapp-confirm-btn"
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white font-extrabold text-base rounded-2xl hover:bg-[#20BA5A] transition-all duration-200 shadow-lg hover:shadow-xl btn-hover-lift"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                تأكيد الطلب عبر واتساب المحل
              </a>

              <Link
                href="/"
                className="block text-center text-gray-500 text-sm hover:text-[#1A1A1A] transition-colors py-2"
              >
                العودة للمتجر والتسوق مجدداً ←
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F4F1EA]">
        <div className="w-10 h-10 border-4 border-[#F2C94C] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
