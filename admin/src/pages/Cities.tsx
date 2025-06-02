import GetCities from "../components/GetCities";
import authModules from "../modules/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Cities() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authModules.token) {
      navigate("/login");
    }
  }, []);

  return <GetCities />;
}

export default Cities;