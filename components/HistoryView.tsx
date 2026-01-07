import React from 'react';
import { StockEntry, Category } from '../types.ts';
import { Calendar, Search, Info } from 'lucide-react';

interface HistoryViewProps {
  entries: StockEntry[];
  categories: Category[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ entries, categories }) => {
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'ทั่วไป';

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">ประวัติการบันทึก</h2>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อสินค้า..." 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">วันเวลา</th>
                <th className="px-6 py-4 font-semibold">สินค้า</th>
                <th className="px-6 py-4 font-semibold text-right">จำนวน</th>
                <th className="px-6 py-4 font-semibold text-right">ราคารวม</th>
                <th className="px-6 py-4 font-semibold">รายละเอียดเพิ่ม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-slate-800 text-sm font-bold">
                        {new Date(entry.timestamp).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {new Date(entry.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{entry.productName}</span>
                      <span className="text-[10px] text-blue-500 uppercase font-bold tracking-tight">
                        {getCategoryName(entry.categoryId)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-600">
                    {entry.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">
                    ฿{entry.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {entry.iceDetails ? (
                      <div className="flex items-center space-x-2 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">
                        <Info size={12} />
                        <span>ค้าง {entry.iceDetails.currentLeftover} ถุง</span>
                      </div>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;