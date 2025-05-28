const express = require("express");
const router = express.Router();
const scooterModules = require('../src/modules/bike');

// Hämta alla scooters
router.get("/", async (req, res) => {
    try {
        const scooters = await scooterModules.getScooters();
        res.status(200).json({
            status: "success",
            scooters: scooters,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

// Lägg till ny scooter
router.post("/add", async (req, res) => {
    try {
        const { serial_number, city_id, latitude, longitude } = req.body;

        const existing = await scooterModules.getScooterBySerial(serial_number);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Scooter already exists" });
        }

        const result = await scooterModules.addScooter(serial_number, city_id, latitude, longitude);

        if (result.error) {
            return res.status(500).json({ message: "Server error", error: result.error });
        }

        res.status(200).json({
            status: "success",
            message: "Scooter added",
            scooter_id: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

// Ta bort scooter via serienummer
router.delete("/:serial", async (req, res) => {
    const serial = req.params.serial;

    try {
        const existing = await scooterModules.getScooterBySerial(serial);
        if (!existing || existing.length === 0) {
            return res.status(404).json({ message: "Scooter not found" });
        }

        await scooterModules.deleteScooter(serial);
        res.status(200).json({ message: "Scooter deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

module.exports = router;
