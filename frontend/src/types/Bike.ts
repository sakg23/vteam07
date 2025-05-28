export interface Bike {
  id: number;
  city: string;
  status: 'available' | 'in_use' | 'maintenance' | 'charging';
  location: {
    lat: number;
    lng: number;
  };
  battery: number;
  inService: boolean;
  currentZoneId: number | null;
  stationId: number | null;
  userId: number | null;
}
