
import React, { useState, useEffect } from 'react';
import { Bus, BusStatus, Driver } from '../types';

interface EditBusModalProps {
  isOpen: boolean;
  bus: Bus;
  drivers: Driver[];
  onClose: () => void;
  onUpdate: (bus: Bus) => void;
}

const EditBusModal: React.FC<EditBusModalProps> = ({ isOpen, bus, drivers, onClose, onUpdate }) => {
  const [plateNumber, setPlateNumber] = useState(bus.plateNumber);
  const [model, setModel] = useState(bus.model);
  const [status, setStatus] = useState<BusStatus>(bus.status);
  const [driverId, setDriverId] = useState(bus.driverId);

  useEffect(() => {
    if (bus) {
      setPlateNumber(bus.plateNumber);
      setModel(bus.model);
      setStatus(bus.status);
      setDriverId(bus.driverId);
    }
  }, [bus]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedBus: Bus = {
      ...bus,
      plateNumber,
      model,
      status,
      driverId,
      lastUpdated: Date.now()
    };
    onUpdate(updatedBus);
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-white">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-blue-600 text-white">
          <h2 className="text-xl font-black">تعديل بيانات الحافلة</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">رقم اللوحة</label>
            <input
              type="text"
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 transition-all"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">موديل الحافلة</label>
            <input
              type="text"
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 transition-all"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">السائق الموكل</label>
            <select
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 transition-all"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
            >
              <option value="">-- بدون سائق --</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} {driver.currentBusId && driver.currentBusId !== bus.id ? '(مسند لحافلة أخرى)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">الحالة التشغيلية</label>
            <select
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 transition-all"
              value={status}
              onChange={(e) => setStatus(e.target.value as BusStatus)}
            >
              <option value={BusStatus.PARKED}>متوقفة</option>
              <option value={BusStatus.ON_ROAD}>في الطريق</option>
              <option value={BusStatus.OUT_OF_SERVICE}>خارج الخدمة</option>
            </select>
          </div>
          <div className="pt-6 flex gap-4">
             <button
              type="submit"
              className="flex-1 px-6 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
            >
              تحديث المعلومات
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 border border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50 transition-all"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBusModal;
