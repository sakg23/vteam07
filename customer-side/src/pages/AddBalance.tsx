import { useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../modules/auth";

const AddBalance = () => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setError("Kunde inte hitta användar-ID.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Ange ett giltigt belopp.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/v1/user/update/balance", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          amount: numAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Kunde inte uppdatera saldo.");
      }
      setSuccess("Saldo har uppdaterats!");
      setTimeout(() => {
        navigate("/Dashboard");
      }, 1000);
    } catch (err) {
      setError("Kunde inte uppdatera saldo.");
    }
  };

  return (
    <div className="customer-dashboard-main">
      <div className="customer-dashboard-card">
        <h2 className="customer-dashboard-title">Fyll på saldo</h2>
        <form className="login-form" onSubmit={handleSubmit} style={{marginTop: "1.1rem"}}>
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Belopp (SEK)
            </label>
            <input
              type="number"
              className="form-control"
              id="amount"
              name="amount"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button type="submit">Bekräfta</button>
        </form>
        {error && <div className="text-danger" style={{marginTop: "0.7rem", textAlign: "center"}}>{error}</div>}
        {success && <div style={{color: "#389660", marginTop: "0.7rem", textAlign: "center"}}>{success}</div>}
      </div>
    </div>
  );
};

export default AddBalance;
