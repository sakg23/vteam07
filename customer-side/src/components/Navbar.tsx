import { Link, useLocation, useNavigate } from "react-router-dom";
import auth from "../modules/auth";
import "../assets/css/navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!auth.token;

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <nav className="customer-navbar">
      <div className="customer-navbar-brand">Vteam07</div>
      <div className="customer-navbar-links">
        {/* Home only when logged in */}
        {isLoggedIn && (
          <Link
            className={
              "customer-navbar-link" +
              (location.pathname === "/Dashboard" ? " active" : "")
            }
            to="/Dashboard"
          >
            Home
          </Link>
        )}

        {/* Register only when logged out */}
        {!isLoggedIn && (
          <Link
            className={
              "customer-navbar-link" +
              (location.pathname === "/register" ? " active" : "")
            }
            to="/register"
          >
            Register
          </Link>
        )}

        {/* Login only when not logged in AND not already on /login */}
        {!isLoggedIn && location.pathname !== "/login" && (
          <Link
            className={
              "customer-navbar-link" +
              (location.pathname === "/login" ? " active" : "")
            }
            to="/login"
          >
            Login
          </Link>
        )}

        {/* Logout only when logged in */}
        {isLoggedIn && (
          <button
            className="customer-navbar-link logout-link"
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
