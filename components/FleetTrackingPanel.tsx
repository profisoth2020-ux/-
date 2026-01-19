
import React, { useEffect, useRef } from 'react';
import { Bus, Driver, BusStatus } from '../types';

declare const L: any;

interface FleetTrackingPanelProps {
  selectedBus: Bus | null;
  driver: Driver | null;
}

const FleetTrackingPanel: React.FC<FleetTrackingPanelProps> = ({ selectedBus, driver }) => {
  const miniMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Initialize/Update Mini Map
  useEffect(() => {
    if (selectedBus && !miniMapRef.current) {
      const container = document.getElementById('mini-map');
      if (container) {
        miniMapRef.current = L.map('mini-map', {
          center: [selectedBus.currentLocation.lat, selectedBus.currentLocation.lng],
          zoom: 15,
          zoomControl: false,
          attributionControl: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(miniMapRef.current);

        markerRef.current = L.circleMarker([selectedBus.currentLocation.lat, selectedBus.currentLocation.lng], {
          radius: 8,
          fillColor: "#3b82f6",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(miniMapRef.current);
      }
    }

    if (selectedBus && miniMapRef.current) {
      const { lat, lng } = selectedBus.currentLocation;
      miniMapRef.current.setView([lat, lng], miniMapRef.current.getZoom());
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
    }

    return () => {
      // Cleanup on unmount or bus change
      if (!selectedBus && miniMapRef.current) {
        miniMapRef.current.remove();
        miniMapRef.current = null;
      }
    };
  }, [selectedBus]);

  if (!selectedBus) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 flex flex-col items-center justify-center text-center flex-1">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200 border border-slate-100 shadow-inner">
          <i className="fa-solid fa-map-location-dot text-3xl"></i>
        </div>
        <h4 className="font-black text-slate-800 mb-2 text-lg">مركز التتبع المباشر</h4>
        <p className="text-sm text-slate-400 leading-relaxed">يرجى تحديد حافلة من الخريطة الرئيسية أو القائمة للبدء في تتبع مسارها اللحظي.</p>
      </div>
    );
  }

  const handleCall = () => {
    if (driver?.phone) window.location.href = `tel:${driver.phone}`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
            <i className="fa-solid fa-route text-lg"></i>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 leading-none mb-1">تتبع الحافلة</p>
            <h3 className="text-base font-black leading-none">{selectedBus.plateNumber}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black text-emerald-400 uppercase">متصل الآن</span>
        </div>
      </div>

      {/* Mini Map Container */}
      <div className="h-48 w-full relative bg-slate-100 border-b border-slate-100">
        <div id="mini-map" className="absolute inset-0 z-10"></div>
        <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-sm border border-slate-200 text-[10px] font-bold text-slate-600">
          عرض الموقع اللحظي
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5" dir="rtl">
        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">السرعة الحالية</span>
            <span className="text-2xl font-black text-slate-900">{selectedBus.speed} <span className="text-xs text-slate-400 font-bold">كم/س</span></span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">حالة الرحلة</span>
            <span className="text-sm font-black text-emerald-600 flex items-center gap-2 mt-2">
              <i className="fa-solid fa-circle-play"></i> قيد التشغيل
            </span>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-slate-900 rounded-2xl p-5 shadow-inner border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">إحداثيات الموقع</h5>
            <div className="flex gap-2">
               <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
               <i className="fa-solid fa-satellite text-blue-500 text-[10px]"></i>
            </div>
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center text-blue-400/80">
              <span className="text-slate-600 text-[10px] font-bold">خط العرض:</span>
              <span className="font-bold">{selectedBus.currentLocation.lat.toFixed(6)}°</span>
            </div>
            <div className="flex justify-between items-center text-blue-400/80">
              <span className="text-slate-600 text-[10px] font-bold">خط الطول:</span>
              <span className="font-bold">{selectedBus.currentLocation.lng.toFixed(6)}°</span>
            </div>
          </div>
        </div>

        {/* Driver Details */}
        {driver && (
          <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center gap-4 transition-all hover:bg-slate-50">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
              <i className="fa-solid fa-user-tie text-xl"></i>
            </div>
            <div className="flex-1 text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">قائد المركبة</p>
              <p className="text-sm font-black text-slate-800">{driver.name}</p>
            </div>
            <button 
              onClick={handleCall}
              className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-90"
              title="اتصال بالسائق"
            >
              <i className="fa-solid fa-phone-flip text-sm"></i>
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 grid grid-cols-1 gap-3">
          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 hover:bg-slate-800 shadow-xl shadow-slate-200">
            <i className="fa-solid fa-history text-blue-400"></i>
            عرض سجل المسار اليوم
          </button>
        </div>
      </div>
    </div>
  );
};

export default FleetTrackingPanel;
