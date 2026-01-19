
export enum BusStatus {
  ON_ROAD = 'ON_ROAD',
  PARKED = 'PARKED',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  PASSENGER = 'PASSENGER'
}

export interface Location {
  lat: number;
  lng: number;
  timestamp: number;
}

export interface Bus {
  id: string;
  plateNumber: string;
  model: string;
  status: BusStatus;
  driverId: string;
  currentLocation: Location;
  lastUpdated: number;
  speed: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  isActive: boolean;
  currentBusId?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface TripHistory {
  id: string;
  busId: string;
  startTime: number;
  endTime?: number;
  path: Location[];
}
