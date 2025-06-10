import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: string;
};

const Customers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/v1/user");
        if (!res.ok) throw new Error("Fel vid hämtning");
        const data = await res.json();
        setUsers(data.users);
      } catch {
        setError("Kunde inte hämta användare.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Ta bort användare?")) return;
    try {
      const res = await fetch(`http://localhost:5000/v1/user/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Fel vid borttagning");
      setUsers(users.filter((u) => u.id !== id));
    } catch {
      alert("Kunde inte ta bort användare.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Kunder</h2>

      {loading && <div>Laddar...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && users.length === 0 && <div>Inga användare.</div>}

      {users.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>E-post</th>
              <th>Namn</th>
              <th>Telefon</th>
              <th>Roll</th>
              <th>Ta bort</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Ta bort
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Customers;
