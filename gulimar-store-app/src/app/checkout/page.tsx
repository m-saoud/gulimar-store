'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { generateOrderId } from '@/lib/data';

const PAYMENT_METHODS = [
  { id: 'cash', label: 'الدفع عند التوصيل (كاش)', icon: '💵', desc: 'تدفعين عند استلام طلبك' },
  { id: 'pickup', label: 'حجز واستلام من المحل', icon: '🏪', desc: 'استلام خلال 24 ساعة من المحل مع دفع مسبق 50%' },
  { id: 'syriatel_cash', label: 'سيريتل كاش', icon: '📱', desc: 'حول للرقم: 0911 234 567' },
  { id: 'sham_cash', label: 'شام كاش', icon: '💳', desc: 'حول للرقم: 0933 765 432' },
  { id: 'bemo', label: 'بيمو بنك', icon: '🏦', desc: 'رقم الحساب: SY12 0001 0000 1234 5678 9012' },
];

const AREAS = [
  'طرطوس - المدينة', 'طرطوس - الكورنيش', 'طرطوس - حي الزهراء', 'طرطوس - المدينة الجديدة',
  'بانياس', 'دريكيش', 'صافيتا', 'حمص', 'حماة', 'اللاذقية', 'دمشق', 'حلب', 'دير الزور', 'منطقة أخرى'
];

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

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', area: '' });
  const [payment, setPayment] = useState('cash');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (cart.length === 0) router.push('/');
  }, [cart, router]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'الرجاء إدخال الاسم الكامل';
    if (!form.phone.trim() || !/^09\d{8}$/.test(form.phone.trim())) e.phone = 'أدخلي رقم موبايل سوري صحيح (مثال: 0911234567)';
    if (!form.area) e.area = 'الرجاء اختيار المنطقة';
    const needsProof = ['syriatel_cash', 'sham_cash', 'bemo'].includes(payment);
    if (needsProof && !proofFile) e.proof = 'الرجاء رفع صورة إشعار التحويل';
    return e;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setProofPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));

    const orderId = generateOrderId();
    const order = {
      id: orderId,
      customerName: form.name,
      phone: form.phone,
      address: form.area,
      paymentMethod: payment,
      items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, size: i.size, color: i.color, quantity: i.quantity })),
      total: cartTotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
      paymentProof: proofPreview || undefined,
    };

    try {
      const existing = JSON.parse(localStorage.getItem('gulimar_orders') || '[]');
      localStorage.setItem('gulimar_orders', JSON.stringify([order, ...existing]));
      localStorage.setItem('gulimar_last_order', JSON.stringify(order));
    } catch {}

    clearCart();
    router.push(`/success?id=${orderId}`);
  };

  const needsProof = ['syriatel_cash', 'sham_cash', 'bemo'].includes(payment);
  const selectedPayment = PAYMENT_METHODS.find(m => m.id === payment);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA]">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1A1A1A] transition-colors">المتجر</Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold">إتمام الطلب</span>
        </div>

        <h1 className="text-2xl font-extrabold text-[#1A1A1A] mb-6">إتمام الطلب 🛍️</h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F2C94C]/10">
            <h2 className="font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#F2C94C] text-[#1A1A1A] rounded-full flex items-center justify-center text-xs font-extrabold">١</span>
              ملخص طلبك
            </h2>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">
                    {item.name}{' '}
                    <span className="text-gray-400">
                      (مقاس {item.size}
                      {item.color && item.color !== 'عادي' ? ` • لون ${COLOR_NAMES[item.color] || item.color}` : ''}) × {item.quantity}
                    </span>
                  </span>
                  <span className="font-bold text-[#1A1A1A]">{(item.price * item.quantity).toLocaleString()} ل.س</span>
                </div>
              ))}
              <div className="border-t border-dashed border-gray-200 pt-2 mt-2 flex justify-between items-center">
                <span className="font-bold text-[#1A1A1A]">الإجمالي</span>
                <span className="font-extrabold text-[#D4A827] text-lg">{cartTotal.toLocaleString()} ل.س</span>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F2C94C]/10">
            <h2 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#F2C94C] text-[#1A1A1A] rounded-full flex items-center justify-center text-xs font-extrabold">٢</span>
              بياناتك الشخصية
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">الاسم الكامل *</label>
                <input
                  id="customer-name"
                  type="text"
                  placeholder="مثال: سارة الأحمد"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-[#F4F1EA] text-[#1A1A1A] font-medium transition-all ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">⚠️ {errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">رقم الموبايل *</label>
                <input
                  id="customer-phone"
                  type="tel"
                  placeholder="09XXXXXXXX"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-[#F4F1EA] text-[#1A1A1A] font-medium transition-all ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                  dir="ltr"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">⚠️ {errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">المنطقة / العنوان *</label>
                <select
                  id="customer-area"
                  value={form.area}
                  onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-[#F4F1EA] text-[#1A1A1A] font-medium transition-all ${errors.area ? 'border-red-400' : 'border-gray-200'}`}
                >
                  <option value="">-- اختاري منطقتك --</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                {errors.area && <p className="text-red-500 text-xs mt-1">⚠️ {errors.area}</p>}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F2C94C]/10">
            <h2 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#F2C94C] text-[#1A1A1A] rounded-full flex items-center justify-center text-xs font-extrabold">٣</span>
              طريقة الدفع
            </h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map(method => (
                <label
                  key={method.id}
                  htmlFor={`payment-${method.id}`}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    payment === method.id
                      ? 'border-[#F2C94C] bg-[#F2C94C]/10'
                      : 'border-gray-100 hover:border-[#F2C94C]/50'
                  }`}
                >
                  <input
                    type="radio"
                    id={`payment-${method.id}`}
                    name="payment"
                    value={method.id}
                    checked={payment === method.id}
                    onChange={() => setPayment(method.id)}
                    className="hidden"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    payment === method.id ? 'border-[#F2C94C] bg-[#F2C94C]' : 'border-gray-300'
                  }`}>
                    {payment === method.id && <div className="w-2 h-2 bg-[#1A1A1A] rounded-full" />}
                  </div>
                  <span className="text-xl">{method.icon}</span>
                  <div>
                    <p className="font-bold text-[#1A1A1A] text-sm">{method.label}</p>
                    {payment === method.id && <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>}
                  </div>
                </label>
              ))}
            </div>

            {/* Proof upload */}
            {needsProof && (
              <div className="mt-4 p-4 bg-[#FBE599]/30 border border-[#F2C94C]/40 rounded-xl animate-fadeIn">
                <p className="text-sm font-bold text-[#1A1A1A] mb-1">
                  {selectedPayment?.icon} حول المبلغ إلى: <span className="text-[#D4A827]">{selectedPayment?.desc}</span>
                </p>
                <p className="text-xs text-gray-600 mb-3">ثم ارفعي صورة إشعار التحويل هنا:</p>
                <label
                  htmlFor="proof-upload"
                  className={`flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    proofFile ? 'border-green-400 bg-green-50' : 'border-[#F2C94C]/50 hover:border-[#F2C94C] hover:bg-[#F2C94C]/5'
                  }`}
                >
                  {proofPreview ? (
                    <img src={proofPreview} alt="إشعار" className="h-24 object-contain rounded-lg" />
                  ) : (
                    <>
                      <span className="text-2xl">📷</span>
                      <span className="text-sm text-gray-600 font-medium">اضغطي لرفع الصورة</span>
                    </>
                  )}
                  <input
                    id="proof-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {errors.proof && <p className="text-red-500 text-xs mt-1">⚠️ {errors.proof}</p>}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            id="submit-order-btn"
            type="submit"
            disabled={submitting || cart.length === 0}
            className="w-full py-4 bg-[#F2C94C] text-[#1A1A1A] font-extrabold text-base rounded-2xl hover:bg-[#D4A827] transition-all duration-200 shadow-lg hover:shadow-xl btn-hover-lift disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-[#1A1A1A]/30 border-t-[#1A1A1A] rounded-full animate-spin" />
                جاري تأكيد الطلب...
              </>
            ) : (
              <>تأكيد الطلب ✓</>
            )}
          </button>

          <Link href="/" className="block text-center text-gray-500 text-sm hover:text-[#1A1A1A] transition-colors py-2">
            ← العودة للمتجر
          </Link>
        </form>
      </main>
    </div>
  );
}
