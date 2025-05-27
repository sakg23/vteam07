const express = require("express");
const router = express.Router();
const chargingStationModules = require('../src/modules/chargingstation');

router.get("/", async (req, res) => {
    try {
        const stations = await chargingStationModules.getChargingStations();
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

module.exports = router;
