const express = require('express');
const router = express.Router();
const db = require('../src/db/connection');

// Show payment page to customer
router.get('/', (req, res) => {
    res.render('/database/paymentCustomer', { amount: 50 }); 
});

// Handle payment confirmation
router.post('/confirm', async (req, res) => {
    const userId = req.user?.id || 1;

    try {
        await db.execute('CALL mark_payment_complete(?)', [userId]);
        res.redirect('/customer?message=payment_success');
    } catch (err) {
        console.error('Error confirming payment:', err);
        res.status(500).send('Failed to confirm payment.');
    }
});

module.exports = router;

