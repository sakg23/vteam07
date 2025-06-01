import auth from "../modules/auth";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import AddButtons from "../components/AddButtons.tsx";
import "../assets/css/index.css"; // Adjust the path if needed

interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  balance: number;
  created_at?: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const email = sessionStorage.getItem("userEmail");
        const response = await fetch(`http://localhost:5000/v1/user/me/${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Could not fetch user info");
        }
        const data = await response.json();
        sessionStorage.setItem("userId", data.id); // Save the email
        setUser(data);
      } catch (err) {
        setError("Kunde inte hämta din information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="customer-dashboard-main">
      <div className="customer-dashboard-card">
        <h2 className="customer-dashboard-title">Mitt konto</h2>
        {loading && <div style={{ textAlign: "center" }}>Laddar...</div>}
        {error && <div className="text-danger" style={{ textAlign: "center" }}>{error}</div>}
        {user && (
          <div className="customer-dashboard-info">
            <div>
              <span className="info-label">Id:</span> {user.id}
            </div>
            <div>
              <span className="info-label">Namn:</span> {user.name}
            </div>
            <div>
              <span className="info-label">E-post:</span> {user.email}
            </div>
            <div>
              <span className="info-label">Telefon:</span> {user.phone || "-"}
            </div>
            <div>
              <span className="info-label">Roll:</span> {user.role}
            </div>
            <div>
              <span className="info-label">Saldo:</span> {user.balance} SEK
            </div>
            {user.created_at && (
              <div>
                <span className="info-label">Medlem sedan:</span> {user.created_at.slice(0, 10)}
              </div>
            )}
          </div>
        )}
        <Link to="/add-balance" className="add-balance-link">Add balance</Link>
      </div>
    </div>
  );
};

export default Dashboard;
