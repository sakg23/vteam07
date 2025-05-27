const connectToDatabase = require('./../db/connection');

// Lägg till ny cykel via lagrad procedur
async function addBike(identifier, city_id, status) {
    const db = await connectToDatabase();
    await db.query('CALL insert_bike(?, ?, ?)', [identifier, city_id, status]);
    await db.end();
}

// Hämta alla cyklar
async function getBikes() {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM bikes');
    await db.end();
    return rows;
}

module.exports = { getBikes, addBike };
