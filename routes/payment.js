const express = require("express");
const router = express.Router();
const paymentModules = require('../src/modules/payment');

router.get("/", async (req, res) => {
    try {
        const payments = await paymentModules.getPayments();
        res.status(200).json({
            status: "success",
            payments: payments,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

module.exports = router;
