const axios = require("axios");

const API_URL = "http://localhost:5000/v1/bikes/add";

// Adjust these to match your DB city IDs!
const cityIds = {
  "Karlskrona": 1,
  "Göteborg": 2,
  "Stockholm": 3,
};

const cityPositions = {
  "Karlskrona": { lat: 56.1612, long: 15.5869 },
  "Göteborg": { lat: 57.7089, long: 11.9746 },
  "Stockholm": { lat: 59.3293, long: 18.0686 },
};

// Helper to generate random float
function getRandomCoord(base, range = 0.005) {
  return parseFloat((base + (Math.random() - 0.5) * (range / 3)).toFixed(6));
}

async function createScooters(count) {
  const perCity = Math.floor(count / 3);
  let scooterNumber = 1;

  const addScootersForCity = async (cityName, number) => {
    const base = cityPositions[cityName];
    const city_id = cityIds[cityName];

    for (let i = 0; i < number; i++) {
      const serialNumber = `scooter-${Date.now()}-${scooterNumber++}`;
      const latitude = getRandomCoord(base.lat);
      const longitude = getRandomCoord(base.long);

      const data = {
        serial_number: serialNumber,
        city_id,
        latitude,
        longitude,
      };

      try {
        const res = await axios.post(API_URL, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(`Scooter added: ${serialNumber} in ${cityName}`);
      } catch (err) {
        console.error(
          `Failed to add ${serialNumber} in ${cityName}:`,
          err.response?.data || err.message
        );
      }
    }
  };

  // Add 1/3 per city
  await addScootersForCity("Karlskrona", perCity);
  await addScootersForCity("Göteborg", perCity);
  await addScootersForCity("Stockholm", count - perCity * 2); // remaining in Stockholm
}

createScooters(1000);
