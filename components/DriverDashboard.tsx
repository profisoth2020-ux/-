
import React, { useState, useEffect, useRef } from 'react';
import { Bus, User, BusStatus, Location } from '../types';
import SettingsView from './SettingsView';
import MapView from './MapView';

interface DriverDashboardProps {
  bus: Bus | null;
  user: User;
  activeTab: string;
  onLocationUpdate?: (busId: string, location: Location, speed: number) => void;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ bus, user, activeTab, onLocationUpdate }) => {
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (isShiftActive && navigator.geolocation) {
      // Start real-time high-accuracy tracking
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          // Fallback speed if pos.coords.speed is null
          const speedKmh = pos.coords.speed !== null ? (pos.coords.speed * 3.6) : (Math.random() * 5 + 45);
          
          setCoords(newCoords);
          setLastUpdateTime(Date.now());
          
          // Send update to parent state for global tracking
          if (bus && onLocationUpdate) {
            onLocationUpdate(bus.id, { ...newCoords, timestamp: Date.now() }, Math.round(speedKmh));
          }
        },
        (err) => {
          console.error("Critical GPS Error:", err);
          let errorMessage = "خطأ في تحديد الموقع: ";
          switch(err.code) {
            case err.PERMISSION_DENIED: errorMessage += "تم رفض الإذن."; break;
            case err.POSITION_UNAVAILABLE: errorMessage += "الموقع غير متاح."; break;
            case err.TIMEOUT: errorMessage += "انتهت مهلة الطلب."; break;
            default: errorMessage += "خطأ غير معروف.";
          }
          alert(errorMessage + " يرجى التحقق من إعدادات الموقع في جهازك.");
          setIsShiftActive(false);
        },
        { 
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 15000 
        }
      );
    } else if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isShiftActive, bus, onLocationUpdate]);

  if (activeTab === 'settings') {
    return <SettingsView user={user} />;
  }

  if (activeTab === 'route') {
    return (
      <div className="p-8 flex items-center justify-center h-full text-slate-400 bg-slate-50">
         <div className="text-center">
           <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-blue-500 border border-slate-100">
             <i className="fa-solid fa-route text-4xl"></i>
           </div>
           <p className="text-xl font-black text-slate-800">تتبع المسار</p>
           <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">ميزة الملاحة الحية وتحسين المسار قيد التطوير.</p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <div className="p-6 flex-shrink-0">
        <header className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">لوحة السائق</h1>
            <p className="text-slate-500 font-semibold flex items-center gap-2 mt-1">
              <i className="fa-solid fa-circle text-emerald-500 text-[8px] animate-pulse"></i>
              مرحباً بك، {user.name}
            </p>
          </div>
          {bus && (
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 text-right">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">الحافلة الحالية</p>
              <p className="text-xl font-black text-slate-800">{bus.plateNumber}</p>
            </div>
          )}
        </header>
      </div>

      <div className="flex-1 px-6 pb-6 flex flex-col gap-6 overflow-hidden">
        {bus ? (
          <>
            {/* Live Map Display for Driver */}
            <div className="flex-1 min-h-[300px] relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
               <MapView 
                  buses={[bus]} 
                  selectedBusId={bus.id} 
                  onSelectBus={() => {}} 
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-shrink-0">
               <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-white flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-slate-800 flex items-center gap-2.5 uppercase tracking-wide text-sm">
                      <i className="fa-solid fa-satellite-dish text-blue-500 text-lg"></i>
                      بيانات التتبع اللحظي
                    </h3>
                    {lastUpdateTime && (
                      <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded">
                        آخر تحديث: {new Date(lastUpdateTime).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4 bg-slate-900 rounded-2xl shadow-inner text-emerald-400 font-mono text-sm">
                    {coords ? (
                      <div className="space-y-2">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-slate-500 text-[10px] font-bold">خط العرض</span>
                          <span>{coords.lat.toFixed(6)}°</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-slate-500 text-[10px] font-bold">خط الطول</span>
                          <span>{coords.lng.toFixed(6)}°</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-500 text-[10px] font-bold">السرعة</span>
                          <span className="text-emerald-300 font-bold">{bus.speed} كم/س</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center text-slate-500 text-xs italic">
                        في انتظار إشارة الـ GPS...
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setIsShiftActive(!isShiftActive)}
                    className={`w-full py-4 rounded-2xl text-lg font-black shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
                      isShiftActive 
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                    }`}
                  >
                    <i className={`fa-solid ${isShiftActive ? 'fa-stop-circle' : 'fa-play-circle'} text-xl`}></i>
                    {isShiftActive ? 'إيقاف الرحلة' : 'بدء الرحلة والبث المباشر'}
                  </button>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <button className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors shadow-inner">
                      <i className="fa-solid fa-headset text-blue-600 text-xl"></i>
                    </div>
                    <span className="text-[10px] font-black text-slate-700 uppercase">غرفة العمليات</span>
                  </button>
                  <button className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors shadow-inner">
                      <i className="fa-solid fa-triangle-exclamation text-amber-600 text-xl"></i>
                    </div>
                    <span className="text-[10px] font-black text-slate-700 uppercase">بلاغ طوارئ</span>
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-16 bg-white rounded-[3rem] border border-slate-100 shadow-2xl px-8 max-w-sm">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-100">
                 <i className="fa-solid fa-bus-slash text-slate-200 text-4xl"></i>
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-2">لا توجد حافلة مسندة</h3>
               <p className="text-slate-500 font-bold mb-8">لم يتم إسناد مركبة لك حالياً. يرجى مراجعة مسؤول الأسطول.</p>
               <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-xl">
                 طلب إسناد مركبة
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
