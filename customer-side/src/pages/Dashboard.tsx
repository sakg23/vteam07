import auth from "../modules/auth";
import { useState, useEffect } from "react";
// import AddButtons from "../components/AddButtons.tsx";
import "../assets/css/login.css"; // Adjust the path if needed

function Dashboard() {
  const [tokenChecker, setTokenChecker] = useState(true);

  useEffect(() => {
    if (!auth.token) {
      setTokenChecker(false);
    }
  }, []);

  return (
    <div className="customer-dashboard-main">
      <div className="customer-dashboard-card">
        {/* This is your old logic, now inside the styled card */}
        {tokenChecker && <h2 className="customer-dashboard-title">hello</h2>}
        <h2 className="customer-dashboard-title">Welcome to home page</h2>
        {/* 
        <AddButtons page="addcity" text="city" />
        <AddButtons page="addparking" text="parking" />
        <AddButtons page="addstation" text="charging station" /> 
        */}
      </div>
    </div>
  );
}

export default Dashboard;



