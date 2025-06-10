import AddCity from "../components/AddCities";
import citiesModules from "../modules/citiesFunctions";
import Alert from "../components/Alert";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authModules from "../modules/auth";

const AddCityForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authModules.token) {
      navigate("/login");
    }
  }, []);

  const [checkResult, setCheckResult] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const handleFormSubmit = async (values: {
    name: string;
    region: string;
  }) => {
    try {
      const result = await citiesModules.addCity(values.name, values.region);
      if (result === "ok") {
        navigate("/cities"); // Navigera till hemsidan efter lyckad inloggning
        setCheckResult(true);
        setColor("alert-success");
        setMessage("City has been added");
      } else {
        setCheckResult(true);
        setColor("alert-danger");
        setMessage(result); // Visa felmeddelande om inloggningen misslyckas
      }
    } catch (error) {
      console.error("Error during adding city", error);
      setCheckResult(true); // Visa felmeddelande vid ett oväntat fel
      setColor("alert-danger");
      setMessage("Error during adding city");
    }
  };
  return (
    <>
      {checkResult && <Alert color={color} message={message} />}
      <AddCity onSubmit={handleFormSubmit} />
    </>
  );
};

export default AddCityForm;
