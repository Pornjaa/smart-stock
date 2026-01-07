import { Category, Product, StockEntry, DebtEntry } from '../types.ts';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../constants.tsx';

const KEYS = {
  CATEGORIES: 'stock_categories',
  PRODUCTS: 'stock_products',
  ENTRIES: 'stock_entries',
  DEBTS: 'stock_debts',
};

export const storageService = {
  getCategories: (): Category[] => {
    try {
      const data = localStorage.getItem(KEYS.CATEGORIES);
      return data ? JSON.parse(data) : INITIAL_CATEGORIES;
    } catch (e) {
      return INITIAL_CATEGORIES;
    }
  },
  saveCategories: (data: Category[]) => {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(data));
  },
  getProducts: (): Product[] => {
    try {
      const data = localStorage.getItem(KEYS.PRODUCTS);
      return data ? JSON.parse(data) : INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  },
  saveProducts: (data: Product[]) => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(data));
  },
  getEntries: (): StockEntry[] => {
    try {
      const data = localStorage.getItem(KEYS.ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  saveEntries: (data: StockEntry[]) => {
    localStorage.setItem(KEYS.ENTRIES, JSON.stringify(data));
  },
  addEntry: (entry: StockEntry) => {
    const entries = storageService.getEntries();
    const updated = [entry, ...entries];
    storageService.saveEntries(updated);
    return updated;
  },
  getDebts: (): DebtEntry[] => {
    try {
      const data = localStorage.getItem(KEYS.DEBTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  saveDebts: (data: DebtEntry[]) => {
    localStorage.setItem(KEYS.DEBTS, JSON.stringify(data));
  },
  addDebt: (debt: DebtEntry) => {
    const debts = storageService.getDebts();
    const updated = [debt, ...debts];
    storageService.saveDebts(updated);
    return updated;
  },
  getStorageStats: () => {
    let totalSize = 0;
    try {
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          const item = localStorage.getItem(key);
          if (item) {
            totalSize += (item.length + key.length) * 2; 
          }
        }
      }
    } catch (e) {
      console.warn("Could not calculate storage size", e);
    }
    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    const limitMB = 5; 
    const percentage = Math.min(100, (parseFloat(sizeInMB) / limitMB) * 100).toFixed(1);
    return { sizeInMB, percentage };
  },
  exportData: () => {
    const data = {
      categories: storageService.getCategories(),
      products: storageService.getProducts(),
      entries: storageService.getEntries(),
      debts: storageService.getDebts(),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartstock-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
  importData: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.categories) storageService.saveCategories(data.categories);
      if (data.products) storageService.saveProducts(data.products);
      if (data.entries) storageService.saveEntries(data.entries);
      if (data.debts) storageService.saveDebts(data.debts);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
};