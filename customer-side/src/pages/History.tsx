import auth from "../modules/auth";
import { useState, useEffect } from "react";
import "../assets/css/index.css"; // Or create a history.css if you want

interface Ride {
  id: number;
  bike_id: number;
  start_time: string;
  end_time: string | null;
  start_latitude: number;
  start_longitude: number;
  end_latitude: number | null;
  end_longitude: number | null;
  distance_meters: number | null;
  cost: number | null;
  status: string;
}

const History = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRides = async () => {
      // Get user id from Dashboard user info (or sessionStorage if you saved it at login)
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        setError("Kunde inte hitta användar-ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/v1/travels/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Kunde inte hämta resor.");
        }
        const data = await response.json();
        // If your backend sends an array, use data. If it sends data.rides, use data.rides
        setRides(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Inga resor hittades.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  return (
    <div className="customer-dashboard-main">
      <div className="customer-dashboard-card">
        <h2 className="customer-dashboard-title">Resehistorik</h2>
        {loading && <div style={{ textAlign: "center" }}>Laddar...</div>}
        {error && <div className="text-danger" style={{ textAlign: "center" }}>{error}</div>}
        {(!loading && rides.length === 0 && !error) && (
          <div style={{ textAlign: "center" }}>Du har inga resor ännu.</div>
        )}
        {rides.length > 0 && (
          <div className="customer-dashboard-info" style={{gap: "1.2rem", flexDirection: "column"}}>
            {rides.map((ride) => (
              <div key={ride.id} style={{borderBottom: "1px solid #eee", paddingBottom: "0.7rem", marginBottom: "0.7rem"}}>
                <div><span className="info-label">Resa:</span> #{ride.id}</div>
                <div><span className="info-label">Starttid:</span> {ride.start_time.slice(0, 19).replace("T", " ")}</div>
                <div><span className="info-label">Sluttid:</span> {ride.end_time ? ride.end_time.slice(0, 19).replace("T", " ") : "-"}</div>
                <div><span className="info-label">Cykel-ID:</span> {ride.bike_id}</div>
                <div><span className="info-label">Distans:</span> {ride.distance_meters ?? "-"} meter</div>
                <div><span className="info-label">Kostnad:</span> {ride.cost ? `${ride.cost.toFixed(2)} SEK` : "-"}</div>
                <div><span className="info-label">Status:</span> {ride.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
