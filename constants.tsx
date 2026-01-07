import { Category, Product } from './types.ts';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_soda', name: 'น้ำอัดลม', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80' },
  { id: 'cat_liquor', name: 'เหล้า', image: 'https://images.unsplash.com/photo-1569701881644-83955f2f4581?auto=format&fit=crop&w=400&q=80' },
  { id: 'cat_beer', name: 'เบียร์', image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=400&q=80' },
  { id: 'cat_water', name: 'น้ำเปล่า', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=400&q=80' },
  { id: 'cat_ice', name: 'น้ำแข็ง', image: 'https://images.unsplash.com/photo-1516641397576-9d3c5b52541a?auto=format&fit=crop&w=400&q=80' },
  { id: 'cat_energy', name: 'เครื่องดื่มบำรุงกำลัง', image: 'https://images.unsplash.com/photo-1622543925917-763c34d1538c?auto=format&fit=crop&w=400&q=80' },
  { id: 'cat_cig', name: 'บุหรี่', image: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee1?auto=format&fit=crop&w=400&q=80' },
  { id: 'cat_other', name: 'อื่นๆ', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80' },
  { id: 'cat_debt', name: 'ลูกค้าค้าง', image: 'https://images.unsplash.com/photo-1554224155-1696413575a8?auto=format&fit=crop&w=400&q=80' },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', categoryId: 'cat_soda', name: 'โค้ก 325มล.', price: 15, unit: 'กระป๋อง', image: '' },
  { id: 'p2', categoryId: 'cat_soda', name: 'เป๊ปซี่ 1.2ลิตร', price: 30, unit: 'ขวด', image: '' },
  { id: 'p3', categoryId: 'cat_beer', name: 'เบียร์ลีโอ (ขวดใหญ่)', price: 60, unit: 'ขวด', image: '' },
  { id: 'p4', categoryId: 'cat_water', name: 'น้ำดื่มคริสตัล 600มล.', price: 7, unit: 'ขวด', image: '' },
  { id: 'p5', categoryId: 'cat_cig', name: 'กรองทิพย์', price: 105, unit: 'ซอง', image: '' },
  { id: 'p_ice', categoryId: 'cat_ice', name: 'น้ำแข็งหลอด', price: 40, unit: 'กระสอบ', image: '' },
];