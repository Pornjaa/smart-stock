
import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { ViewType, StockEntry, Product, Category, DebtEntry } from './types';
import Dashboard from './components/Dashboard';
import EntryView from './components/EntryView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import DebtView from './components/DebtView';
import { LayoutDashboard, PlusCircle, ClipboardList, Settings, Warehouse, Users } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [debts, setDebts] = useState<DebtEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCategories(storageService.getCategories());
    setProducts(storageService.getProducts());
    setEntries(storageService.getEntries());
    setDebts(storageService.getDebts());
    setLoading(false);
  }, []);

  const handleAddEntry = (entry: StockEntry) => {
    const updated = storageService.addEntry(entry);
    setEntries(updated);
    setView('dashboard');
  };

  const handleAddDebt = (debt: DebtEntry) => {
    const updated = storageService.addDebt(debt);
    setDebts(updated);
    setView('debts');
  };

  const handleDeleteDebt = (id: string) => {
    const updated = debts.filter(d => d.id !== id);
    setDebts(updated);
    storageService.saveDebts(updated);
  };

  const navItems = [
    { id: 'dashboard', label: 'ภาพรวม', icon: LayoutDashboard },
    { id: 'entry', label: 'บันทึกใหม่', icon: PlusCircle },
    { id: 'debts', label: 'คนค้าง', icon: Users },
    { id: 'history', label: 'ประวัติ', icon: ClipboardList },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings },
  ];

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pb-24 md:pb-0">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-8 flex items-center space-x-3 text-blue-600">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <Warehouse size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">SmartStock</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewType)}
                className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl font-medium transition-all ${
                  view === item.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon size={22} strokeWidth={view === item.id ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6">
          <div className="bg-slate-900 rounded-3xl p-5 text-white">
            <p className="text-xs text-slate-400 mb-1">สถานะร้าน</p>
            <p className="text-sm font-semibold truncate">ออนไลน์ (Offline Storage)</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 lg:p-12">
        <header className="mb-8 md:hidden flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Warehouse size={18} />
            </div>
            <span className="text-xl font-black text-slate-900">SmartStock</span>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {view === 'dashboard' && <Dashboard entries={entries} categories={categories} />}
          {view === 'entry' && (
            <EntryView 
              categories={categories} 
              products={products} 
              onAddEntry={handleAddEntry} 
              onAddDebt={handleAddDebt}
            />
          )}
          {view === 'debts' && <DebtView debts={debts} onDeleteDebt={handleDeleteDebt} />}
          {view === 'history' && <HistoryView entries={entries} categories={categories} />}
          {view === 'settings' && (
            <SettingsView 
              categories={categories} 
              products={products} 
              onUpdateCategories={(cats) => { setCategories(cats); storageService.saveCategories(cats); }}
              onUpdateProducts={(prods) => { setProducts(prods); storageService.saveProducts(prods); }}
            />
          )}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-6 left-4 right-4 bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-3xl shadow-2xl flex items-center justify-around p-3 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewType)}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
                isActive ? 'text-blue-600 scale-110' : 'text-slate-400'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-bold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
