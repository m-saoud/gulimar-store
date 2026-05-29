// src/lib/data.ts
// Seed data for Gulimar Store MVP

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  sizes: string[];
  colors?: string[];
  colorImages?: Record<string, string>;
  badge?: string;
  gradient: string;
  icon: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  items: {
    id: string;
    name: string;
    price: number;
    size: string;
    color?: string;
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: string;
  paymentProof?: string;
}

export const CATEGORIES = ['الكل', 'فساتين', 'بيجامات', 'لانجري', 'طلعت'];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'فستان سهاري أنيق',
    price: 25000,
    category: 'فساتين',
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#F2C94C', '#FFFFFF', '#E0A96D'],
    badge: 'الأكثر مبيعاً',
    gradient: 'cat-gradient-dress',
    icon: '👗',
  },
  {
    id: 'p2',
    name: 'فستان حفلي براق',
    price: 45000,
    category: 'فساتين',
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#C0C0C0', '#F2C94C', '#FFC0CB'],
    badge: 'جديد',
    gradient: 'cat-gradient-dress',
    icon: '✨',
  },
  {
    id: 'p3',
    name: 'فستان كاجوال يومي',
    price: 18000,
    category: 'فساتين',
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#E0A96D', '#FFC0CB', '#000080'],
    gradient: 'cat-gradient-dress',
    icon: '🌸',
  },
  {
    id: 'p4',
    name: 'بيجامة قطنية مريحة',
    price: 15000,
    category: 'بيجامات',
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#FFC0CB', '#FFFFFF', '#E0A96D'],
    badge: 'الأكثر مبيعاً',
    gradient: 'cat-gradient-pyjama',
    icon: '🌙',
  },
  {
    id: 'p5',
    name: 'بيجامة شتوية دافئة',
    price: 22000,
    category: 'بيجامات',
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000080', '#000000', '#E0A96D'],
    gradient: 'cat-gradient-pyjama',
    icon: '⭐',
  },
  {
    id: 'p6',
    name: 'لانجري ناعم فضي',
    price: 30000,
    category: 'لانجري',
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#C0C0C0', '#FFFFFF', '#000000'],
    badge: 'حصري',
    gradient: 'cat-gradient-lingerie',
    icon: '💎',
  },
  {
    id: 'p7',
    name: 'لانجري رومانسي وردي',
    price: 28000,
    category: 'لانجري',
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#FFC0CB', '#FF0000', '#FFFFFF'],
    gradient: 'cat-gradient-lingerie',
    icon: '🌹',
  },
  {
    id: 'p8',
    name: 'قميص صيفي خفيف',
    price: 18000,
    category: 'طلعت',
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#FFFFFF', '#E0A96D', '#C0C0C0'],
    gradient: 'cat-gradient-outing',
    icon: '☀️',
  },
  {
    id: 'p9',
    name: 'سروال شيفون أنيق',
    price: 22000,
    category: 'طلعت',
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#FFFFFF', '#E0A96D'],
    gradient: 'cat-gradient-outing',
    icon: '💫',
  },
  {
    id: 'p10',
    name: 'طقم بلوزة وبنطلون',
    price: 35000,
    category: 'طلعت',
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#E0A96D', '#000000', '#FFC0CB'],
    badge: 'جديد',
    gradient: 'cat-gradient-outing',
    icon: '🎀',
  },
];

export const DEMO_ORDERS: Order[] = [
  {
    id: 'JUL-1001',
    customerName: 'سارة الأحمد',
    phone: '0933123456',
    address: 'طرطوس - شارع الكورنيش',
    paymentMethod: 'cash',
    items: [
      { id: 'p1', name: 'فستان سهاري أنيق', price: 25000, size: 'M', quantity: 1 },
      { id: 'p4', name: 'بيجامة قطنية مريحة', price: 15000, size: 'L', quantity: 2 },
    ],
    total: 55000,
    status: 'delivered',
    createdAt: '2025-05-25T10:30:00Z',
  },
  {
    id: 'JUL-1002',
    customerName: 'ريم المحمد',
    phone: '0944987654',
    address: 'طرطوس - حي الزهراء',
    paymentMethod: 'syriatel_cash',
    items: [
      { id: 'p2', name: 'فستان حفلي براق', price: 45000, size: 'S', quantity: 1 },
    ],
    total: 45000,
    status: 'shipped',
    createdAt: '2025-05-26T14:15:00Z',
    paymentProof: '/demo-proof.jpg',
  },
  {
    id: 'JUL-1003',
    customerName: 'نور العلي',
    phone: '0911555777',
    address: 'حمص - الإنشاءات',
    paymentMethod: 'pickup',
    items: [
      { id: 'p6', name: 'لانجري ناعم فضي', price: 30000, size: 'M', quantity: 1 },
      { id: 'p8', name: 'قميص صيفي خفيف', price: 18000, size: 'L', quantity: 1 },
    ],
    total: 48000,
    status: 'pending',
    createdAt: '2025-05-27T09:00:00Z',
  },
  {
    id: 'JUL-1004',
    customerName: 'لمى الحسن',
    phone: '0933876543',
    address: 'طرطوس - المدينة الجديدة',
    paymentMethod: 'sham_cash',
    items: [
      { id: 'p10', name: 'طقم بلوزة وبنطلون', price: 35000, size: 'XL', quantity: 1 },
    ],
    total: 35000,
    status: 'pending',
    createdAt: '2025-05-28T08:45:00Z',
    paymentProof: '/demo-proof.jpg',
  },
];

export function generateOrderId(): string {
  const num = 1005 + Math.floor(Math.random() * 100);
  return `JUL-${num}`;
}

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const stored = localStorage.getItem('gulimar_products');
    if (stored) return JSON.parse(stored);
  } catch {}
  return INITIAL_PRODUCTS;
}

export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return DEMO_ORDERS;
  try {
    const stored = localStorage.getItem('gulimar_orders');
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEMO_ORDERS;
}
