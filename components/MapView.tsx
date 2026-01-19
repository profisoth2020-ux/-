
import React, { useEffect, useRef, useState } from 'react';
import { Bus, BusStatus } from '../types';

declare const L: any; // Leaflet Global

interface MapViewProps {
  buses: Bus[];
  selectedBusId: string | null;
  onSelectBus: (id: string) => void;
}

const MapView: React.FC<MapViewProps> = ({ buses, selectedBusId, onSelectBus }) => {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const userMarkerRef = useRef<any>(null);
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const streetLayerRef = useRef<any>(null);
  const satelliteLayerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState('');

  // Update current time every second for display
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('ar-DZ', {
        timeZone: 'Africa/Algiers',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(now);
      setCurrentTime(timeStr);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) {
      // Algiers Center default
      mapRef.current = L.map('map', {
        center: [36.7538, 3.0588],
        zoom: 13,
        zoomControl: false,
        fadeAnimation: true,
      });

      // 3D-Style (CartoDB Voyager)
      streetLayerRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);

      // Realistic (Esri World Imagery)
      satelliteLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
      });

      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

      // Listen for location events
      mapRef.current.on('locationfound', (e: any) => {
        if (!userMarkerRef.current) {
          userMarkerRef.current = L.circleMarker(e.latlng, {
            radius: 8,
            fillColor: "#3b82f6",
            color: "#fff",
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(mapRef.current).bindPopup("موقعي الحالي");
        } else {
          userMarkerRef.current.setLatLng(e.latlng);
        }
        mapRef.current.setView(e.latlng, 15);
      });

      mapRef.current.on('locationerror', (e: any) => {
        console.warn("GPS Location Access Error: " + e.message);
      });

      setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 500);
    }

    const handleResize = () => {
      if (mapRef.current) mapRef.current.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle Map Type Toggle
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapType === 'satellite') {
      mapRef.current.removeLayer(streetLayerRef.current);
      satelliteLayerRef.current.addTo(mapRef.current);
    } else {
      mapRef.current.removeLayer(satelliteLayerRef.current);
      streetLayerRef.current.addTo(mapRef.current);
    }
  }, [mapType]);

  // Update Markers
  useEffect(() => {
    if (!mapRef.current) return;

    buses.forEach(bus => {
      const { lat, lng } = bus.currentLocation;
      const isSelected = selectedBusId === bus.id;

      const busTime = new Intl.DateTimeFormat('ar-DZ', {
        timeZone: 'Africa/Algiers',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date());

      const busIcon = L.divIcon({
        className: 'custom-bus-icon',
        html: `
          <div class="relative flex flex-col items-center">
            <div class="absolute bottom-full mb-2 flex flex-col items-center pointer-events-none transform transition-transform ${isSelected ? 'scale-110' : ''}">
              <div class="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-xl border border-slate-200 flex flex-col items-center min-w-[70px]">
                <span class="text-[10px] font-black text-slate-800 leading-tight uppercase tracking-tight">${bus.plateNumber}</span>
                <span class="text-[9px] font-bold text-blue-600 leading-tight">${busTime} الجزائر</span>
              </div>
              <div class="w-2.5 h-2.5 bg-white border-r border-b border-slate-200 rotate-45 -mt-1.5 shadow-sm"></div>
            </div>

            <div class="relative flex items-center justify-center w-11 h-11 rounded-full shadow-2xl border-2 transition-all duration-300 ${
              isSelected ? 'scale-125 border-blue-600 bg-blue-100 ring-4 ring-blue-500/30' : 'border-white bg-white'
            } ${bus.status === BusStatus.ON_ROAD ? 'bus-marker-pulse' : ''}">
              <i class="fa-solid fa-bus text-base ${
                bus.status === BusStatus.ON_ROAD ? 'text-emerald-600' : 
                bus.status === BusStatus.PARKED ? 'text-amber-600' : 'text-slate-400'
              }"></i>
            </div>
          </div>
        `,
        iconSize: [80, 80],
        iconAnchor: [40, 55],
      });

      if (markersRef.current[bus.id]) {
        markersRef.current[bus.id].setLatLng([lat, lng]);
        markersRef.current[bus.id].setIcon(busIcon);
      } else {
        const marker = L.marker([lat, lng], { icon: busIcon })
          .addTo(mapRef.current)
          .on('click', () => onSelectBus(bus.id));
        
        markersRef.current[bus.id] = marker;
      }
    });

    Object.keys(markersRef.current).forEach(id => {
      if (!buses.find(b => b.id === id)) {
        mapRef.current.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });
  }, [buses, selectedBusId, currentTime]);

  useEffect(() => {
    if (selectedBusId && markersRef.current[selectedBusId] && mapRef.current) {
      const pos = markersRef.current[selectedBusId].getLatLng();
      mapRef.current.setView(pos, Math.max(mapRef.current.getZoom(), 15), { animate: true });
    }
  }, [selectedBusId]);

  const handleMyLocation = () => {
    if (mapRef.current) {
      mapRef.current.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
    }
  };

  return (
    <div className="w-full h-full relative group">
      <div id="map" className="absolute inset-0 z-10 w-full h-full"></div>

      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-slate-200/50 flex gap-1">
          <button
            onClick={() => setMapType('street')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              mapType === 'street' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <i className="fa-solid fa-map"></i> نمط ثلاثي الأبعاد
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              mapType === 'satellite' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <i className="fa-solid fa-earth-americas"></i> واقعي
          </button>
        </div>
      </div>

      <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-2xl border border-white/10 text-white flex flex-col items-center">
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">توقيت الجزائر العاصمة</span>
        <span className="text-lg font-mono font-bold leading-none">{currentTime || '00:00:00'}</span>
      </div>

      <div className="absolute bottom-8 right-8 z-[1000]">
        <button 
          onClick={handleMyLocation}
          className="w-14 h-14 bg-white text-blue-600 shadow-2xl rounded-2xl flex items-center justify-center hover:bg-blue-50 transition-all active:scale-90 border border-slate-200 hover:rotate-12"
          title="تحديد موقعي"
        >
          <i className="fa-solid fa-crosshairs text-xl"></i>
        </button>
      </div>
      
      <div className="absolute bottom-8 left-8 z-[1000] bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-200/50 hidden md:block">
        <div className="flex flex-col gap-2">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-right">حالة الأسطول المباشرة</h4>
           <div className="flex items-center gap-6 justify-end">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">نشط</span>
              <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.7)]"></span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">متوقف</span>
              <span className="w-3.5 h-3.5 bg-amber-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)]"></span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">غير متاح</span>
              <span className="w-3.5 h-3.5 bg-slate-400 rounded-full"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
