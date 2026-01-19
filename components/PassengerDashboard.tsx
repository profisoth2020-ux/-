
import React, { useState } from 'react';
import { Bus, Driver, BusStatus } from '../types';
import MapView from './MapView';

interface PassengerDashboardProps {
  buses: Bus[];
  drivers: Driver[];
  activeTab: string;
}

const PassengerDashboard: React.FC<PassengerDashboardProps> = ({ buses, drivers, activeTab }) => {
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  const activeBuses = buses.filter(b => b.status === BusStatus.ON_ROAD);
  const selectedBus = buses.find(b => b.id === selectedBusId);
  const selectedDriver = selectedBus ? drivers.find(d => d.id === selectedBus.driverId) : null;

  if (activeTab === 'nearby') {
    return (
      <div className="p-8 flex items-center justify-center h-full bg-slate-50 text-slate-400" dir="rtl">
        <div className="text-center">
          <i className="fa-solid fa-map-pin text-6xl mb-6 opacity-20"></i>
          <h2 className="text-2xl font-black text-slate-800">المواقف القريبة</h2>
          <p className="font-bold mt-2">خاصية البحث عن أقرب موقف حافلات قيد التطوير.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden" dir="rtl">
      {/* Top Header */}
      <header className="p-6 bg-white border-b border-slate-100 flex-shrink-0 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">تتبع الحافلات</h1>
          <p className="text-xs font-bold text-slate-400 mt-1">اختر حافلة لمتابعة مسارها المباشر في الجزائر العاصمة</p>
        </div>
        <div className="flex gap-3">
           <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] font-black text-emerald-700 uppercase">{activeBuses.length} حافلة نشطة</span>
           </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
        {/* Main Map Area */}
        <div className="flex-1 relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-200 min-h-[350px]">
          <MapView 
            buses={buses} 
            selectedBusId={selectedBusId} 
            onSelectBus={(id) => setSelectedBusId(id)} 
          />
          
          {/* Overlay Info for Selected Bus (Mobile/Floating) */}
          {selectedBus && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-sm">
               <div className="bg-slate-900 text-white rounded-[2rem] p-5 shadow-2xl border border-white/10 backdrop-blur-md">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <i className="fa-solid fa-bus text-lg"></i>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">تتبع مباشر</p>
                        <h4 className="text-sm font-black leading-none">{selectedBus.plateNumber}</h4>
                      </div>
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-0.5">السرعة</p>
                       <p className="text-lg font-black leading-none">{selectedBus.speed} <span className="text-[10px] text-slate-500">كم/س</span></p>
                    </div>
                 </div>
                 
                 {selectedDriver && (
                   <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <i className="fa-solid fa-user-tie text-sm"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-[9px] font-bold text-slate-500">قائد الحافلة</p>
                        <p className="text-xs font-black">{selectedDriver.name}</p>
                      </div>
                      <button 
                        onClick={() => window.location.href = `tel:${selectedDriver.phone}`}
                        className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all active:scale-90"
                      >
                        <i className="fa-solid fa-phone text-[10px]"></i>
                      </button>
                   </div>
                 )}
                 
                 <button 
                   onClick={() => setSelectedBusId(null)}
                   className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                 >
                   إلغاء التتبع
                 </button>
               </div>
            </div>
          )}
        </div>

        {/* Bus Selector Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-4 overflow-hidden">
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 p-6 flex flex-col h-full overflow-hidden">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
              <i className="fa-solid fa-list-ul text-blue-600"></i>
              قائمة الحافلات العاملة
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 pl-2">
              {activeBuses.length > 0 ? activeBuses.map(bus => {
                const driver = drivers.find(d => d.id === bus.driverId);
                const isSelected = selectedBusId === bus.id;
                return (
                  <button
                    key={bus.id}
                    onClick={() => setSelectedBusId(bus.id)}
                    className={`w-full p-4 rounded-2xl transition-all flex items-center gap-4 border-2 text-right ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' 
                        : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-blue-600 shadow-sm'
                    }`}>
                      <i className="fa-solid fa-bus-simple text-lg"></i>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className={`font-black text-xs truncate uppercase ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {bus.plateNumber}
                      </p>
                      <p className={`text-[10px] font-bold mt-0.5 truncate ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                        سائق: {driver ? driver.name : 'غير محدد'}
                      </p>
                    </div>
                    <div className={`text-[10px] font-black px-2 py-1 rounded ${isSelected ? 'bg-white/10' : 'bg-emerald-100 text-emerald-700'}`}>
                      نشط
                    </div>
                  </button>
                );
              }) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <i className="fa-solid fa-bus-slash text-4xl text-slate-100 mb-4"></i>
                  <p className="text-xs font-bold text-slate-400">لا توجد حافلات في الطريق حالياً</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
               <p className="text-[10px] font-black text-blue-800 leading-relaxed">
                 <i className="fa-solid fa-circle-info ml-1"></i>
                 يمكنك الضغط على أي حافلة في القائمة أو على الخريطة لتتبع موقعها وسرعتها في الوقت الفعلي.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard;
