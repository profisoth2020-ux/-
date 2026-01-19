
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (email: string, role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For passengers, we don't strictly need an email, but we'll use a placeholder if empty
    const loginEmail = role === UserRole.PASSENGER ? (email || 'passenger@busflow.dz') : email;
    if (loginEmail) onLogin(loginEmail, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-blue-600 p-8 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-4 backdrop-blur-sm border border-white/20 shadow-xl">
            <i className="fa-solid fa-bus-simple"></i>
          </div>
          <h1 className="text-2xl font-black tracking-tight">بوابة BusFlow</h1>
          <p className="text-blue-100 text-sm mt-1 font-bold">نظام إدارة وتتبع الأسطول - الجزائر</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {role !== UserRole.PASSENGER && (
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">البريد الإلكتروني</label>
              <input 
                type="email" 
                required
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-bold"
                placeholder="name@busflow.dz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">الدخول بصفتي</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setRole(UserRole.ADMIN)}
                className={`py-3 rounded-xl border-2 font-black text-[11px] transition-all uppercase tracking-tighter ${
                  role === UserRole.ADMIN 
                    ? 'bg-blue-50 border-blue-500 text-blue-600' 
                    : 'border-slate-100 text-slate-400 hover:bg-slate-50'
                }`}
              >
                مدير
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.DRIVER)}
                className={`py-3 rounded-xl border-2 font-black text-[11px] transition-all uppercase tracking-tighter ${
                  role === UserRole.DRIVER 
                    ? 'bg-blue-50 border-blue-500 text-blue-600' 
                    : 'border-slate-100 text-slate-400 hover:bg-slate-50'
                }`}
              >
                سائق
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.PASSENGER)}
                className={`py-3 rounded-xl border-2 font-black text-[11px] transition-all uppercase tracking-tighter ${
                  role === UserRole.PASSENGER 
                    ? 'bg-blue-50 border-blue-500 text-blue-600' 
                    : 'border-slate-100 text-slate-400 hover:bg-slate-50'
                }`}
              >
                راكب
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 active:scale-95"
          >
            تسجيل الدخول
          </button>
          
          <div className="pt-4 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              نظام التتبع الذكي للحافلات - الجزائر العاصمة
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
