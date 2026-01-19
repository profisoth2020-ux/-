
import React from 'react';
import { Bus, BusStatus, Driver } from '../types';

interface BusListProps {
  buses: Bus[];
  drivers: Driver[];
  selectedBusId: string | null;
  onSelectBus: (id: string) => void;
}

const BusList: React.FC<BusListProps> = ({ buses, drivers, selectedBusId, onSelectBus }) => {
  const getDriverForBus = (driverId: string) => {
    return drivers.find(d => d.id === driverId);
  };

  const handleCall = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    const cleanedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanedPhone}`, '_blank');
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 flex flex-col h-[350px] overflow-hidden" dir="rtl">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide">الأسطول المباشر</h3>
        <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg shadow-blue-200">
          {buses.length} مركبة
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {buses.map(bus => {
          const driver = getDriverForBus(bus.driverId);
          const isSelected = selectedBusId === bus.id;
          return (
            <div
              key={bus.id}
              onClick={() => onSelectBus(bus.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 border-2 ${
                isSelected 
                  ? 'bg-blue-50/50 border-blue-200 shadow-sm' 
                  : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50/50'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                bus.status === BusStatus.ON_ROAD ? 'bg-emerald-100 text-emerald-600' : 
                bus.status === BusStatus.PARKED ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
              }`}>
                <i className={`fa-solid ${isSelected ? 'fa-bus-simple' : 'fa-bus'} text-xl`}></i>
              </div>
              <div className="flex-1 overflow-hidden text-right">
                <p className="font-black text-slate-900 text-sm truncate uppercase">{bus.plateNumber}</p>
                <div className="flex items-center gap-3 mt-1 justify-end">
                   {bus.status === BusStatus.ON_ROAD && (
                     <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                       <i className="fa-solid fa-gauge-high"></i> {bus.speed} كم/س
                     </span>
                   )}
                   <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                     bus.status === BusStatus.ON_ROAD ? 'text-emerald-700 bg-emerald-100' : 'text-slate-500 bg-slate-100'
                   }`}>
                     {bus.status === BusStatus.ON_ROAD ? 'متحرك' : bus.status === BusStatus.PARKED ? 'متوقف' : 'خارج الخدمة'}
                   </span>
                </div>
              </div>
              <div className="flex gap-2">
                {driver && (
                  <>
                    <button 
                      onClick={(e) => handleWhatsApp(e, driver.phone)}
                      className="w-9 h-9 text-emerald-500 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all flex items-center justify-center border border-emerald-100/50"
                      title="واتساب"
                    >
                      <i className="fa-brands fa-whatsapp text-lg"></i>
                    </button>
                    <button 
                      onClick={(e) => handleCall(e, driver.phone)}
                      className="w-9 h-9 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all flex items-center justify-center border border-blue-100/50"
                      title="اتصال"
                    >
                      <i className="fa-solid fa-phone text-sm"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusList;
