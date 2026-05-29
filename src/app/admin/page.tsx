'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { INITIAL_PRODUCTS, DEMO_ORDERS, Product, Order, CATEGORIES } from '@/lib/data';

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

type Tab = 'dashboard' | 'products' | 'orders';
type OrderStatus = 'pending' | 'shipped' | 'delivered';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'قيد الانتظار',
  shipped: 'تم الشحن',
  delivered: 'مستلم',
};
const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  shipped: 'bg-blue-100 text-blue-800 border-blue-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
};
const STATUS_ICONS: Record<OrderStatus, string> = {
  pending: '⏳',
  shipped: '🚚',
  delivered: '✅',
};
const PAYMENT_LABELS: Record<string, string> = {
  cash: '💵 كاش',
  pickup: '🏪 استلام من المحل',
  syriatel_cash: '📱 سيريتل كاش',
  sham_cash: '💳 شام كاش',
  bemo: '🏦 بيمو',
};

// ─── Empty Product Form ────────────────────────────────────────────────────────
const emptyProduct = (): Partial<Product> => ({
  name: '',
  price: 0,
  category: 'فساتين',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: [],
  colorImages: {},
  gradient: 'cat-gradient-dress',
  icon: '👗',
  badge: '',
});

const CATEGORY_DEFAULTS: Record<string, { gradient: string; icon: string }> = {
  'فساتين':  { gradient: 'cat-gradient-dress',    icon: '👗' },
  'بيجامات': { gradient: 'cat-gradient-pyjama',   icon: '🌙' },
  'لانجري':  { gradient: 'cat-gradient-lingerie', icon: '💎' },
  'طلعت':   { gradient: 'cat-gradient-outing',   icon: '✨' },
};

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);

  // Modals
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct]       = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm]   = useState<string | null>(null);
  const [proofModal, setProofModal]         = useState<string | null>(null);
  const [toast, setToast]                   = useState('');

  // Load from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const p = localStorage.getItem('gulimar_products');
      setProducts(p ? JSON.parse(p) : INITIAL_PRODUCTS);
    } catch { setProducts(INITIAL_PRODUCTS); }
    try {
      const o = localStorage.getItem('gulimar_orders');
      setOrders(o ? JSON.parse(o) : DEMO_ORDERS);
    } catch { setOrders(DEMO_ORDERS); }
  }, []);

  const saveProducts = (updated: Product[]) => {
    setProducts(updated);
    try { localStorage.setItem('gulimar_products', JSON.stringify(updated)); } catch {}
  };
  const saveOrders = (updated: Order[]) => {
    setOrders(updated);
    try { localStorage.setItem('gulimar_orders', JSON.stringify(updated)); } catch {}
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((a, o) => a + o.total, 0);
  const deliveredRevenue = orders.filter(o => o.status === 'delivered').reduce((a, o) => a + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  const productSales: Record<string, { name: string; count: number }> = {};
  orders.forEach(order =>
    order.items.forEach(item => {
      if (!productSales[item.id]) productSales[item.id] = { name: item.name, count: 0 };
      productSales[item.id].count += item.quantity;
    })
  );
  const topProducts = Object.values(productSales).sort((a, b) => b.count - a.count).slice(0, 3);

  // ── Order status change ────────────────────────────────────────────────────
  const cycleStatus = (orderId: string) => {
    const cycle: Record<OrderStatus, OrderStatus> = { pending: 'shipped', shipped: 'delivered', delivered: 'pending' };
    const updated = orders.map(o =>
      o.id === orderId ? { ...o, status: cycle[o.status as OrderStatus] } : o
    );
    saveOrders(updated);
    showToast('✓ تم تحديث حالة الطلب');
  };

  // ── Delete product ─────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    saveProducts(products.filter(p => p.id !== id));
    setDeleteConfirm(null);
    showToast('✓ تم حذف المنتج');
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col" dir="rtl">

      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-[#1A1A1A] text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F2C94C] flex items-center justify-center text-[#1A1A1A] font-extrabold text-sm">ج</div>
            <div>
              <p className="font-extrabold text-sm leading-none">لوحة تحكم جوليمار</p>
              <p className="text-xs text-[#F2C94C] leading-none mt-0.5">للعرض التوضيحي</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            عودة للمتجر
          </Link>
        </div>
      </header>

      {/* Tab Nav */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-14 z-30">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 py-2">
          {([
            { id: 'dashboard', label: 'لوحة البيانات', icon: '📊' },
            { id: 'products',  label: 'المنتجات',       icon: '🏷️' },
            { id: 'orders',    label: `الطلبات ${pendingCount > 0 ? `(${pendingCount})` : ''}`, icon: '📦' },
          ] as { id: Tab; label: string; icon: string }[]).map(t => (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                tab === t.id
                  ? 'bg-[#1A1A1A] text-[#F2C94C] shadow-md'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-[#1A1A1A]'
              }`}
            >
              <span>{t.icon}</span><span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">

        {/* ── DASHBOARD TAB ───────────────────────────────────────────────── */}
        {tab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-extrabold text-[#1A1A1A]">نظرة عامة 📊</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'إجمالي المبيعات', value: `${totalRevenue.toLocaleString()} ل.س`, icon: '💰', color: 'bg-[#F2C94C]', textColor: 'text-[#1A1A1A]' },
                { label: 'المبيعات المحصّلة', value: `${deliveredRevenue.toLocaleString()} ل.س`, icon: '✅', color: 'bg-green-500', textColor: 'text-white' },
                { label: 'إجمالي الطلبات', value: orders.length, icon: '📦', color: 'bg-[#1A1A1A]', textColor: 'text-[#F2C94C]' },
                { label: 'طلبات قيد الانتظار', value: pendingCount, icon: '⏳', color: 'bg-orange-400', textColor: 'text-white' },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`${card.color} rounded-2xl p-4 shadow-md animate-fadeIn stagger-${i + 1}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                  <p className={`font-extrabold text-xl md:text-2xl ${card.textColor}`}>{card.value}</p>
                  <p className={`text-xs mt-1 font-medium ${card.textColor} opacity-80`}>{card.label}</p>
                </div>
              ))}
            </div>

            {/* Top Products + Order Status split */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Best Sellers */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F2C94C]/10">
                <h3 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                  🏆 الأكثر مبيعاً
                </h3>
                {topProducts.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">لا توجد بيانات بعد</p>
                ) : (
                  <div className="space-y-3">
                    {topProducts.map((p, i) => (
                      <div key={p.name} className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-extrabold ${i === 0 ? 'bg-[#F2C94C] text-[#1A1A1A]' : 'bg-gray-100 text-gray-600'}`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1A1A1A] text-sm truncate">{p.name}</p>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-[#F2C94C] h-1.5 rounded-full transition-all duration-700"
                              style={{ width: `${Math.min(100, (p.count / (topProducts[0]?.count || 1)) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-600 shrink-0">{p.count} قطعة</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Status Breakdown */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F2C94C]/10">
                <h3 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">📦 حالة الطلبات</h3>
                <div className="space-y-3">
                  {(['pending', 'shipped', 'delivered'] as OrderStatus[]).map(s => {
                    const count = orders.filter(o => o.status === s).length;
                    const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <span className="text-lg">{STATUS_ICONS[s]}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-semibold text-[#1A1A1A]">{STATUS_LABELS[s]}</span>
                            <span className="text-xs text-gray-500">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-700 ${s === 'pending' ? 'bg-yellow-400' : s === 'shipped' ? 'bg-blue-400' : 'bg-green-400'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F2C94C]/10">
              <h3 className="font-bold text-[#1A1A1A] mb-4">⚡ آخر الطلبات</h3>
              <div className="space-y-3">
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-[#F4F1EA] rounded-xl">
                    <div>
                      <p className="font-bold text-[#1A1A1A] text-sm">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.id} • {PAYMENT_LABELS[order.paymentMethod]}</p>
                    </div>
                    <div className="text-left flex flex-col items-end gap-1">
                      <span className="font-extrabold text-[#D4A827] text-sm">{order.total.toLocaleString()} ل.س</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLORS[order.status as OrderStatus]}`}>
                        {STATUS_ICONS[order.status as OrderStatus]} {STATUS_LABELS[order.status as OrderStatus]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setTab('orders')} className="w-full mt-4 py-2 text-center text-sm text-[#D4A827] hover:text-[#1A1A1A] font-semibold transition-colors">
                عرض جميع الطلبات ←
              </button>
            </div>
          </div>
        )}

        {/* ── PRODUCTS TAB ────────────────────────────────────────────────── */}
        {tab === 'products' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#1A1A1A]">إدارة المنتجات 🏷️</h2>
              <button
                id="add-product-btn"
                onClick={() => setShowAddProduct(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#F2C94C] text-[#1A1A1A] font-bold rounded-xl hover:bg-[#D4A827] transition-all shadow-md hover:shadow-lg btn-hover-lift text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                إضافة منتج جديد
              </button>
            </div>

            {!mounted ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(6)].map((_, i) => <div key={i} className="h-44 bg-white rounded-2xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product, i) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-fadeIn hover:shadow-md transition-all"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="h-24 flex items-center justify-center bg-[#FAF9F5] border-b border-[#F2C94C]/10 relative overflow-hidden shrink-0">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="h-full w-full object-contain p-2 relative z-10" />
                      ) : (
                        <span className="text-4xl relative z-10">{product.icon}</span>
                      )}
                      {product.badge && (
                        <span className="absolute top-2 right-2 bg-[#1A1A1A] text-[#F2C94C] text-xs font-bold px-1.5 py-0.5 rounded-full z-20">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-[#1A1A1A] text-sm truncate">{product.name}</p>
                      <p className="text-[#D4A827] font-extrabold text-sm">{product.price.toLocaleString()} ل.س</p>
                      <p className="text-gray-400 text-xs">{product.category}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          id={`edit-product-${product.id}`}
                          onClick={() => setEditProduct(product)}
                          className="flex-1 py-1.5 bg-[#F4F1EA] text-[#1A1A1A] text-xs font-bold rounded-lg hover:bg-[#F2C94C]/30 transition-colors"
                        >
                          ✏️ تعديل
                        </button>
                        <button
                          id={`delete-product-${product.id}`}
                          onClick={() => setDeleteConfirm(product.id)}
                          className="flex-1 py-1.5 bg-red-50 text-red-500 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
                        >
                          🗑️ حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ──────────────────────────────────────────────────── */}
        {tab === 'orders' && (
          <div className="space-y-5 animate-fadeIn">
            <h2 className="text-xl font-extrabold text-[#1A1A1A]">إدارة الطلبات 📦</h2>

            {/* Mobile: Cards; Desktop: Table */}
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center">
                  <span className="text-4xl">📭</span>
                  <p className="text-gray-500 mt-3">لا توجد طلبات بعد</p>
                </div>
              ) : (
                orders.map((order, i) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {/* Order Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#F4F1EA] border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-[#1A1A1A] text-sm font-mono">{order.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLORS[order.status as OrderStatus]}`}>
                          {STATUS_ICONS[order.status as OrderStatus]} {STATUS_LABELS[order.status as OrderStatus]}
                        </span>
                      </div>
                      <span className="font-extrabold text-[#D4A827] text-sm">{order.total.toLocaleString()} ل.س</span>
                    </div>

                    <div className="p-4">
                      {/* Customer Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">الزبونة</p>
                          <p className="font-bold text-[#1A1A1A]">{order.customerName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">الموبايل</p>
                          <p className="font-bold text-[#1A1A1A] font-mono" dir="ltr">{order.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">المنطقة</p>
                          <p className="font-bold text-[#1A1A1A]">{order.address}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">الدفع</p>
                          <p className="font-bold text-[#1A1A1A]">{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</p>
                        </div>
                      </div>
                      {/* Items */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-1.5">المنتجات:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {order.items.map((item, j) => (
                            <span key={j} className="bg-[#F4F1EA] border border-[#F2C94C]/30 text-[#1A1A1A] text-xs font-semibold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 flex-wrap">
                              <span>{item.name}</span>
                              <span className="text-gray-400 font-normal">({item.size})</span>
                              {item.color && item.color !== 'عادي' && (
                                <span className="inline-flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                                  <span className="w-1.5 h-1.5 rounded-full border border-gray-300" style={{ backgroundColor: item.color }} />
                                  <span>{COLOR_NAMES[item.color] || item.color}</span>
                                </span>
                              )}
                              <span className="text-gray-500 font-bold">× {item.quantity}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        <button
                          id={`change-status-${order.id}`}
                          onClick={() => cycleStatus(order.id)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-[#F2C94C] text-[#1A1A1A] text-xs font-bold rounded-lg hover:bg-[#D4A827] transition-colors"
                        >
                          🔄 تغيير الحالة
                        </button>
                        {order.paymentProof && (
                          <button
                            id={`view-proof-${order.id}`}
                            onClick={() => setProofModal(order.paymentProof!)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            🖼️ إشعار التحويل
                          </button>
                        )}
                        <a
                          href={`https://wa.me/963${order.phone.slice(1)}?text=${encodeURIComponent(`مرحباً ${order.customerName}، طلبك رقم ${order.id} من جوليمار جاهز للشحن 🚚`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-100 transition-colors"
                        >
                          📱 واتساب
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── MODALS ──────────────────────────────────────────────────────────── */}

      {/* Add/Edit Product Modal */}
      {(showAddProduct || editProduct) && (
        <ProductModal
          product={editProduct || emptyProduct() as Product}
          isEdit={!!editProduct}
          onClose={() => { setShowAddProduct(false); setEditProduct(null); }}
          onSave={(p) => {
            if (editProduct) {
              saveProducts(products.map(x => x.id === p.id ? p : x));
              showToast('✓ تم تعديل المنتج بنجاح');
            } else {
              const newP = { ...p, id: `p${Date.now()}` };
              saveProducts([...products, newP]);
              showToast('✓ تم إضافة المنتج بنجاح');
            }
            setShowAddProduct(false);
            setEditProduct(null);
          }}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-bounce-in">
            <p className="text-4xl text-center mb-3">⚠️</p>
            <h3 className="font-extrabold text-[#1A1A1A] text-lg text-center mb-2">حذف المنتج</h3>
            <p className="text-gray-500 text-sm text-center mb-5">هل أنتِ متأكدة؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                id="confirm-delete-btn"
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Proof Modal */}
      {proofModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setProofModal(null)} />
          <div className="relative bg-white rounded-2xl p-4 max-w-sm w-full shadow-2xl animate-bounce-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-[#1A1A1A]">🖼️ إشعار التحويل</h3>
              <button
                onClick={() => setProofModal(null)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>
            <img
              src={proofModal}
              alt="إشعار التحويل"
              className="w-full rounded-xl object-contain max-h-80"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0Ij7YpdmI2LXYqSDYp9mE2KvYrdmI2YrZhDwvdGV4dD48L3N2Zz4=';
              }}
            />
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] text-[#F2C94C] font-bold px-5 py-3 rounded-xl shadow-2xl animate-bounce-in text-sm">
          {toast}
        </div>
      )}
    </div>
  );
}

function ProductModal({
  product,
  isEdit,
  onClose,
  onSave,
}: {
  product: Product;
  isEdit: boolean;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [form, setForm] = useState<Product>({ ...product });
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('#000000');

  const handleCategoryChange = (cat: string) => {
    const defaults = CATEGORY_DEFAULTS[cat] || { gradient: 'cat-gradient-dress', icon: '👗' };
    setForm(f => ({ ...f, category: cat, ...defaults }));
  };

  // Size management
  const addSize = (size: string) => {
    if (!size) return;
    setForm(f => ({ ...f, sizes: [...(f.sizes || []), size] }));
  };

  const removeSize = (size: string) => {
    setForm(f => ({ ...f, sizes: f.sizes.filter(s => s !== size) }));
  };

  // Color management
  const addColor = (color: string) => {
    if (!color) return;
    setForm(f => ({
      ...f,
      colors: [...(f.colors || []), color],
      colorImages: { ...(f.colorImages || {}), [color]: '' }
    }));
  };

  const removeColor = (color: string) => {
    setForm(f => {
      const newColors = f.colors?.filter(c => c !== color) || [];
      const { [color]: _, ...restImages } = f.colorImages || {};
      return { ...f, colors: newColors, colorImages: restImages };
    });
  };

  const handleColorImageChange = (color: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(f => ({
        ...f,
        colorImages: { ...(f.colorImages || {}), [color]: reader.result as string }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(f => ({ ...f, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.price <= 0) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-bounce-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-extrabold text-[#1A1A1A] text-lg">
            {isEdit ? '✏️ تعديل المنتج' : '➕ إضافة منتج جديد'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Unified Preview Header */}
          <div className="h-28 rounded-xl flex items-center justify-center bg-[#FAF9F5] border border-[#F2C94C]/20 relative overflow-hidden shrink-0">
            {form.image ? (
              <img src={form.image} alt="معاينة المنتج" className="h-full w-full object-contain p-2 relative z-10" />
            ) : (
              <span className="text-5xl relative z-10">{form.icon}</span>
            )}
            <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-[#F2C94C]/5" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-[#F2C94C]/5" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">اسم المنتج *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="مثال: فستان سهاري أنيق"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-[#F4F1EA] text-[#1A1A1A] font-medium animate-fadeIn"
              required
            />
          </div>

          {/* Product Image Uploader */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">صورة المنتج</label>
            <label
              htmlFor="product-image-upload"
              className={`flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all min-h-[7rem] ${
                form.image ? 'border-green-400 bg-green-50/20' : 'border-[#F2C94C]/50 hover:border-[#F2C94C] hover:bg-[#F2C94C]/5'
              }`}
            >
              {form.image ? (
                <div className="relative flex items-center gap-3 w-full justify-between">
                  <div className="flex items-center gap-2">
                    <img src={form.image} alt="معاينة" className="h-10 w-10 object-contain rounded-md border bg-white" />
                    <span className="text-xs text-green-600 font-bold">✓ تم تحميل الصورة بنجاح</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setForm(f => ({ ...f, image: '' }));
                    }}
                    className="px-2 py-1 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 text-xs font-semibold"
                  >
                    إزالة ✕
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-2xl">📷</span>
                  <span className="text-xs text-gray-500 font-medium">اضغطي هنا لرفع صورة المنتج</span>
                </>
              )}
              <input
                id="product-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProductImageChange}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">السعر (ل.س) *</label>
              <input
                type="number"
                value={form.price || ''}
                onChange={e => setForm(f => ({ ...f, price: parseInt(e.target.value) || 0 }))}
                placeholder="25000"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-[#F4F1EA] text-[#1A1A1A] font-medium"
                required
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">أيقونة بديلة (إيموجي)</label>
              <input
                type="text"
                value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-[#F4F1EA] text-[#1A1A1A] font-medium text-xl text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">الفئة *</label>
            <select
              value={form.category}
              onChange={e => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-[#F4F1EA] text-[#1A1A1A] font-medium"
            >
              {CATEGORIES.filter(c => c !== 'الكل').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">بادج (اختياري)</label>
              <input
                type="text"
                value={form.badge || ''}
                onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                placeholder="مثال: جديد، الأكثر مبيعاً، حصري"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-[#F4F1EA] text-[#1A1A1A] font-medium"
              />

              {/* Size Management */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">المقاسات</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.sizes.map((size) => (
                    <div key={size} className="flex items-center gap-1 bg-[#F2C94C]/10 px-2 py-1 rounded">
                      <span className="text-sm">{size}</span>
                      <button type="button" onClick={() => removeSize(size)} className="text-xs text-red-500">✕</button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={e => setNewSize(e.target.value)}
                    placeholder="مثال: XXL"
                    className="flex-1 px-2 py-1 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => { if (newSize) { addSize(newSize); setNewSize(''); } }}
                    className="px-2 py-1 bg-[#F2C94C] text-[#1A1A1A] rounded"
                  >
                    إضافة
                  </button>
                </div>
              </div>

              {/* Color Management */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">الألوان</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.colors?.map((color) => (
                    <div key={color} className="flex items-center gap-1">
                      <button
                        type="button"
                        className="w-6 h-6 rounded-full border-2"
                        style={{ backgroundColor: color }}
                      />
                      {form.colorImages?.[color] && (
                        <img src={form.colorImages[color]} alt="color" className="h-6 w-6 object-cover rounded" />
                      )}
                      <label className="cursor-pointer text-xs text-[#F2C94C] underline">
                        رفع صورة
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleColorImageChange(color, e)}
                        />
                      </label>
                      <button type="button" onClick={() => removeColor(color)} className="text-xs text-red-500">✕</button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newColor}
                    onChange={e => setNewColor(e.target.value)}
                    className="w-10 h-10 p-0 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => { addColor(newColor); }}
                    className="px-2 py-1 bg-[#F2C94C] text-[#1A1A1A] rounded"
                  >
                    إضافة
                  </button>
                </div>
              </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              id="save-product-btn"
              className="flex-1 py-3 bg-[#F2C94C] text-[#1A1A1A] font-extrabold rounded-xl hover:bg-[#D4A827] transition-colors shadow-md"
            >
              {isEdit ? 'حفظ التعديلات ✓' : 'إضافة المنتج ✓'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
