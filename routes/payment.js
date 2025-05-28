const express = require("express");
const router = express.Router();
const paymentModules = require('../src/modules/payment');

// Hämta alla betalningar
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

// Lägg till ny betalning
router.post("/add", async (req, res) => {
    try {
        const { user_id, ride_id, amount, type, status, provider, reference } = req.body;

        const result = await paymentModules.addPayment(
            user_id, ride_id, amount, type, status, provider, reference
        );

        if (result.error) {
            return res.status(500).json({ message: "Server error", error: result.error });
        }

        res.status(200).json({
            status: "success",
            message: "Payment added",
            payment_id: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

// Ta bort betalning (via ID)
router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const existingPayment = await paymentModules.getPaymentById(id);
        if (!existingPayment || existingPayment.length === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        await paymentModules.deletePayment(id);
        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

module.exports = router;
