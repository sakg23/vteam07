const express = require('express');
const router = express.Router();
const db = require('../src/db/connection');

router.post('/:scooterId', async (req, res) => {
    const scooterId = req.params.scooterId;
    const userId = req.user?.id || 1;
    try {
        await db.execute('CALL return_scooter(?, ?)', [userId, scooterId]);
        res.redirect('/paymentCustomer');
    } catch (err) {
        res.status(500).send('Failed to return scooter');
    }
});

module.exports = router;
