export interface Zone {
  id: number;
  name: string;
  city: string;
  type: 'allowed' | 'restricted';
  polygon: [number, number][];
}
