import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import chargingImg from "../assets/icons/charging.png";
import scooterImg from "../assets/icons/scooter.png";
import scooterGreenImg from "../assets/icons/scooter-green.png";
import parkingImg from "../assets/icons/parking.png";
import L from "leaflet";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";
import "../assets/css/index.css";

// Leaflet icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const chargingIcon = new L.Icon({
  iconUrl: chargingImg,
  iconSize: [50, 50],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const scooterIcon = new L.Icon({
  iconUrl: scooterImg,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const scooterGreenIcon = new L.Icon({
  iconUrl: scooterGreenImg,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const parkingIcon = new L.Icon({
  iconUrl: parkingImg,
  iconSize: [50, 50],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface Station {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface ParkingZone {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

interface Scooter {
  id: number;
  serial_number: string;
  current_latitude: number;
  current_longitude: number;
  status: string;
}

const cityPositions: { [key: string]: [number, number] } = {
  "Göteborg": [57.7089, 11.9746],
  "Stockholm": [59.3293, 18.0686],
  "Karlskrona": [56.1612, 15.5869],
};

// Helper component to move map
const ChangeMapView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const MapView = () => {
  const [mounted, setMounted] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [zones, setZones] = useState<ParkingZone[]>([]);
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [selectedCity, setSelectedCity] = useState<[number, number]>(cityPositions["Stockholm"]);

  useEffect(() => {
    setMounted(true);

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    };

    // Static data (load once)
    const fetchStaticData = async () => {
      try {
        const [stationRes, zoneRes] = await Promise.all([
          fetch("http://localhost:5000/v1/chargingstations", { headers }),
          fetch("http://localhost:5000/v1/parking"),
        ]);

        const stationsData = await stationRes.json();
        const zonesData = await zoneRes.json();

        setStations(stationsData.stations ?? []);
        setZones(zonesData.parkings ?? []);
      } catch (err) {
        console.error("Error fetching static data", err);
      }
    };

    // Scooter polling
    const fetchScooters = async () => {
      try {
        const res = await fetch("http://localhost:5000/v1/bikes", { headers });
        const data = await res.json();
        setScooters(data.scooters ?? []);
      } catch (err) {
        console.error("Error fetching scooters", err);
      }
    };

    fetchStaticData();
    fetchScooters();
    const interval = setInterval(fetchScooters, 5000);

    // Setup WebSocket
    const socket = io("http://localhost:5001");

    socket.on("bike_position_update", (update: { bike_id: number; latitude: number; longitude: number }) => {
      setScooters((prev) =>
        prev.map((s) =>
          s.id === update.bike_id
            ? { ...s, current_latitude: update.latitude, current_longitude: update.longitude }
            : s
        )
      );
    });

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  if (!mounted || typeof window === "undefined") return <div>Loading map...</div>;

  return (
    <div className="map-wrapper">
      {/* City selector */}
      <div className="map-controls" style={{ padding: "10px" }}>
        <label htmlFor="city-select">Select City: </label>
        <select
          id="city-select"
          value={Object.keys(cityPositions).find(
            (key) =>
              cityPositions[key][0] === selectedCity[0] &&
              cityPositions[key][1] === selectedCity[1]
          )}
          onChange={(e) => setSelectedCity(cityPositions[e.target.value])}
        >
          {Object.keys(cityPositions).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Map */}
      <MapContainer center={selectedCity} zoom={13} className="leaflet-container">
        <ChangeMapView center={selectedCity} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Charging Stations */}
        {stations.map((station) => (
          <Marker
            key={`station-${station.id}`}
            position={[station.latitude, station.longitude]}
            icon={chargingIcon}
          >
            <Popup>
              <strong>Laddstation</strong>
              <br />
              {station.name}
            </Popup>
          </Marker>
        ))}

        {/* Parking Zones */}
        {zones.map((zone) => (
          <Marker
            key={`zone-${zone.id}`}
            position={[zone.latitude, zone.longitude]}
            icon={parkingIcon}
          >
            <Popup>
              <strong>Parkering</strong>
              <br />
              {zone.name}
            </Popup>
          </Marker>
        ))}

        {/* Scooters */}
        {scooters.map((scooter) => (
          <Marker
            key={`scooter-${scooter.id}`}
            position={[scooter.current_latitude, scooter.current_longitude]}
            icon={scooter.status === "in_use" ? scooterGreenIcon : scooterIcon}
          >
            <Popup>
              <strong>Scooter</strong>
              <br />
              Serial: {scooter.serial_number}
              <br />
              Status: {scooter.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
