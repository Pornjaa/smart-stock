
import React, { useState, useEffect } from 'react';
import { Category, Product } from '../types';
import { storageService } from '../services/storageService';
import { Plus, Trash2, Download, Upload, HardDrive, Package2, Tag, Image as ImageIcon, X } from 'lucide-react';

interface SettingsViewProps {
  categories: Category[];
  products: Product[];
  onUpdateCategories: (cats: Category[]) => void;
  onUpdateProducts: (prods: Product[]) => void;
}

const PRESET_IMAGES = [
  { name: 'เครื่องดื่ม', url: 'https://images.unsplash.com/photo-1544145945-f904253d0c7b?auto=format&fit=crop&w=400&q=80' },
  { name: 'ขนม/ของกิน', url: 'https://images.unsplash.com/photo-15994906592b3-e3b9c07cf4f4?auto=format&fit=crop&w=400&q=80' },
  { name: 'ของใช้ในบ้าน', url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80' },
  { name: 'ผัก/ผลไม้', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80' },
  { name: 'เครื่องเขียน', url: 'https://images.unsplash.com/photo-1583484963886-cfe2bef3183b?auto=format&fit=crop&w=400&q=80' },
  { name: 'น้ำแข็ง/แช่เย็น', url: 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?auto=format&fit=crop&w=400&q=80' },
  { name: 'ยา/เวชภัณฑ์', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
  { name: 'อื่นๆ', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80' },
];

const SettingsView: React.FC<SettingsViewProps> = ({ categories, products, onUpdateCategories, onUpdateProducts }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'data'>('products');
  const [stats, setStats] = useState({ sizeInMB: '0', percentage: '0' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddCatForm, setShowAddCatForm] = useState(false);
  
  // Product Form State
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newUnit, setNewUnit] = useState('ขวด');
  const [newCatId, setNewCatId] = useState('');

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState(PRESET_IMAGES[0].url);

  useEffect(() => {
    setStats(storageService.getStorageStats());
    if (categories.length > 0 && !newCatId) setNewCatId(categories[0].id);
  }, [categories]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice || !newCatId) return;

    const newProd: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      price: parseFloat(newPrice),
      unit: newUnit,
      categoryId: newCatId,
      image: '' 
    };

    onUpdateProducts([...products, newProd]);
    setNewName('');
    setNewPrice('');
    setShowAddForm(false);
    setStats(storageService.getStorageStats());
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    const newCat: Category = {
      id: `cat_${Math.random().toString(36).substr(2, 5)}`,
      name: newCatName,
      image: newCatImage
    };

    onUpdateCategories([...categories, newCat]);
    setNewCatName('');
    setShowAddCatForm(false);
    setStats(storageService.getStorageStats());
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('ยืนยันการลบสินค้า?')) {
      onUpdateProducts(products.filter(p => p.id !== id));
      setStats(storageService.getStorageStats());
    }
  };

  const handleDeleteCategory = (id: string) => {
    const linkedProducts = products.filter(p => p.categoryId === id);
    if (linkedProducts.length > 0) {
      alert(`ไม่สามารถลบหมวดหมู่นี้ได้ เนื่องจากยังมีสินค้า "${linkedProducts[0].name}" และอื่นๆ รวม ${linkedProducts.length} รายการใช้งานอยู่`);
      return;
    }

    if (confirm('ยืนยันการลบหมวดหมู่?')) {
      onUpdateCategories(categories.filter(c => c.id !== id));
      setStats(storageService.getStorageStats());
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        const success = storageService.importData(result);
        if (success) {
          alert('นำเข้าข้อมูลสำเร็จ!');
          window.location.reload();
        } else {
          alert('นำเข้าข้อมูลล้มเหลว');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10 text-slate-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">ตั้งค่าระบบ</h2>
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl self-start backdrop-blur-sm">
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Package2 size={18} />
            <span>สินค้า</span>
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'categories' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Tag size={18} />
            <span>หมวดหมู่</span>
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'data' ? 'bg-white shadow-md text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <HardDrive size={18} />
            <span>ฐานข้อมูล</span>
          </button>
        </div>
      </div>

      {activeTab === 'products' && (
        <div className="space-y-4">
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full py-6 border-2 border-dashed border-blue-200 rounded-3xl flex items-center justify-center space-x-3 text-blue-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all bg-white"
          >
            <Plus size={28} />
            <span className="font-bold text-lg">เพิ่มสินค้าใหม่</span>
          </button>

          {showAddForm && (
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-blue-100 animate-scaleIn space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl text-slate-800">กรอกข้อมูลสินค้า</h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
              </div>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">ชื่อสินค้า</label>
                  <input required value={newName} onChange={e => setNewName(e.target.value)} type="text" placeholder="เช่น นมจืด 250มล." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">หมวดหมู่</label>
                  <select value={newCatId} onChange={e => setNewCatId(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">ราคาทุน (บาท)</label>
                  <input required value={newPrice} onChange={e => setNewPrice(e.target.value)} type="number" placeholder="0.00" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">หน่วยนับ</label>
                  <input value={newUnit} onChange={e => setNewUnit(e.target.value)} type="text" placeholder="ขวด, ซอง, ลัง..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2 flex space-x-3 pt-2">
                  <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">ยืนยันการเพิ่ม</button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-8 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all">ยกเลิก</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <Package2 size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{product.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600 font-black">฿{product.price}</span>
                      <span className="text-slate-400 text-xs">/ {product.unit}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDeleteProduct(product.id)} className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6">
          <button 
            onClick={() => setShowAddCatForm(true)}
            className="w-full py-6 border-2 border-dashed border-emerald-200 rounded-3xl flex items-center justify-center space-x-3 text-emerald-400 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all bg-white"
          >
            <Tag size={28} />
            <span className="font-bold text-lg">เพิ่มหมวดหมู่ใหม่</span>
          </button>

          {showAddCatForm && (
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-emerald-100 animate-scaleIn space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl text-slate-800">สร้างหมวดหมู่ใหม่</h3>
                <button onClick={() => setShowAddCatForm(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
              </div>
              <form onSubmit={handleAddCategory} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">ชื่อหมวดหมู่</label>
                  <input required value={newCatName} onChange={e => setNewCatName(e.target.value)} type="text" placeholder="เช่น อุปกรณ์ซักรีด" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-bold" />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">เลือกรูปภาพประกอบ</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setNewCatImage(img.url)}
                        className={`relative rounded-2xl overflow-hidden aspect-square border-4 transition-all ${newCatImage === img.url ? 'border-emerald-500 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2">
                          <p className="text-[10px] text-white font-bold truncate">{img.name}</p>
                        </div>
                        {newCatImage === img.url && (
                          <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full">
                            <Plus size={12} strokeWidth={4} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">บันทึกหมวดหมู่</button>
                  <button type="button" onClick={() => setShowAddCatForm(false)} className="px-8 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all">ยกเลิก</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(cat => (
              <div key={cat.id} className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100 text-center relative group hover:shadow-lg transition-all">
                <div className="relative mb-4 overflow-hidden rounded-[2rem] aspect-square">
                  <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat.name} />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <p className="font-bold text-slate-800 text-lg">{cat.name}</p>
                <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 inline-block px-3 py-1 rounded-full">Category</div>
                
                {/* ปุ่มลบ (จะแสดงเมื่อเอาเมาส์มาวาง) */}
                <button 
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="absolute top-6 right-6 p-2.5 bg-white/90 text-rose-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:bg-rose-500 hover:text-white"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-10">
            <div className="flex items-center space-x-5">
              <div className="p-5 bg-blue-50 text-blue-600 rounded-[2rem]">
                <HardDrive size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">จัดการฐานข้อมูล</h3>
                <p className="text-slate-500">ข้อมูลของคุณปลอดภัยและถูกเก็บไว้ในเครื่องนี้เท่านั้น</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">พื้นที่การจัดเก็บ</p>
                  <p className="text-3xl font-black text-slate-900">{stats.sizeInMB} <span className="text-lg text-slate-400">MB</span></p>
                </div>
                <span className="text-blue-600 font-black text-xl">{stats.percentage}%</span>
              </div>
              <div className="h-6 bg-slate-100 rounded-full overflow-hidden p-1.5 shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${parseFloat(stats.percentage) > 80 ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
              <button 
                onClick={() => storageService.exportData()}
                className="flex items-center justify-center space-x-3 p-6 bg-slate-900 hover:bg-black text-white rounded-3xl transition-all shadow-2xl shadow-slate-200 font-bold text-lg"
              >
                <Download size={24} />
                <span>สำรองไฟล์ (Export)</span>
              </button>
              
              <label className="flex items-center justify-center space-x-3 p-6 bg-white border-4 border-slate-100 hover:border-blue-500 text-slate-700 rounded-3xl cursor-pointer transition-all font-bold text-lg">
                <Upload size={24} />
                <span>ดึงข้อมูลกลับ (Import)</span>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
