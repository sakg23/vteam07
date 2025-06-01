import "../assets/css/index.css"; // or your main CSS
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="customer-dashboard-main">
      <div className="customer-dashboard-card">
        <h2 className="customer-dashboard-title">Välkommen till Svenska Elsparkcyklar!</h2>
        <div style={{
          fontSize: "1.12rem",
          textAlign: "center",
          color: "#454d4b",
          marginTop: "1.5rem",
          marginBottom: "1.3rem",
          lineHeight: 1.65
        }}>
          Logga in för att komma åt ditt konto, se din resehistorik och ladda ditt saldo.<br /><br />
          <span style={{ color: "#45a473", fontWeight: 500 }}>
            Vi hoppas du får en fin resa!
          </span>
        </div>
        <div style={{ textAlign: "center", marginTop: "1.1rem" }}>
          <Link to="/login" className="add-balance-link">
            Till inloggningen
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
