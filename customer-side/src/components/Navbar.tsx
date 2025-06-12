import { Link, useLocation, useNavigate } from "react-router-dom";
import auth from "../modules/auth";
import "../assets/css/index.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!auth.token;

  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };

  return (
    <nav className="customer-navbar">
      <div className="customer-navbar-brand">Vteam07</div>
      <div className="customer-navbar-links">
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

        {isLoggedIn && (
          <Link
            className={
              "customer-navbar-link" +
              (location.pathname === "/history" ? " active" : "")
            }
            to="/History"
          >
            History
          </Link>
        )}

        {!isLoggedIn && location.pathname !== "/register" && (
          <Link
            className={
              "customer-navbar-link" +
              (location.pathname === "/register" ? " active" : "")
            }
            to="/Register"
          >
            Register
          </Link>
        )}

        {!isLoggedIn && location.pathname !== "/" && (
          <Link
            className={
              "customer-navbar-link" +
              (location.pathname === "/" ? " active" : "")
            }
            to="/"
          >
            Login
          </Link>
        )}

        {isLoggedIn && (
          <button
            className="customer-navbar-link logout-link"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
