export interface Trip {
  id: number;
  userId: number;
  bikeId: number;
  startTime: string;
  endTime: string;
  startLocation: {
    lat: number;
    lng: number;
  };
  endLocation: {
    lat: number;
    lng: number;
  };
  totalCost: number;
  startZoneType: 'charging' | 'parking' | 'free';
  endZoneType: 'charging' | 'parking' | 'free';
}
