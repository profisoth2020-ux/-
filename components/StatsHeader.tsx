
import React from 'react';

interface StatsProps {
  stats: {
    total: number;
    onRoad: number;
    parked: number;
    outOfService: number;
  };
}

const StatsHeader: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
      <StatCard label="إجمالي الأسطول" value={stats.total} icon="fa-bus" color="blue" />
      <StatCard label="في الطريق" value={stats.onRoad} icon="fa-route" color="emerald" />
      <StatCard label="حافلات متوقفة" value={stats.parked} icon="fa-square-parking" color="amber" />
      <StatCard label="قيد الصيانة" value={stats.outOfService} icon="fa-wrench" color="slate" />
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: number, icon: string, color: string }> = ({ label, value, icon, color }) => {
  const colorClasses: any = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    slate: 'text-slate-600 bg-slate-50 border-slate-100',
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 transition-all hover:shadow-md cursor-default group" dir="rtl">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${colorClasses[color]} transition-transform group-hover:scale-110`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
      </div>
    </div>
  );
};

export default StatsHeader;
