
import React from 'react';
import { User } from '../types';

interface SettingsViewProps {
  user: User;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const handleDiscard = () => {
    if (confirm('Are you sure you want to discard changes?')) {
      window.location.reload();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Account Settings</h1>
      
      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-circle-user text-blue-600"></i>
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
              <input 
                type="text" 
                defaultValue={user.name} 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Email Address</label>
              <input 
                type="email" 
                defaultValue={user.email} 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-bell text-amber-500"></i>
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-slate-700">Push Notifications</p>
                <p className="text-sm text-slate-500">Receive alerts when a bus arrives or starts</p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-slate-50">
              <div>
                <p className="font-semibold text-slate-700">Speeding Alerts</p>
                <p className="text-sm text-slate-500">Notify when a bus exceeds 80 km/h</p>
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* System Config */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-sliders text-emerald-500"></i>
            System Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Refresh Rate (seconds)</label>
              <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
                <option>5 Seconds</option>
                <option>10 Seconds</option>
                <option>30 Seconds</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-4">
           <button 
             onClick={handleDiscard}
             className="px-6 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
           >
             Discard Changes
           </button>
           <button 
             onClick={handleSave}
             className="px-6 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-shadow shadow-lg"
           >
             Save Settings
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
