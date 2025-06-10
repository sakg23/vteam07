const express = require("express");
const router = express.Router();
const chargingStationsModules = require('../src/modules/chargingstation');
const checkAuth = require("../middleware/check-auth.js"); // Middleware för att kontrollera autentisering

router.get("/", async (req, res) => {
    try {
        const stations = await chargingStationsModules.getChargingStations();
        res.status(200).json({
            status: "success",
            stations: stations,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

// Endpoint för att ta bort en laddstaion baserat på dess ID
router.delete("/:name", async (req, res) => {
  const name = req.params.name; // Hämtar name från URL-parametern

  try {
    // Kontrollera om laddstaion finns
    const existingChargingStations =
      await chargingStationsModules.getChargingStationName(name);

    if (!existingChargingStations || existingChargingStations.length === 0) {
      return res.status(404).json({ message: "Charging station not found" });
    }

    // Tar bort laddstaion från databasen
    await chargingStationsModules.deleteChargingStation(name);

    res.status(200).json({ message: "Charging station deleted successfully" });
  } catch (error) {
    // Vid fel skickas statuskod 500 och ett felmeddelande
    console.error("Error deleting charging station:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }

});

// Endpoint för att lägga till en ny laddingsstation

router.post("/add", async (req, res) => {
  try {
    // Extraherar data från request-body
    const { name, city_id, latitude, longitude } = req.body;

    const existingChargingStations =
        await chargingStationsModules.getChargingStationName(name);
    if (existingChargingStations.length > 0) {
      return res.status(409).json({ message: "Chargingstation exists" }); // Konflikt om platsen redan finns
    }

    // Lägger till den nya laddningsstation i databasen
    const result = await chargingStationsModules.addChargingStation(
      name,
      city_id,
      latitude,
      longitude
    );

    if (result.error) {
      // Vid fel skickas statuskod 500 och ett felmeddelande
      return res.status(500).json({
        message: "Server error",
        error: result.error,
      });
    }

    res.status(200).json({
      status: "success",
      message: "chargingstation has been added",
      location_id: result,
    });
  } catch (error) {
    // Vid fel skickas statuskod 500 och ett felmeddelande
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
