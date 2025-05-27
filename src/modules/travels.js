const connectToDatabase = require('./../db/connection');

// Hämta alla resor
async function getTravels() {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM rides');
    await db.end();
    return rows;
}

// Lägg till ny resa (exempel, du kan utöka med fler kolumner efter behov)
async function addTravel(bike_id, user_id, start_latitude, start_longitude) {
    const db = await connectToDatabase();
    await db.query(
        'INSERT INTO rides (bike_id, user_id, start_time, start_latitude, start_longitude, status) VALUES (?, ?, NOW(), ?, ?, "active")',
        [bike_id, user_id, start_latitude, start_longitude]
    );
    await db.end();
}

module.exports = { getTravels, addTravel };
