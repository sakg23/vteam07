export interface Station {
  id: number;
  name: string;
  city: string;
  location: {
    lat: number;
    lng: number;
  };
  type: 'charging' | 'parking';
}
