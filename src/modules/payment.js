const connectToDatabase = require('./../db/connection');

// Lägg till betalning via procedur
async function addPayment(user_id, ride_id, amount, type, status, provider, reference) {
    const db = await connectToDatabase();
    try {
        const [result] = await db.query(
            'CALL insert_payment(?, ?, ?, ?, ?, ?, ?)',
            [user_id, ride_id, amount, type, status, provider, reference]
        );
        return result;
    } catch (error) {
        return { error: error.message };
    } finally {
        await db.end();
    }
}

// Hämta alla betalningar
async function getPayments() {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM payments');
    await db.end();
    return rows;
}

// Hämta betalning via ID
async function getPaymentById(id) {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM payments WHERE id = ?', [id]);
    await db.end();
    return rows;
}

// Ta bort betalning via ID
async function deletePayment(id) {
    const db = await connectToDatabase();
    await db.query('DELETE FROM payments WHERE id = ?', [id]);
    await db.end();
}

module.exports = {
    addPayment,
    getPayments,
    getPaymentById,
    deletePayment
};
