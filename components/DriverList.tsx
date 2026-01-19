
import React from 'react';
import { Driver } from '../types';

interface DriverListProps {
  drivers: Driver[];
  onAddDriver: () => void;
}

const DriverList: React.FC<DriverListProps> = ({ drivers, onAddDriver }) => {
  const handleWhatsApp = (phone: string) => {
    // wa.me requires digits only (including country code)
    const cleanedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanedPhone}`, '_blank');
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Drivers Management</h1>
        <button 
          onClick={onAddDriver}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
        >
          <i className="fa-solid fa-user-plus mr-2"></i> Add Driver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.length > 0 ? drivers.map(driver => (
          <div key={driver.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <i className="fa-solid fa-user text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{driver.name}</h3>
                <p className="text-sm text-slate-500">{driver.email}</p>
              </div>
              <span className={`w-3 h-3 rounded-full ${driver.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Phone:</span>
                <span className="font-medium text-slate-900">{driver.phone}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Current Bus:</span>
                <span className="font-medium text-blue-600">{driver.currentBusId || 'Not Assigned'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
               <button 
                 onClick={() => handleWhatsApp(driver.phone)}
                 className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
               >
                 <i className="fa-brands fa-whatsapp"></i> WhatsApp
               </button>
               <button 
                 onClick={() => handleCall(driver.phone)}
                 className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
               >
                 <i className="fa-solid fa-phone"></i> Call
               </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center text-slate-400">
            No drivers found.
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverList;
