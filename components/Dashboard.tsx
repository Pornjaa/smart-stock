
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { StockEntry, Category } from '../types';

interface DashboardProps {
  entries: StockEntry[];
  categories: Category[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard: React.FC<DashboardProps> = ({ entries, categories }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const thisWeek = today - (now.getDay() * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const thisYear = new Date(now.getFullYear(), 0, 1).getTime();

    return {
      totalToday: entries.filter(e => e.timestamp >= today).reduce((acc, curr) => acc + curr.totalPrice, 0),
      totalWeek: entries.filter(e => e.timestamp >= thisWeek).reduce((acc, curr) => acc + curr.totalPrice, 0),
      totalMonth: entries.filter(e => e.timestamp >= thisMonth).reduce((acc, curr) => acc + curr.totalPrice, 0),
      totalYear: entries.filter(e => e.timestamp >= thisYear).reduce((acc, curr) => acc + curr.totalPrice, 0),
    };
  }, [entries]);

  const categoryData = useMemo(() => {
    const dataMap: Record<string, number> = {};
    entries.forEach(e => {
      const cat = categories.find(c => c.id === e.categoryId);
      const name = cat ? cat.name : 'อื่นๆ';
      dataMap[name] = (dataMap[name] || 0) + e.totalPrice;
    });
    return Object.entries(dataMap).map(([name, value]) => ({ name, value }));
  }, [entries, categories]);

  const timelineData = useMemo(() => {
    // Last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('th-TH', { weekday: 'short' });
    });

    const dataMap: Record<string, number> = {};
    entries.forEach(e => {
      const date = new Date(e.timestamp).toLocaleDateString('th-TH', { weekday: 'short' });
      dataMap[date] = (dataMap[date] || 0) + e.totalPrice;
    });

    return days.map(day => ({ name: day, total: dataMap[day] || 0 }));
  }, [entries]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'วันนี้', value: stats.totalToday, color: 'bg-blue-500' },
          { label: 'สัปดาห์นี้', value: stats.totalWeek, color: 'bg-emerald-500' },
          { label: 'เดือนนี้', value: stats.totalMonth, color: 'bg-amber-500' },
          { label: 'ปีนี้', value: stats.totalYear, color: 'bg-indigo-500' },
        ].map((item) => (
          <div key={item.label} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
            <span className="text-slate-500 text-sm">{item.label}</span>
            <span className="text-xl md:text-2xl font-bold text-slate-800">฿{item.value.toLocaleString()}</span>
            <div className={`h-1.5 w-12 rounded-full ${item.color}`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">ความเคลื่อนไหว 7 วันที่ผ่านมา</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">สัดส่วนตามหมวดหมู่</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
