import axios from 'axios';

const API_BASE = '/api/scooters';

export interface Scooter {
  id?: number;
  serial_number: string;
  city_id: number;
  latitude: number;
  longitude: number;
}

export const getAllScooters = async () => {
  const res = await axios.get(API_BASE);
  return res.data.scooters;
};

export const getRentedScooter = async () => {
  const res = await axios.get("http://localhost:5000/rent/rented", {
    withCredentials: true,
  });
  return res.data;
};


export const addScooter = async (scooter: Scooter) => {
  const res = await axios.post(`${API_BASE}/add`, scooter);
  return res.data;
};

export const deleteScooter = async (serial: string) => {
  const res = await axios.delete(`${API_BASE}/${serial}`);
  return res.data;
};
