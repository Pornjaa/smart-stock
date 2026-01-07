
import React, { useState } from 'react';
import { Category, Product, StockEntry, DebtEntry } from '../types';
import { ChevronLeft, Plus, Minus, Check, Package2, UserMinus, Calculator } from 'lucide-react';

interface EntryViewProps {
  categories: Category[];
  products: Product[];
  onAddEntry: (entry: StockEntry) => void;
  onAddDebt: (debt: DebtEntry) => void;
}

const EntryView: React.FC<EntryViewProps> = ({ categories, products, onAddEntry, onAddDebt }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Special States for Ice
  const [prevLeftover, setPrevLeftover] = useState<number>(0);
  const [iceCollected, setIceCollected] = useState<number>(0);

  // Special States for Debt
  const [debtName, setDebtName] = useState('');
  const [debtDetail, setDebtDetail] = useState('');
  const [debtAmount, setDebtAmount] = useState<number>(0);

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    if (cat.id === 'cat_debt') {
      setStep(3); // Go straight to debt form
    } else {
      setStep(2);
    }
  };

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setQuantity(1);
    setStep(3);
  };

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.categoryId === selectedCategory.id) 
    : [];

  const handleConfirm = () => {
    if (selectedCategory?.id === 'cat_debt') {
      const debt: DebtEntry = {
        id: Math.random().toString(36).substr(2, 9),
        customerName: debtName,
        description: debtDetail,
        amount: debtAmount,
        timestamp: Date.now(),
      };
      onAddDebt(debt);
    } else if (selectedProduct) {
      const entry: StockEntry = {
        id: Math.random().toString(36).substr(2, 9),
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        categoryId: selectedProduct.categoryId,
        quantity,
        pricePerUnit: selectedProduct.price,
        totalPrice: quantity * selectedProduct.price,
        timestamp: Date.now(),
        ...(selectedCategory?.id === 'cat_ice' && {
          iceDetails: {
            previousLeftover: prevLeftover,
            collected: iceCollected,
            currentLeftover: (prevLeftover + quantity) - iceCollected
          }
        })
      };
      onAddEntry(entry);
    }
    
    // Reset
    setStep(1);
    setSelectedCategory(null);
    setSelectedProduct(null);
    setQuantity(1);
    setPrevLeftover(0);
    setIceCollected(0);
    setDebtName('');
    setDebtDetail('');
    setDebtAmount(0);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-2 text-slate-500 mb-4">
        {step > 1 && (
          <button 
            onClick={() => setStep(step === 3 && selectedCategory?.id === 'cat_debt' ? 1 : (step === 3 ? 2 : 1))}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <h2 className="text-xl font-bold text-slate-800">
          {step === 1 && 'เลือกหมวดหมู่สินค้า'}
          {step === 2 && `${selectedCategory?.name}`}
          {step === 3 && (selectedCategory?.id === 'cat_debt' ? 'บันทึกยอดลูกค้าค้าง' : 'ระบุรายละเอียด')}
        </h2>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-2 gap-4 animate-fadeIn">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat)}
              className="group relative overflow-hidden rounded-3xl aspect-[16/10] shadow-md border border-slate-100 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.id === 'cat_debt' ? 'from-rose-900/90' : 'from-black/90'} via-black/30 to-transparent`} />
              <div className="absolute bottom-4 left-5 right-5 text-left">
                <p className="text-white font-bold text-xl">{cat.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 gap-3 animate-fadeIn">
          {filteredProducts.map(prod => (
            <button
              key={prod.id}
              onClick={() => handleSelectProduct(prod)}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-blue-500 hover:bg-blue-50/30 active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-100 text-slate-400 group-hover:text-blue-600 transition-colors">
                  <Package2 size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 text-lg">{prod.name}</p>
                  <p className="text-slate-500 text-sm">ราคา/หน่วย: ฿{prod.price}</p>
                </div>
              </div>
              <div className="text-blue-600">
                <Plus size={24} />
              </div>
            </button>
          ))}
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="inline-flex p-4 bg-slate-100 rounded-full text-slate-400">
                <Package2 size={48} />
              </div>
              <p className="text-slate-400 text-lg">ยังไม่มีข้อมูลสินค้าในหมวดหมู่นี้</p>
            </div>
          )}
        </div>
      )}

      {step === 3 && selectedCategory?.id === 'cat_debt' && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-rose-100 space-y-6 animate-scaleIn">
          <div className="text-center">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserMinus size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">เพิ่มรายการค้างเงิน</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">ชื่อลูกค้า</label>
              <input value={debtName} onChange={e => setDebtName(e.target.value)} type="text" placeholder="ระบุชื่อ..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none text-slate-900" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">รายการที่ค้าง</label>
              <input value={debtDetail} onChange={e => setDebtDetail(e.target.value)} type="text" placeholder="เช่น ค่าเหล้า 1 กลม..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none text-slate-900" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">จำนวนเงิน (บาท)</label>
              <input value={debtAmount} onChange={e => setDebtAmount(parseFloat(e.target.value) || 0)} type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-2xl font-bold text-rose-600 focus:ring-2 focus:ring-rose-500 outline-none" />
            </div>
          </div>
          <button onClick={handleConfirm} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-rose-200 flex items-center justify-center space-x-3 transition-all active:scale-95">
            <Check size={28} />
            <span className="text-xl">บันทึกยอดค้าง</span>
          </button>
        </div>
      )}

      {step === 3 && selectedProduct && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-8 animate-scaleIn">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-black text-slate-900">{selectedProduct.name}</h3>
            <p className="text-slate-500">หน่วยละ ฿{selectedProduct.price}</p>
          </div>

          {selectedCategory?.id === 'cat_ice' ? (
            <div className="space-y-6 bg-blue-50 p-6 rounded-2xl">
              <div className="flex items-center space-x-2 text-blue-800 font-bold mb-2">
                <Calculator size={20} />
                <span>คำนวณยอดถุงค้าง</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-400 uppercase">ค้างเดิม (ถุง)</label>
                  <input type="number" value={prevLeftover} onChange={e => setPrevLeftover(parseInt(e.target.value) || 0)} className="w-full p-3 bg-white rounded-xl font-bold text-slate-900 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-400 uppercase">ลงใหม่ (ถุง)</label>
                  <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 0)} className="w-full p-3 bg-white rounded-xl font-bold text-slate-900 outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-blue-400 uppercase">เก็บคืน/ขายไป (ถุง)</label>
                <input type="number" value={iceCollected} onChange={e => setIceCollected(parseInt(e.target.value) || 0)} className="w-full p-3 bg-white rounded-xl font-bold text-slate-900 outline-none" />
              </div>
              <div className="pt-4 border-t border-blue-200 flex justify-between items-center">
                <span className="text-blue-800 font-bold">ยอดค้างปัจจุบัน:</span>
                <span className="text-2xl font-black text-blue-600">{(prevLeftover + quantity) - iceCollected} ถุง</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-8">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600"><Minus size={32} /></button>
                <div className="flex flex-col items-center">
                  <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-32 text-center text-6xl font-black bg-transparent outline-none text-blue-600" />
                  <span className="text-slate-400 font-bold mt-2 uppercase">{selectedProduct.unit}</span>
                </div>
                <button onClick={() => setQuantity(quantity + 1)} className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600"><Plus size={32} /></button>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button onClick={handleConfirm} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center space-x-3 active:scale-95 transition-all">
              <Check size={28} />
              <span className="text-xl">บันทึกรายการ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryView;
