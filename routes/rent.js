const express = require('express');
const router = express.Router();
const db = require('../src/db/connection');

// router.post('/:scooterId', async (req, res) => {
//     const scooterId = req.params.scooterId;
//     const userId = req.user?.id || 1;
//     try {
//         await db.execute('CALL rent_scooter(?, ?)', [userId, scooterId]);
//         res.redirect('/customer?message=success');
//     } catch (err) {
//         res.status(500).send('Failed to rent scooter');
//     }
// });

// Rent scooter

router.get('/api/scooters', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, current_latitude AS lat, current_longitude AS lng FROM bikes WHERE status = "available"'
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching scooters:', err);
        res.status(500).json({ error: 'Failed to fetch scooters.' });
    }
});



router.post('/rent/:scooterId', async (req, res) => {
    const scooterId = req.params.scooterId;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).send('Unauthorized: Please log in.');
    }

    try {
        await db.execute('CALL rent_scooter(?, ?)', [userId, scooterId]);
        res.redirect('/customer?message=success');
    } catch (err) {
        console.error('Error renting scooter:', err);
        res.status(500).send('Failed to rent scooter.');
    }
});

module.exports = router;
