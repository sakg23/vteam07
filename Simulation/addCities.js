const axios = require("axios");

const API_URL = "http://localhost:5000/v1/cities/add";

const cities = [
  { name: "Karlskrona", region: "Blekinge" },
  { name: "Göteborg", region: "Västra Götaland" },
  { name: "Stockholm", region: "Stockholm" },
];

async function addCities() {
  for (const city of cities) {
    try {
      const res = await axios.post(API_URL, city, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(`City added: ${city.name} →`, res.data);
    } catch (err) {
      console.error(
        `Failed to add city ${city.name}:`,
        err.response?.data || err.message
      );
    }
  }
}

module.exports =  { addCities };
