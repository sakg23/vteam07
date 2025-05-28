const express = require("express");
const router = express.Router();
const cityModules = require("../src/modules/city");

// Hämta alla städer
router.get("/", async (req, res) => {
    try {
        const cities = await cityModules.getCities();
        res.status(200).json({
            status: "success",
            cities: cities,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

// Lägg till ny stad
router.post("/add", async (req, res) => {
    try {
        const { name, region } = req.body;

        const existing = await cityModules.getCityByName(name);
        if (existing.length > 0) {
            return res.status(409).json({ message: "City already exists" });
        }

        const result = await cityModules.addCity(name, region);

        if (result.error) {
            return res.status(500).json({ message: "Server error", error: result.error });
        }

        res.status(200).json({
            status: "success",
            message: "City added",
            city_id: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

// Radera stad via namn
router.delete("/:name", async (req, res) => {
    const name = req.params.name;

    try {
        const existing = await cityModules.getCityByName(name);
        if (!existing || existing.length === 0) {
            return res.status(404).json({ message: "City not found" });
        }

        await cityModules.deleteCity(name);
        res.status(200).json({ message: "City deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

module.exports = router;
