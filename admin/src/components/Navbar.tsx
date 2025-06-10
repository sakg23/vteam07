import { Link, useLocation, useNavigate } from "react-router-dom";
import auth from "../modules/auth";
import "../assets/css/navbar.css"; // <-- your separate admin CSS

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!auth.token;

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-brand">Vteam07</div>
      <div className="admin-navbar-links">

        {/* Home always visible */}
        <Link
          className={
            "admin-navbar-link" +
            (location.pathname === "/" ? " active" : "")
          }
          to="/"
        >
          Home
        </Link>

        {/* Register always visible */}
        <Link
          className={
            "admin-navbar-link" +
            (location.pathname === "/register" ? " active" : "")
          }
          to="/register"
        >
          Register
        </Link>

        {/* Login only when not logged in AND not already on /login */}
        {!isLoggedIn && location.pathname !== "/login" && (
          <Link
            className={
              "admin-navbar-link" +
              (location.pathname === "/login" ? " active" : "")
            }
            to="/login"
          >
            Login
          </Link>
        )}

        {/* ADMIN links (only when logged in) */}
        {isLoggedIn && (
          <>
            <Link
              className={
                "admin-navbar-link" +
                (location.pathname === "/cities" ? " active" : "")
              }
              to="/cities"
            >
              Cities
            </Link>

            <Link
              className={
                "admin-navbar-link" +
                (location.pathname === "/customers" ? " active" : "")
              }
              to="/customers"
            >
              Customers
            </Link>

            <Link
              className={
                "admin-navbar-link" +
                (location.pathname === "/parkingzones" ? " active" : "")
              }
              to="/parkingzones"
            >
              Parkings
            </Link>

            <Link
              className={
                "admin-navbar-link" +
                (location.pathname === "/chargingstations" ? " active" : "")
              }
              to="/chargingstations"
            >
              Charging Station
            </Link>

            <Link
              className={
                "admin-navbar-link" +
                (location.pathname === "/about" ? " active" : "")
              }
              to="/about"
            >
              About
            </Link>

            <Link
              className={
                "admin-navbar-link" +
                (location.pathname === "/contact" ? " active" : "")
              }
              to="/contact"
            >
              Contact
            </Link>

            {/* Logout */}
            <button
              className="admin-navbar-link logout-link"
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
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
