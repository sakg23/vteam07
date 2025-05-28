const express = require("express");
const router = express.Router();
const travelModules = require("../src/modules/travels");

// Hämta alla resor
router.get("/", async (req, res) => {
    try {
        const rides = await travelModules.getTravels();
        res.status(200).json({
            status: "success",
            travels: rides,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

// Lägg till ny resa
router.post("/add", async (req, res) => {
    try {
        const {
            bike_id,
            user_id,
            start_latitude,
            start_longitude
        } = req.body;

        const result = await travelModules.addTravel(
            bike_id,
            user_id,
            start_latitude,
            start_longitude
        );

        if (result.error) {
            return res.status(500).json({ message: "Server error", error: result.error });
        }

        res.status(200).json({
            status: "success",
            message: "Travel started",
            ride_id: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

// Ta bort resa (via ID)
router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const existing = await travelModules.getTravelById(id);
        if (!existing || existing.length === 0) {
            return res.status(404).json({ message: "Travel not found" });
        }

        await travelModules.deleteTravel(id);
        res.status(200).json({ message: "Travel deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

module.exports = router;
