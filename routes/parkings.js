const express = require("express");
const router = express.Router();
const parkingModules = require('../src/modules/parking');

// Hämta alla parkeringszoner
router.get("/", async (req, res) => {
    try {
        const parkings = await parkingModules.getParkingZones();
        res.status(200).json({
            status: "success",
            parkings: parkings,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

// Lägg till ny parkeringszon
router.post("/add", async (req, res) => {
    try {
        const { name, city_id, latitude, longitude, radius } = req.body;

        const existingZones = await parkingModules.getParkingZoneByName(name);
        if (existingZones.length > 0) {
            return res.status(409).json({ message: "Parking zone already exists" });
        }

        const result = await parkingModules.addParkingZone(name, city_id, latitude, longitude, radius);

        if (result.error) {
            return res.status(500).json({ message: "Server error", error: result.error });
        }

        res.status(200).json({
            status: "success",
            message: "Parking zone has been added",
            zone_id: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

// Ta bort parkeringszon med namn
router.delete("/:name", async (req, res) => {
    const name = req.params.name;

    try {
        const existingZone = await parkingModules.getParkingZoneByName(name);
        if (!existingZone || existingZone.length === 0) {
            return res.status(404).json({ message: "Parking zone not found" });
        }

        await parkingModules.deleteParkingZone(name);
        res.status(200).json({ message: "Parking zone deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

module.exports = router;
