const express = require("express");
const router = express.Router();
const parkingModules = require('../src/modules/parking');

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

module.exports = router;
