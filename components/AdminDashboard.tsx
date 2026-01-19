
import React, { useState } from 'react';
import { Bus, Driver, BusStatus, User } from '../types';
import MapView from './MapView';
import BusList from './BusList';
import DriverList from './DriverList';
import StatsHeader from './StatsHeader';
import FleetTrackingPanel from './FleetTrackingPanel';
import SettingsView from './SettingsView';
import AddBusModal from './AddBusModal';
import AddDriverModal from './AddDriverModal';
import EditBusModal from './EditBusModal';

interface AdminDashboardProps {
  buses: Bus[];
  drivers: Driver[];
  activeTab: string;
  setBuses: React.Dispatch<React.SetStateAction<Bus[]>>;
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ buses, drivers, activeTab, setBuses, setDrivers, user }) => {
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [isBusModalOpen, setIsBusModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stats = {
    total: buses.length,
    onRoad: buses.filter(b => b.status === BusStatus.ON_ROAD).length,
    parked: buses.filter(b => b.status === BusStatus.PARKED).length,
    outOfService: buses.filter(b => b.status === BusStatus.OUT_OF_SERVICE).length,
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleAddBus = (newBus: Bus) => {
    setBuses(prev => [...prev, newBus]);
    // تحديث حالة السائق إذا تم إسناد الحافلة له
    if (newBus.driverId) {
      setDrivers(prev => prev.map(d => 
        d.id === newBus.driverId ? { ...d, currentBusId: newBus.id } : d
      ));
    }
  };

  const handleUpdateBus = (updatedBus: Bus) => {
    setBuses(prev => prev.map(b => b.id === updatedBus.id ? updatedBus : b));
    
    // مزامنة حالة السائقين:
    setDrivers(prev => prev.map(d => {
      // إذا كان السائق هو المختار الجديد للحافلة
      if (d.id === updatedBus.driverId) {
        return { ...d, currentBusId: updatedBus.id };
      }
      // إذا كان السائق مرتبطاً سابقاً بهذه الحافلة ولكن تم تغييره
      if (d.currentBusId === updatedBus.id && d.id !== updatedBus.driverId) {
        return { ...d, currentBusId: undefined };
      }
      return d;
    }));
    
    setEditingBus(null);
  };

  const handleAddDriver = (newDriver: Driver) => {
    setDrivers(prev => [...prev, newDriver]);
  };

  const handleDeleteBus = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الحافلة؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setBuses(prev => prev.filter(b => b.id !== id));
      setDrivers(prev => prev.map(d => d.currentBusId === id ? { ...d, currentBusId: undefined } : d));
      if (selectedBusId === id) setSelectedBusId(null);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return (
          <div className="flex flex-col h-full w-full overflow-hidden bg-slate-50">
            <div className="flex items-center justify-between pr-6 pl-2 py-2">
              <StatsHeader stats={stats} />
              <button 
                onClick={handleRefresh}
                className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-95 group"
              >
                <i className={`fa-solid fa-arrows-rotate text-blue-600 transition-transform ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`}></i>
                تحديث البيانات
              </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
              <div className="flex-1 relative lg:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white bg-slate-100 min-h-0">
                <MapView 
                  buses={buses} 
                  selectedBusId={selectedBusId} 
                  onSelectBus={(id) => setSelectedBusId(id)} 
                />
              </div>
              
              <div className="w-full lg:w-[400px] flex flex-col gap-4 h-full overflow-hidden">
                <BusList 
                  buses={buses} 
                  drivers={drivers}
                  onSelectBus={(id) => setSelectedBusId(id)}
                  selectedBusId={selectedBusId}
                />
                <FleetTrackingPanel 
                  selectedBus={buses.find(b => b.id === selectedBusId) || null} 
                  driver={drivers.find(d => d.id === buses.find(b => b.id === selectedBusId)?.driverId) || null}
                />
              </div>
            </div>
          </div>
        );
      case 'buses':
        return (
          <div className="p-8 max-w-6xl mx-auto" dir="rtl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">إدارة أسطول الحافلات</h1>
              <button 
                onClick={() => setIsBusModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 font-black text-sm flex items-center gap-2"
              >
                <i className="fa-solid fa-plus"></i> إضافة حافلة جديدة
              </button>
            </div>
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
               <table className="w-full text-right">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-8 py-5 font-black text-slate-700 text-sm">رقم اللوحة</th>
                      <th className="px-8 py-5 font-black text-slate-700 text-sm">الموديل</th>
                      <th className="px-8 py-5 font-black text-slate-700 text-sm">السائق</th>
                      <th className="px-8 py-5 font-black text-slate-700 text-sm">الحالة</th>
                      <th className="px-8 py-5 font-black text-slate-700 text-sm">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buses.length > 0 ? buses.map(bus => {
                      const driver = drivers.find(d => d.id === bus.driverId);
                      return (
                        <tr key={bus.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-5 font-bold text-slate-900">{bus.plateNumber}</td>
                          <td className="px-8 py-5 text-slate-600 font-medium">{bus.model}</td>
                          <td className="px-8 py-5 text-slate-600 font-medium">
                            {driver ? driver.name : <span className="text-slate-300 italic">غير محدد</span>}
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              bus.status === BusStatus.ON_ROAD ? 'bg-emerald-100 text-emerald-700' :
                              bus.status === BusStatus.PARKED ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {bus.status === BusStatus.ON_ROAD ? 'في الطريق' : bus.status === BusStatus.PARKED ? 'متوقفة' : 'خارج الخدمة'}
                            </span>
                          </td>
                          <td className="px-8 py-5 space-x-3 space-x-reverse">
                            <button 
                              onClick={() => setEditingBus(bus)}
                              className="w-9 h-9 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteBus(bus.id)}
                              className="w-9 h-9 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-16 text-center text-slate-400 italic font-medium">لا توجد حافلات مسجلة في النظام حالياً.</td>
                      </tr>
                    )}
                  </tbody>
               </table>
            </div>
          </div>
        );
      case 'drivers':
        return (
          <div className="relative">
             <DriverList 
              drivers={drivers} 
              onAddDriver={() => setIsDriverModalOpen(true)}
             />
          </div>
        );
      case 'settings':
        return <SettingsView user={user} />;
      default:
        return (
          <div className="flex flex-center justify-center items-center h-full text-slate-400">
            <div className="text-center">
              <i className="fa-solid fa-screwdriver-wrench text-5xl mb-6 opacity-20"></i>
              <p className="text-xl font-bold text-slate-600">هذا القسم قيد البرمجة حالياً</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-slate-50 overflow-hidden">
      {renderContent()}
      <AddBusModal 
        isOpen={isBusModalOpen} 
        onClose={() => setIsBusModalOpen(false)} 
        onAdd={handleAddBus} 
        drivers={drivers}
      />
      <AddDriverModal 
        isOpen={isDriverModalOpen} 
        onClose={() => setIsDriverModalOpen(false)} 
        onAdd={handleAddDriver} 
      />
      {editingBus && (
        <EditBusModal
          isOpen={!!editingBus}
          bus={editingBus}
          drivers={drivers}
          onClose={() => setEditingBus(null)}
          onUpdate={handleUpdateBus}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
