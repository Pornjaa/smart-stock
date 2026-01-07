
export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  image: string;
  unit: string;
}

export interface StockEntry {
  id: string;
  productId: string;
  productName: string;
  categoryId: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  timestamp: number;
  iceDetails?: {
    previousLeftover: number;
    collected: number;
    currentLeftover: number;
  };
}

export interface DebtEntry {
  id: string;
  customerName: string;
  description: string;
  amount: number;
  timestamp: number;
}

export type ViewType = 'dashboard' | 'entry' | 'history' | 'debts' | 'settings';
