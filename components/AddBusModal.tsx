
import React, { useState } from 'react';
import { Bus, BusStatus, Driver } from '../types';

interface AddBusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (bus: Bus) => void;
  drivers: Driver[];
}

const AddBusModal: React.FC<AddBusModalProps> = ({ isOpen, onClose, onAdd, drivers }) => {
  const [plateNumber, setPlateNumber] = useState('');
  const [model, setModel] = useState('');
  const [driverId, setDriverId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBus: Bus = {
      id: `b${Date.now()}`,
      plateNumber,
      model,
      status: BusStatus.PARKED,
      driverId,
      currentLocation: { lat: 36.7538, lng: 3.0588, timestamp: Date.now() },
      lastUpdated: Date.now(),
      speed: 0
    };
    onAdd(newBus);
    setPlateNumber('');
    setModel('');
    setDriverId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-white">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-blue-600 text-white">
          <h2 className="text-xl font-black">إضافة حافلة جديدة للأسطول</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">رقم لوحة الحافلة</label>
            <input
              type="text"
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 transition-all"
              placeholder="مثلاً: 12345-121-16"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">موديل ونوع الحافلة</label>
            <input
              type="text"
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 transition-all"
              placeholder="مثلاً: Mercedes Travego"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">إسناد سائق</label>
            <select
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 transition-all"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
            >
              <option value="">-- اختر سائقاً (اختياري) --</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} {driver.currentBusId ? '(مسند لحافلة أخرى)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="pt-6 flex gap-4">
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
            >
              تأكيد الإضافة
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

export default AddBusModal;
