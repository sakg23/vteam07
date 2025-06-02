import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ParkingForm = {
  name: string;
  city_id: string;
  latitude: string;
  longitude: string;
  radius: string;
};

const AddParking = () => {
  const [form, setForm] = useState<ParkingForm>({
    name: "",
    city_id: "",
    latitude: "",
    longitude: "",
    radius: "50",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/v1/parking/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          city_id: Number(form.city_id),
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          radius: Number(form.radius),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Kunde inte lägga till parkering.");
      }
      navigate("/parkingzones");
    } catch (err: any) {
      setError(err.message || "Kunde inte lägga till parkering.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 500 }}>
      <h2>Lägg till parkering</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Namn</label>
          <input
            type="text"
            className="form-control"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Stad ID</label>
          <input
            type="number"
            className="form-control"
            name="city_id"
            required
            value={form.city_id}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Latitud</label>
          <input
            type="number"
            step="any"
            className="form-control"
            name="latitude"
            required
            value={form.latitude}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Longitud</label>
          <input
            type="number"
            step="any"
            className="form-control"
            name="longitude"
            required
            value={form.longitude}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Radie (meter)</label>
          <input
            type="number"
            className="form-control"
            name="radius"
            required
            value={form.radius}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? "Lägger till..." : "Lägg till"}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/parkingzones")}
        >
          Avbryt
        </button>
      </form>
    </div>
  );
};

export default AddParking;
