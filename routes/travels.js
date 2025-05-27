const express = require("express");
const router = express.Router();
const travelsModules = require('../src/modules/travels');

router.get("/", async (req, res) => {
    try {
        const travels = await travelsModules.getTravels();
        res.status(200).json({
            status: "success",
            travels: travels,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

module.exports = router;
