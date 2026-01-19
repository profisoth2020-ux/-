
import React from 'react';
import { Driver } from '../types';

interface DriverListProps {
  drivers: Driver[];
  onAddDriver: () => void;
}

const DriverList: React.FC<DriverListProps> = ({ drivers, onAddDriver }) => {
  const handleWhatsApp = (phone: string) => {
    const cleanedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanedPhone}`, '_blank');
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="p-8" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">إدارة شؤون السائقين</h1>
        <button 
          onClick={onAddDriver}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 font-black text-sm flex items-center gap-2"
        >
          <i className="fa-solid fa-user-plus"></i> إضافة سائق جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.length > 0 ? drivers.map(driver => (
          <div key={driver.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                <i className="fa-solid fa-user-tie text-2xl"></i>
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-black text-slate-900 text-lg leading-none mb-1">{driver.name}</h3>
                <p className="text-xs text-slate-400 font-bold">{driver.email}</p>
              </div>
              <span className={`w-3 h-3 rounded-full ${driver.isActive ? 'bg-emerald-500' : 'bg-slate-300'} shadow-sm`}></span>
            </div>
            
            <div className="space-y-3 pt-6 border-t border-slate-50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-black uppercase">رقم الهاتف</span>
                <span className="font-black text-slate-700" dir="ltr">{driver.phone}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-black uppercase">الحافلة الحالية</span>
                <span className={`font-black ${driver.currentBusId ? 'text-blue-600' : 'text-slate-300 italic'}`}>
                  {driver.currentBusId || 'غير مسند'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
               <button 
                 onClick={() => handleWhatsApp(driver.phone)}
                 className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors font-black text-xs"
               >
                 <i className="fa-brands fa-whatsapp text-lg"></i> واتساب
               </button>
               <button 
                 onClick={() => handleCall(driver.phone)}
                 className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-black text-xs"
               >
                 <i className="fa-solid fa-phone"></i> اتصال
               </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold italic">
            لا يوجد سائقون مسجلون في النظام حالياً.
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverList;
