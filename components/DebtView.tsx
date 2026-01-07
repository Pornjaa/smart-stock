
import React from 'react';
import { DebtEntry } from '../types';
import { UserMinus, Trash2, Calendar, Banknote } from 'lucide-react';

interface DebtViewProps {
  debts: DebtEntry[];
  onDeleteDebt: (id: string) => void;
}

const DebtView: React.FC<DebtViewProps> = ({ debts, onDeleteDebt }) => {
  const totalDebt = debts.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800">สมุดรายชื่อคนค้าง</h2>
        <div className="bg-rose-50 px-4 py-2 rounded-2xl flex items-center space-x-2">
          <Banknote className="text-rose-500" size={20} />
          <span className="text-rose-600 font-black">รวมทั้งสิ้น: ฿{totalDebt.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {debts.map((debt) => (
          <div key={debt.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between relative group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                  <UserMinus size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{debt.customerName}</h3>
                  <p className="text-slate-500 text-sm">{debt.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-rose-600">฿{debt.amount.toLocaleString()}</p>
                <div className="flex items-center justify-end text-[10px] text-slate-400 mt-1">
                  <Calendar size={10} className="mr-1" />
                  {new Date(debt.timestamp).toLocaleDateString('th-TH')}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                if(confirm(`ยืนยันว่า ${debt.customerName} ชำระเงินคืนแล้ว?`)) {
                  onDeleteDebt(debt.id);
                }
              }}
              className="w-full mt-4 py-3 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 font-bold rounded-xl flex items-center justify-center space-x-2 transition-all"
            >
              <Check size={18} />
              <span>ชำระคืนแล้ว (ลบออก)</span>
            </button>
          </div>
        ))}
        {debts.length === 0 && (
          <div className="md:col-span-2 py-20 text-center space-y-4">
            <div className="inline-flex p-6 bg-slate-50 text-slate-200 rounded-full">
              <UserMinus size={64} />
            </div>
            <p className="text-slate-400 text-lg font-medium italic">ไม่มีข้อมูลลูกค้าค้างในขณะนี้</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Check = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

export default DebtView;
