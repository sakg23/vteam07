const express = require("express");
const router = express.Router();
const citiesModules = require('../src/modules/city');
// const checkAuth = require("../middleware/check-auth.js"); // Middleware för att verifiera om användaren är inloggad
// const citiesModules = require("../src/cities/modules.js"); // Import av moduler som hanterar cities i databasen
// const checkAdmin = require("../middleware/check-admin.js"); // Middleware för att kontrollera administratörsbehörighet

router.get("/", async (req, res) => {
//   try {
//     // Hämtar alla städer från databasen via modulen
//     const cities = await citiesModules.getCities();
//     // Returnerar resultatet som JSON med statuskod 200
//     res.status(200).json({
//       status: "success",
//       cities: cities,
//     });
//   } catch (error) {
//     // Vid fel skickas statuskod 500 och ett felmeddelande
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
    try {
        const cities = await citiesModules.getCities();
        let selectedCity = null;
        const cityId = req.query.cityId;

        // Om någon stad är vald via querystring (?cityId=2)
        if (cityId) {
            selectedCity = cities.find(c => c.id == cityId);
        }

        res.render('database/cities', { cities, selectedCity });
    } catch (err) {
        res.render('database/cities', { cities: [], selectedCity: null });
    }
});

module.exports = router;