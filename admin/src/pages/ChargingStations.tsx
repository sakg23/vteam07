import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../modules/auth";

type ChargingStation = {
  id: number;
  name: string;
  city_id: number;
  latitude: number;
  longitude: number;
};

const ChargingStations = () => {
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

useEffect(() => {
  const fetchStations = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/v1/chargingstations", {
        headers: {
          "Authorization": `Bearer ${auth.token}`,
        },
      });
      if (!res.ok) throw new Error("Fel vid hämtning");
      const data = await res.json();
      setStations(data.stations);
    } catch {
      setError("Kunde inte hämta laddningsstationer.");
    } finally {
      setLoading(false);
    }
  };
  fetchStations();
}, [auth.token]);


  const handleDelete = async (name: string) => {
    if (!window.confirm(`Ta bort laddningsstation "${name}"?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/v1/chargingstations/${encodeURIComponent(name)}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${auth.token}`,
        },
      });
      if (!res.ok) throw new Error("Fel vid borttagning");
      setStations(stations.filter((s) => s.name !== name));
    } catch {
      alert("Kunde inte ta bort laddningsstation.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Laddningsstationer</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate("/addstation")}
      >
        Lägg till station
      </button>

      {loading && <div>Laddar...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && stations.length === 0 && <div>Inga laddningsstationer.</div>}

      {stations.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Namn</th>
              <th>Stad ID</th>
              <th>Latitud</th>
              <th>Longitud</th>
              <th>Ta bort</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => (
              <tr key={station.id}>
                <td>{station.name}</td>
                <td>{station.city_id}</td>
                <td>{station.latitude}</td>
                <td>{station.longitude}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(station.name)}
                  >
                    Ta bort
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ChargingStations;
