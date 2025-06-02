import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ParkingZone = {
  id: number;
  name: string;
  city_id: number;
  latitude: number;
  longitude: number;
  radius: number;
};

const ParkingZones = () => {
  const [zones, setZones] = useState<ParkingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/v1/parking");
        if (!res.ok) throw new Error("Fel vid hämtning");
        const data = await res.json();
        setZones(data.parkings);
      } catch {
        setError("Kunde inte hämta parkeringszoner.");
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, []);

  const handleDelete = async (name: string) => {
    if (!window.confirm(`Ta bort parkering "${name}"?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/v1/parking/${encodeURIComponent(name)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Fel vid borttagning");
      setZones(zones.filter((z) => z.name !== name));
    } catch {
      alert("Kunde inte ta bort parkering.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Parkeringszoner</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate("/addparking")}
      >
        Lägg till parkering
      </button>

      {loading && <div>Laddar...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && zones.length === 0 && <div>Inga parkeringar.</div>}

      {zones.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Namn</th>
              <th>Stad ID</th>
              <th>Latitud</th>
              <th>Longitud</th>
              <th>Radie</th>
              <th>Ta bort</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone) => (
              <tr key={zone.id}>
                <td>{zone.name}</td>
                <td>{zone.city_id}</td>
                <td>{zone.latitude}</td>
                <td>{zone.longitude}</td>
                <td>{zone.radius}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(zone.name)}
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

export default ParkingZones;
