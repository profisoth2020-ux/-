
import React from 'react';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, setActiveTab, onLogout }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const isDriver = user.role === UserRole.DRIVER;
  const isPassenger = user.role === UserRole.PASSENGER;

  let menuItems: any[] = [];

  if (isAdmin) {
    menuItems = [
      { id: 'map', icon: 'fa-map-location-dot', label: 'التتبع المباشر' },
      { id: 'buses', icon: 'fa-bus', label: 'إدارة الأسطول' },
      { id: 'drivers', icon: 'fa-users', label: 'السائقين' },
      { id: 'history', icon: 'fa-clock-rotate-left', label: 'سجل الرحلات' },
      { id: 'settings', icon: 'fa-gear', label: 'الإعدادات' },
    ];
  } else if (isDriver) {
    menuItems = [
      { id: 'dashboard', icon: 'fa-gauge', label: 'لوحة التحكم' },
      { id: 'route', icon: 'fa-route', label: 'المسار النشط' },
      { id: 'settings', icon: 'fa-user-gear', label: 'الملف الشخصي' },
    ];
  } else if (isPassenger) {
    menuItems = [
      { id: 'tracking', icon: 'fa-street-view', label: 'تتبع الحافلات' },
      { id: 'nearby', icon: 'fa-location-dot', label: 'المواقف القريبة' },
    ];
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col transition-all duration-300" dir="rtl">
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/50">
          <i className="fa-solid fa-bus-simple text-2xl"></i>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter leading-none">BusFlow</span>
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mt-1">الجزائر</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' 
                : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            <span className="font-black text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5 bg-slate-950/30">
        <div className="flex items-center gap-4 mb-6 px-1">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 shadow-inner">
            <i className="fa-solid fa-circle-user text-slate-400"></i>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-black truncate text-slate-200">{user.name}</p>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">
              {isPassenger ? 'راكب' : isAdmin ? 'مدير النظام' : 'سائق'}
            </p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all font-black text-xs border border-rose-500/10"
        >
          <i className="fa-solid fa-power-off"></i>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
