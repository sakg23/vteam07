const express = require("express");
const router = express.Router();
const bikeModules = require('../src/modules/bike');

router.get("/", async (req, res) => {
    try {
        const bikes = await bikeModules.getBikes();
        res.status(200).json({
            status: "success",
            bikes: bikes,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

module.exports = router;
