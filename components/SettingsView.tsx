
import React from 'react';
import { User } from '../types';

interface SettingsViewProps {
  user: User;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  const handleSave = () => {
    alert('تم حفظ الإعدادات بنجاح!');
  };

  const handleDiscard = () => {
    if (confirm('هل أنت متأكد من تجاهل التغييرات؟')) {
      window.location.reload();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto" dir="rtl">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8">إعدادات الحساب</h1>
      
      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <i className="fa-solid fa-circle-user"></i>
            </div>
            المعلومات الشخصية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">الاسم الكامل</label>
              <input 
                type="text" 
                defaultValue={user.name} 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">البريد الإلكتروني</label>
              <input 
                type="email" 
                defaultValue={user.email} 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
              <i className="fa-solid fa-bell"></i>
            </div>
            إشعارات النظام
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="text-right">
                <p className="font-black text-slate-700">إشعارات الدفع (Push)</p>
                <p className="text-xs text-slate-400 font-bold">تلقي تنبيهات عند وصول الحافلة أو بدء الرحلات</p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-slate-50">
              <div className="text-right">
                <p className="font-black text-slate-700">تنبيهات السرعة الزائدة</p>
                <p className="text-xs text-slate-400 font-bold">تلقي تنبيه عندما تتجاوز الحافلة سرعة 80 كم/س</p>
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* System Config */}
        <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
              <i className="fa-solid fa-sliders"></i>
            </div>
            إعدادات النظام
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">معدل تحديث البيانات</label>
              <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold">
                <option>كل 5 ثوانٍ</option>
                <option>كل 10 ثوانٍ</option>
                <option>كل 30 ثانية</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-6">
           <button 
             onClick={handleDiscard}
             className="px-8 py-4 rounded-2xl text-slate-600 font-black hover:bg-slate-100 transition-all"
           >
             تجاهل التغييرات
           </button>
           <button 
             onClick={handleSave}
             className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
           >
             حفظ الإعدادات
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
