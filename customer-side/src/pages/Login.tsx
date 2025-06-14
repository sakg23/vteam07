import LoginForm from "../components/LoginForm";
import authModules from "../modules/auth";
import Alert from "../components/Alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [checkLogin, setCheckLogin] = useState(false);
  const navigate = useNavigate();
  const handleFormSubmit = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      const result = await authModules.login(values.email, values.password);

    if (result === "ok") {
      sessionStorage.setItem("userEmail", values.email); // Save the email
      navigate("/Dashboard");
    } else {
        setCheckLogin(true); // Visa felmeddelande om inloggningen misslyckas
      }
    } catch (error) {
      console.error("Error during logging in:", error);
      setCheckLogin(true); // Visa felmeddelande vid ett oväntat fel
    }
  };
  return (
    <>
      {checkLogin && <Alert color="alert-danger" message="Auth faild" />}
      <LoginForm onSubmit={handleFormSubmit} />
    </>
  );
};

export default Login;