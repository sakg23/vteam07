import citiesModules from "../modules/citiesFunctions";
import AddButton from "./AddButton";
import React, { useEffect, useState } from "react";
interface City {
  id?: number;
  name: string;
  region: string;
}

const GetCities: React.FC = () => {
  const [cityList, setCityList] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const result = await citiesModules.getcities();
        if (result.status === "success") {
          setCityList(result.cities);
        } else {
          setError("Failed to fetch cities from API");
        }
      } catch (err) {
        setError("An error occurred while fetching cities");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  if (loading) {
    return <p>Loading cities...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>List of Cities</h1>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Region</th>
          </tr>
        </thead>
        <tbody>
          {cityList.map((city) => (
            <tr key={city.id}>
              <th scope="row">{city.id}</th>
              <td>{city.name}</td>
              <td>{city.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
<AddButton page="addcity" text="city" /></div>
  );
};

export default GetCities;