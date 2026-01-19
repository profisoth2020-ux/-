
import React, { useState } from 'react';
import { Driver } from '../types';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (driver: Driver) => void;
}

const AddDriverModal: React.FC<AddDriverModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDriver: Driver = {
      id: `d${Date.now()}`,
      name,
      phone,
      email,
      isActive: true,
    };
    onAdd(newDriver);
    setName('');
    setPhone('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-white">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-blue-600 text-white">
          <h2 className="text-xl font-black">تسجيل سائق جديد</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">الاسم الكامل</label>
            <input
              type="text"
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 transition-all"
              placeholder="مثلاً: محمد الجزائري"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">رقم الهاتف</label>
            <input
              type="tel"
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 transition-all text-right"
              placeholder="+213 5..."
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 transition-all"
              placeholder="driver@busflow.dz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="pt-6 flex gap-4">
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
            >
              تأكيد التسجيل
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

export default AddDriverModal;
