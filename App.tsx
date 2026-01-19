
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Bus, Driver, BusStatus, Location } from './types';
import Sidebar from './components/Sidebar';
import AdminDashboard from './components/AdminDashboard';
import DriverDashboard from './components/DriverDashboard';
import PassengerDashboard from './components/PassengerDashboard';
import Login from './components/Login';

// Initial Mock Data
const INITIAL_BUSES: Bus[] = [
  { id: 'b1', plateNumber: '00123-124-16', model: 'Mercedes-Benz O500', status: BusStatus.ON_ROAD, driverId: 'd1', currentLocation: { lat: 36.7538, lng: 3.0588, timestamp: Date.now() }, lastUpdated: Date.now(), speed: 45 },
  { id: 'b2', plateNumber: '09876-121-16', model: 'Volvo 9700', status: BusStatus.PARKED, driverId: 'd2', currentLocation: { lat: 36.7638, lng: 3.0688, timestamp: Date.now() }, lastUpdated: Date.now(), speed: 0 },
];

const INITIAL_DRIVERS: Driver[] = [
  { id: 'a1', name: 'المدير العام', phone: '+213500000001', email: 'admin@busflow.dz', isActive: true, currentBusId: 'b1' },
  { id: 'd1', name: 'أحمد بن علي', phone: '+213500000002', email: 'ahmed@busflow.dz', isActive: true, currentBusId: 'b1' },
  { id: 'd2', name: 'سفيان منصور', phone: '+213500000003', email: 'sofiane@busflow.dz', isActive: true, currentBusId: 'b2' },
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [activeTab, setActiveTab] = useState('map');

  // Function to update bus location from driver GPS
  const updateBusLocation = useCallback((busId: string, location: Location, speed: number) => {
    setBuses(prev => prev.map(bus => 
      bus.id === busId 
        ? { ...bus, currentLocation: location, lastUpdated: Date.now(), speed, status: BusStatus.ON_ROAD }
        : bus
    ));
  }, []);

  // Reset tab on role switch
  useEffect(() => {
    if (user) {
      if (user.role === UserRole.ADMIN) setActiveTab('map');
      else if (user.role === UserRole.DRIVER) setActiveTab('dashboard');
      else if (user.role === UserRole.PASSENGER) setActiveTab('tracking');
    }
  }, [user?.role]);

  // Simulate real-time updates for buses NOT being actively tracked by a logged-in driver
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => prevBuses.map(bus => {
        // Only simulate for buses that aren't the current user's bus (if driver)
        const isCurrentlyTrackedByMe = user?.role === UserRole.DRIVER && bus.driverId === user.id;
        
        if (bus.status === BusStatus.ON_ROAD && !isCurrentlyTrackedByMe) {
          const newLat = bus.currentLocation.lat + (Math.random() - 0.5) * 0.0005;
          const newLng = bus.currentLocation.lng + (Math.random() - 0.5) * 0.0005;
          return {
            ...bus,
            currentLocation: { lat: newLat, lng: newLng, timestamp: Date.now() },
            lastUpdated: Date.now(),
            speed: Math.floor(Math.random() * 20) + 30
          };
        }
        return bus;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const handleLogin = (email: string, role: UserRole) => {
    const foundDriver = drivers.find(d => d.email === email);
    setUser({
      id: foundDriver?.id || (role === UserRole.ADMIN ? 'a1' : role === UserRole.PASSENGER ? `p${Date.now()}` : 'd1'),
      email,
      role,
      name: foundDriver?.name || (role === UserRole.ADMIN ? 'المدير العام' : role === UserRole.PASSENGER ? 'زائر (راكب)' : 'سائق')
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {user.role === UserRole.ADMIN ? (
          <AdminDashboard 
            buses={buses} 
            drivers={drivers} 
            activeTab={activeTab} 
            setBuses={setBuses}
            setDrivers={setDrivers}
            user={user}
          />
        ) : user.role === UserRole.DRIVER ? (
          <DriverDashboard 
            bus={buses.find(b => b.driverId === user.id) || null} 
            user={user} 
            activeTab={activeTab}
            onLocationUpdate={updateBusLocation}
          />
        ) : (
          <PassengerDashboard 
            buses={buses} 
            drivers={drivers} 
            activeTab={activeTab}
          />
        )}
      </main>
    </div>
  );
};

export default App;
