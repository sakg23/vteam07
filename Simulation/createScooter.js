const axios = require("axios");

const API_URL = "http://localhost:5000/v1/bikes/add";

// Sample city ID (adjust to match your DB)
const cityId = 1;

// Helper to generate random float
function getRandomCoord(base, range = 0.01) {
  return parseFloat((base + (Math.random() - 0.5) * range).toFixed(6));
}

async function createScooters(count) {
  for (let i = 1; i <= count; i++) {
    const serialNumber = `scooter-${Date.now()}-${i}`;
    const latitude = getRandomCoord(59.3293);
    const longitude = getRandomCoord(18.0686);

    const data = {
      serial_number: serialNumber,
      city_id: cityId,
      latitude,
      longitude,
    };

    try {
      const res = await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(`Scooter added: ${serialNumber}`);
    } catch (err) {
      console.error(`Failed to add ${serialNumber}:`, err.response?.data || err.message);
    }
  }
}

createScooters(10); // Adjust how many scooters you want to create
