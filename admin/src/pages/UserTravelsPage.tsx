import { useParams } from "react-router-dom";

const UserTravelsPage = () => {
  const { userId } = useParams();

  return (
    <div className="container mt-4">
      <h2>Resor för användare {userId}</h2>
      <p>
        Här visas alla resor och historik för användaren.
      </p>
      {/* Lägg till resehistorik här */}
    </div>
  );
};

export default UserTravelsPage;
