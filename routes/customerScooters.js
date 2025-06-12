const express = require('express');
const router = express.Router();
const db = require('../src/db/connection');

router.get('/api/scooters', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, current_latitude AS lat, current_longitude AS lng FROM bikes WHERE status = "available"');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching scooters:', err);
        res.status(500).json({ error: 'Failed to fetch scooters.' });
    }
});

module.exports = router;
