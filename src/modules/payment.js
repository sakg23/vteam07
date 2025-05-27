const connectToDatabase = require('./../db/connection');

// Hämta alla betalningar
async function getPayments() {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM payments');
    await db.end();
    return rows;
}

// Lägg till betalning (enkel version)
async function addPayment(user_id, amount, type = 'ride', status = 'completed') {
    const db = await connectToDatabase();
    await db.query(
        'INSERT INTO payments (user_id, amount, type, status) VALUES (?, ?, ?, ?)',
        [user_id, amount, type, status]
    );
    await db.end();
}

module.exports = { getPayments, addPayment };
