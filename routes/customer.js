const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('database/customer', {
        user: req.user,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        query: req.query
    });
});

module.exports = router;
