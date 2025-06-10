const axios = require("axios");

const API_URL = "http://localhost:5000/v1/travels/add";

function getRandomCoord(base, range = 0.01) {
  return parseFloat((base + (Math.random() - 0.5) * range).toFixed(6));
}

// Create N rides for a specific user and bike
async function createRidesFor(count) {
  for (let i = 1; i <= count; i++) {
    const start_latitude = getRandomCoord(59.3293);
    const start_longitude = getRandomCoord(18.0686);

    const data = {
      bike_id : i,
      user_id : i,
      start_latitude,
      start_longitude,
    };

    try {
      const res = await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(`Ride ${i} started for user ${i}, bike ${i}`);
    } catch (err) {
      console.error(`Ride ${i} failed:`, err.response?.data || err.message);
    }
  }
}

// 🧪 Example usage
createRidesFor(1000);